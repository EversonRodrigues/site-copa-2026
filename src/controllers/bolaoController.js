const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/db.sqlite');

function getDb() {
  return new Database(DB_PATH);
}

function calcularPontos(palpiteCasa, palpiteFora, resultadoCasa, resultadoFora) {
  if (palpiteCasa === resultadoCasa && palpiteFora === resultadoFora) return 5;
  const resultadoPalpite = Math.sign(palpiteCasa - palpiteFora);
  const resultadoReal = Math.sign(resultadoCasa - resultadoFora);
  if (resultadoPalpite === resultadoReal) return 2;
  return 0;
}

function atualizarPontuacaoJogo(jogoId, gols_casa_real, gols_fora_real) {
  const db = getDb();
  const palpites = db.prepare('SELECT * FROM palpites WHERE jogo_id = ? AND pontos IS NULL').all(jogoId);

  const atualizarPalpite = db.prepare('UPDATE palpites SET pontos = ? WHERE id = ?');
  const atualizarTotal = db.prepare(`
    UPDATE pontuacao SET total_pontos = total_pontos + ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE usuario_id = ?
  `);

  const transacao = db.transaction(() => {
    for (const p of palpites) {
      const pontos = calcularPontos(p.gols_casa, p.gols_fora, gols_casa_real, gols_fora_real);
      atualizarPalpite.run(pontos, p.id);
      atualizarTotal.run(pontos, p.usuario_id);
    }
  });

  transacao();
  return palpites.length;
}

async function paginaMeusPalpites(req, res) {
  const db = req.app.locals.db;
  const usuario_id = req.session.usuario.id;

  // Busca jogos futuros do cache para exibir formulário de palpite
  const jogosCache = db.prepare(`
    SELECT jogo_id_api, dados_json FROM jogos_cache
    WHERE jogo_id_api NOT IN ('jogos_todos', 'grupos', 'selecoes')
    AND jogo_id_api NOT LIKE 'jogos_fase_%'
    AND jogo_id_api NOT LIKE 'selecao_%'
    ORDER BY atualizado_em DESC
    LIMIT 200
  `).all();

  const agora = new Date();
  const limite = new Date(agora.getTime() + 60 * 60 * 1000); // 1h de prazo

  const jogosFuturos = jogosCache
    .map(j => { try { return JSON.parse(j.dados_json); } catch { return null; } })
    .filter(j => j && j.inicio && new Date(j.inicio) > limite && j.status === 'em_breve');

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
  const resultadosCertos = palpitesHistorico.filter(p => p.pontos === 2).length;
  const erros = palpitesHistorico.filter(p => p.pontos === 0).length;

  res.render('pages/meus-palpites', {
    titulo: 'Meus Palpites',
    palpites: palpitesHistorico,
    palpitesEditaveis,
    jogos: jogosDisponiveis,
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

module.exports = { atualizarPontuacaoJogo, paginaMeusPalpites };
