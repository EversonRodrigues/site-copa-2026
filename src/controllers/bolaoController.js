const Database = require('better-sqlite3');
const { DB_PATH } = require('../../database/init');
const { getTodasSelecoes } = require('../services/selecoesData');
const { getTodosJogosEstaticos } = require('../services/jogosEstaticos');
const { bandeiraDe } = require('../services/bandeiras');
const { calcularPremio } = require('../services/premio');
const { aplicarConfrontos, jogoDefinido } = require('../services/mataMata');

// Bônus por acertar o campeão da Copa (regulamento)
const BONUS_CAMPEAO = 15;

// Prazo: palpites fecham 5 minutos antes do início de cada jogo
const PRAZO_PALPITE_MS = 5 * 60 * 1000;
// Limite a partir do qual o palpite NÃO é mais aceito (início - 5 min)
function limitePalpite(inicio) {
  return new Date(new Date(inicio).getTime() - PRAZO_PALPITE_MS);
}

function getDb() {
  return new Database(DB_PATH);
}

function calcularPontos(palpiteCasa, palpiteFora, resultadoCasa, resultadoFora) {
  if (palpiteCasa === resultadoCasa && palpiteFora === resultadoFora) return 5;
  const resultadoPalpite = Math.sign(palpiteCasa - palpiteFora);
  const resultadoReal = Math.sign(resultadoCasa - resultadoFora);
  if (resultadoPalpite === resultadoReal) return 3;
  return 0;
}

// Início do primeiro jogo da Copa = prazo limite para palpitar o campeão
function prazoCampeao() {
  const inicios = getTodosJogosEstaticos()
    .map(j => j.inicio)
    .filter(Boolean)
    .sort();
  return inicios[0] || null;
}

// Premia +15 pts quem acertou o campeão. Registra o campeão real em config.
function processarBonusCampeao(selecao) {
  const db = getDb();
  db.prepare(`
    INSERT INTO config (chave, valor, atualizado_em) VALUES ('campeao_copa', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = CURRENT_TIMESTAMP
  `).run(selecao);

  const palpites = db.prepare('SELECT * FROM palpite_campeao WHERE pontos IS NULL').all();
  const atualizarPalpite = db.prepare('UPDATE palpite_campeao SET pontos = ?, atualizado_em = CURRENT_TIMESTAMP WHERE usuario_id = ?');
  const atualizarTotal = db.prepare(`
    UPDATE pontuacao SET total_pontos = total_pontos + ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE usuario_id = ?
  `);

  const transacao = db.transaction(() => {
    for (const p of palpites) {
      const pontos = p.selecao === selecao ? BONUS_CAMPEAO : 0;
      atualizarPalpite.run(pontos, p.usuario_id);
      if (pontos) atualizarTotal.run(pontos, p.usuario_id);
    }
  });

  transacao();
  return palpites.length;
}

// (Re)calcula os pontos de todos os palpites de um jogo conforme o placar real.
// Corrigível: ajusta o total pela diferença (pontos novos - antigos), então pode
// ser reexecutado se o resultado for corrigido, sem somar em dobro.
function atualizarPontuacaoJogo(db, jogoId, gols_casa_real, gols_fora_real) {
  const palpites = db.prepare('SELECT id, usuario_id, gols_casa, gols_fora, pontos FROM palpites WHERE jogo_id = ?').all(String(jogoId));

  const atualizarPalpite = db.prepare('UPDATE palpites SET pontos = ? WHERE id = ?');
  const atualizarTotal = db.prepare(`
    UPDATE pontuacao SET total_pontos = total_pontos + ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE usuario_id = ?
  `);

  const transacao = db.transaction(() => {
    for (const p of palpites) {
      const novo = calcularPontos(p.gols_casa, p.gols_fora, gols_casa_real, gols_fora_real);
      const antigo = p.pontos == null ? 0 : p.pontos;
      if (novo !== antigo) {
        atualizarPalpite.run(novo, p.id);
        atualizarTotal.run(novo - antigo, p.usuario_id);
      }
    }
  });

  transacao();
  return palpites.length;
}

// Grava (ou corrige) o placar final de um jogo e contabiliza os pontos.
function registrarResultado(db, jogoId, golsCasa, golsFora, fonte = 'manual') {
  const gc = Number(golsCasa);
  const gf = Number(golsFora);
  if (!Number.isInteger(gc) || !Number.isInteger(gf) || gc < 0 || gf < 0) {
    throw new Error('Placar inválido');
  }
  db.prepare(`
    INSERT INTO resultados (jogo_id, gols_casa, gols_fora, fonte, atualizado_em)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id) DO UPDATE SET
      gols_casa = excluded.gols_casa, gols_fora = excluded.gols_fora,
      fonte = excluded.fonte, atualizado_em = CURRENT_TIMESTAMP
  `).run(String(jogoId), gc, gf, fonte);
  atualizarPontuacaoJogo(db, jogoId, gc, gf);
}

// Remove o resultado de um jogo e zera os pontos correspondentes (corrigindo o total).
function removerResultado(db, jogoId) {
  const palpites = db.prepare('SELECT id, usuario_id, pontos FROM palpites WHERE jogo_id = ? AND pontos IS NOT NULL').all(String(jogoId));
  const zerar = db.prepare('UPDATE palpites SET pontos = NULL WHERE id = ?');
  const subtrair = db.prepare('UPDATE pontuacao SET total_pontos = total_pontos - ?, atualizado_em = CURRENT_TIMESTAMP WHERE usuario_id = ?');
  const tx = db.transaction(() => {
    for (const p of palpites) {
      subtrair.run(p.pontos, p.usuario_id);
      zerar.run(p.id);
    }
    db.prepare('DELETE FROM resultados WHERE jogo_id = ?').run(String(jogoId));
  });
  tx();
}

function getResultadosMap(db) {
  const map = {};
  db.prepare('SELECT jogo_id, gols_casa, gols_fora, fonte FROM resultados').all()
    .forEach(r => { map[r.jogo_id] = r; });
  return map;
}

// Automático: para cada jogo encerrado com placar (vindo da TheSportsDB), grava o
// resultado e contabiliza — SEM sobrescrever um resultado lançado manualmente.
function autoRegistrarResultados(db, jogos) {
  const manuais = new Set(
    db.prepare("SELECT jogo_id FROM resultados WHERE fonte = 'manual'").all().map(r => r.jogo_id)
  );
  let n = 0;
  for (const j of jogos) {
    if (j.status === 'encerrado' && Number.isInteger(j.gols_casa) && Number.isInteger(j.gols_fora) && !manuais.has(String(j.id))) {
      try { registrarResultado(db, j.id, j.gols_casa, j.gols_fora, 'api'); n++; } catch { /* ignora */ }
    }
  }
  return n;
}

async function paginaMeusPalpites(req, res) {
  const db = req.app.locals.db;
  const usuario_id = req.session.usuario.id;

  const agora = new Date();

  // Fixtures vêm da fonte estática (IDs estáveis) com os confrontos de mata-mata
  // já definidos pelo admin. Regulamento: palpites permitidos até o início do jogo.
  // Só entram jogos futuros com os DOIS times definidos — jogos de grupo sempre;
  // mata-mata só depois que o admin define os times (senão ficam ocultos).
  const jogosFuturos = aplicarConfrontos(db, getTodosJogosEstaticos())
    .filter(j => j.inicio && limitePalpite(j.inicio) > agora && jogoDefinido(j))
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

  // Palpites já feitos pelo usuário
  const palpitesFeitos = db.prepare(`
    SELECT p.jogo_id, p.gols_casa, p.gols_fora, p.pontos, jc.dados_json
    FROM palpites p
    LEFT JOIN jogos_cache jc ON jc.jogo_id_api = p.jogo_id
    WHERE p.usuario_id = ?
    ORDER BY p.criado_em DESC
  `).all(usuario_id).map(p => {
    let jogo = {};
    try { jogo = JSON.parse(p.dados_json || '{}'); } catch {}
    return {
      ...p,
      timeCasa: jogo.timeCasa || '-',
      timeFora: jogo.timeFora || '-',
      resultado: jogo.gols_casa !== null && jogo.gols_fora !== null
        ? `${jogo.gols_casa} x ${jogo.gols_fora}` : null
    };
  });

  // Separa palpites em: editáveis (jogo futuro) e histórico (jogo passado/encerrado)
  const jogosFuturosMap = {};
  jogosFuturos.forEach(j => { jogosFuturosMap[String(j.id)] = j; });

  const palpitesEditaveis = palpitesFeitos
    .filter(p => jogosFuturosMap[p.jogo_id])
    .map(p => ({ ...p, jogo: jogosFuturosMap[p.jogo_id] }));

  const palpitesHistorico = palpitesFeitos
    .filter(p => !jogosFuturosMap[p.jogo_id]);

  // Jogos futuros ainda sem palpite
  const palpitadosIds = new Set(palpitesFeitos.map(p => p.jogo_id));
  const jogosDisponiveis = jogosFuturos.filter(j => !palpitadosIds.has(String(j.id)));

  // Stats do usuário pra sidebar
  const pontuacao = db.prepare('SELECT total_pontos FROM pontuacao WHERE usuario_id = ?').get(usuario_id);
  const placarExatos = palpitesHistorico.filter(p => p.pontos === 5).length;
  const resultadosCertos = palpitesHistorico.filter(p => p.pontos === 3).length;
  const erros = palpitesHistorico.filter(p => p.pontos === 0).length;

  // Palpite de campeão (bônus +15 pts) — prazo até o primeiro jogo
  const prazoCamp = prazoCampeao();
  const campeaoAberto = !prazoCamp || agora < limitePalpite(prazoCamp);
  const meuCampeao = db.prepare('SELECT selecao, pontos FROM palpite_campeao WHERE usuario_id = ?').get(usuario_id);
  const campeaoReal = db.prepare("SELECT valor FROM config WHERE chave = 'campeao_copa'").get();
  const selecoes = getTodasSelecoes()
    .map(s => ({ nome: s.nome, bandeira: bandeiraDe(s.nome) }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  // Status do depósito (taxa de inscrição) — só libera os palpites quando confirmado pelo admin
  const usuario = db.prepare('SELECT pago FROM usuarios WHERE id = ?').get(usuario_id);
  const pixChave = db.prepare("SELECT valor FROM config WHERE chave = 'pix_chave'").get();
  const premio = calcularPremio(db);
  const pagamento = {
    pago: !!(usuario && usuario.pago),
    taxaFmt: premio.taxaFmt,
    premioFmt: premio.premioFmt,
    pix: pixChave?.valor || null
  };

  res.render('pages/meus-palpites', {
    titulo: 'Meus Palpites',
    pagamento,
    palpites: palpitesHistorico,
    palpitesEditaveis,
    jogos: jogosDisponiveis,
    campeao: {
      selecoes,
      escolha: meuCampeao?.selecao || null,
      pontos: meuCampeao?.pontos ?? null,
      aberto: campeaoAberto,
      prazo: prazoCamp,
      campeaoReal: campeaoReal?.valor || null,
      bonus: BONUS_CAMPEAO
    },
    stats: {
      total_pontos: pontuacao?.total_pontos || 0,
      total_palpites: palpitesFeitos.length,
      editaveis: palpitesEditaveis.length,
      pendentes: jogosDisponiveis.length,
      placar_exatos: placarExatos,
      resultados_certos: resultadosCertos,
      erros
    }
  });
}

module.exports = {
  atualizarPontuacaoJogo, processarBonusCampeao, paginaMeusPalpites,
  limitePalpite, PRAZO_PALPITE_MS,
  registrarResultado, removerResultado, getResultadosMap, autoRegistrarResultados
};
