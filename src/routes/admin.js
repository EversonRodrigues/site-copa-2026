const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { processarBonusCampeao, registrarResultado, removerResultado, getResultadosMap, limitePalpite } = require('../controllers/bolaoController');
const { resetarSenhaUsuario } = require('../controllers/authController');
const { getTodasSelecoes } = require('../services/selecoesData');
const { bandeiraDe } = require('../services/bandeiras');
const { calcularPremio } = require('../services/premio');
const { getTodosJogosEstaticos } = require('../services/jogosEstaticos');
const { aplicarConfrontos, setConfronto, limparConfronto, jogoDefinido } = require('../services/mataMata');

const router = express.Router();

function listaSelecoes() {
  return getTodasSelecoes()
    .map(s => ({ nome: s.nome, bandeira: bandeiraDe(s.nome) }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

router.get('/admin', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const campeaoReal = db.prepare("SELECT valor FROM config WHERE chave = 'campeao_copa'").get();
  const totalPalpites = db.prepare('SELECT COUNT(*) AS n FROM palpite_campeao').get().n;
  const usuarios = db.prepare(`
    SELECT id, nome, email, pago, pago_em
    FROM usuarios
    ORDER BY pago DESC, nome COLLATE NOCASE
  `).all();
  const pixChave = db.prepare("SELECT valor FROM config WHERE chave = 'pix_chave'").get();
  res.render('pages/admin', {
    titulo: 'Administração',
    selecoes: listaSelecoes(),
    campeaoReal: campeaoReal?.valor || null,
    totalPalpites,
    usuarios,
    pixChave: pixChave?.valor || '',
    premio: calcularPremio(db),
    msg: req.query.msg || null,
    premiados: req.query.premiados || null,
    tmpSenha: req.query.tmp || null,
    quemSenha: req.query.quem || null
  });
});

router.post('/admin/campeao', requireAdmin, (req, res) => {
  const { selecao } = req.body;
  const valida = getTodasSelecoes().some(s => s.nome === selecao);
  if (!valida) return res.redirect('/admin?msg=erro');

  const total = processarBonusCampeao(selecao);
  res.redirect(`/admin?msg=ok&premiados=${total}`);
});

// Confirma ou cancela o depósito (taxa de inscrição) de um participante.
router.post('/admin/pagamento', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const id = Number(req.body.usuario_id);
  const acao = req.body.acao; // 'confirmar' ou 'cancelar'
  if (!id) return res.redirect('/admin?msg=pag_erro');

  if (acao === 'confirmar') {
    db.prepare('UPDATE usuarios SET pago = 1, pago_em = CURRENT_TIMESTAMP WHERE id = ?').run(id);
  } else if (acao === 'cancelar') {
    db.prepare('UPDATE usuarios SET pago = 0, pago_em = NULL WHERE id = ?').run(id);
  } else {
    return res.redirect('/admin?msg=pag_erro');
  }
  res.redirect('/admin?msg=pag_ok#pagamentos');
});

// Reset de senha pelo admin: gera uma senha temporária para o participante.
router.post('/admin/reset-senha', requireAdmin, async (req, res) => {
  const db = req.app.locals.db;
  const id = Number(req.body.usuario_id);
  if (!id) return res.redirect('/admin?msg=pag_erro#pagamentos');

  const r = await resetarSenhaUsuario(db, id);
  if (!r) return res.redirect('/admin?msg=pag_erro#pagamentos');

  res.redirect(`/admin?msg=senha_resetada&tmp=${encodeURIComponent(r.senha)}&quem=${encodeURIComponent(r.nome)}#pagamentos`);
});

// Dashboard do admin: visão geral, ranking ao vivo e palpites de cada participante.
router.get('/admin/dashboard', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const agora = new Date();

  // Jogos (com confrontos do mata-mata) mapeados por id; "abertos" = ainda dá pra palpitar
  const todosJogos = aplicarConfrontos(db, getTodosJogosEstaticos());
  const jogoPorId = {};
  todosJogos.forEach(j => { jogoPorId[j.id] = j; });
  const abertosIds = new Set(
    todosJogos.filter(j => jogoDefinido(j) && limitePalpite(j.inicio) > agora).map(j => String(j.id))
  );
  const totalAbertos = abertosIds.size;

  const usuarios = db.prepare('SELECT id, nome, email, pago FROM usuarios').all();
  const pontosPorUser = {};
  db.prepare('SELECT usuario_id, total_pontos FROM pontuacao').all().forEach(p => { pontosPorUser[p.usuario_id] = p.total_pontos; });
  const campeaoPorUser = {};
  db.prepare('SELECT usuario_id, selecao FROM palpite_campeao').all().forEach(c => { campeaoPorUser[c.usuario_id] = c.selecao; });
  const palpitesPorUser = {};
  db.prepare('SELECT usuario_id, jogo_id, gols_casa, gols_fora, pontos FROM palpites').all().forEach(p => {
    (palpitesPorUser[p.usuario_id] = palpitesPorUser[p.usuario_id] || []).push(p);
  });

  const participantes = usuarios.map(u => {
    const ps = palpitesPorUser[u.id] || [];
    const idsFeitos = new Set(ps.map(p => String(p.jogo_id)));
    let abertosFeitos = 0;
    abertosIds.forEach(id => { if (idsFeitos.has(id)) abertosFeitos++; });
    const palpites = ps.map(p => {
      const j = jogoPorId[p.jogo_id] || {};
      return {
        inicio: j.inicio || '', fase: j.fase || '—', data: j.data || '',
        timeCasa: j.timeCasa || '?', timeFora: j.timeFora || '?',
        gc: p.gols_casa, gf: p.gols_fora, pontos: p.pontos
      };
    }).sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
    return {
      nome: u.nome, email: u.email, pago: !!u.pago,
      pontos: pontosPorUser[u.id] || 0,
      exatos: ps.filter(p => p.pontos === 5).length,
      resultados: ps.filter(p => p.pontos === 3).length,
      totalPalpites: ps.length,
      abertosFeitos, abertosFaltam: totalAbertos - abertosFeitos,
      campeao: campeaoPorUser[u.id] || null,
      palpites
    };
  }).sort((a, b) =>
    b.pontos - a.pontos || b.exatos - a.exatos || b.resultados - a.resultados ||
    a.nome.localeCompare(b.nome, 'pt-BR')
  );

  const resumo = {
    participantes: usuarios.length,
    pagos: usuarios.filter(u => u.pago).length,
    totalPalpites: db.prepare('SELECT COUNT(*) AS n FROM palpites').get().n,
    jogosComResultado: db.prepare('SELECT COUNT(*) AS n FROM resultados').get().n,
    totalAbertos,
    premio: calcularPremio(db)
  };

  res.render('pages/admin-dashboard', { titulo: 'Dashboard', participantes, resumo });
});

// Lançamento de resultados (placar final) e contabilização dos pontos.
router.get('/admin/resultados', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const resultados = getResultadosMap(db);
  const agora = new Date();
  const jogos = aplicarConfrontos(db, getTodosJogosEstaticos())
    .filter(j => jogoDefinido(j))
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
    .map(j => {
      const r = resultados[j.id];
      return {
        id: j.id, fase: j.fase, data: j.data,
        timeCasa: j.timeCasa, timeFora: j.timeFora,
        iniciado: new Date(j.inicio) <= agora,
        gols_casa: r ? r.gols_casa : '',
        gols_fora: r ? r.gols_fora : '',
        fonte: r ? r.fonte : null
      };
    });
  res.render('pages/admin-resultados', { titulo: 'Resultados', jogos, msg: req.query.msg || null });
});

router.post('/admin/resultado', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const { jogo_id, gols_casa, gols_fora, acao } = req.body;
  if (!jogo_id) return res.redirect('/admin/resultados?msg=erro');
  try {
    if (acao === 'remover') {
      removerResultado(db, jogo_id);
      return res.redirect('/admin/resultados?msg=removido');
    }
    registrarResultado(db, jogo_id, gols_casa, gols_fora, 'manual');
    res.redirect('/admin/resultados?msg=ok');
  } catch {
    res.redirect('/admin/resultados?msg=erro');
  }
});

// Definição dos confrontos do mata-mata (preencher os times quando os grupos acabarem).
router.get('/admin/mata-mata', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const jogos = aplicarConfrontos(db, getTodosJogosEstaticos())
    .filter(j => j.mataMata)
    .map(j => ({
      id: j.id,
      fase: j.fase,
      data: j.data,
      placeholderCasa: j.confrontoCasa,
      placeholderFora: j.confrontoFora,
      timeCasa: j.timeCasa,
      timeFora: j.timeFora,
      definido: jogoDefinido(j)
    }));
  res.render('pages/admin-mata-mata', {
    titulo: 'Mata-mata',
    jogos,
    selecoes: listaSelecoes(),
    msg: req.query.msg || null
  });
});

router.post('/admin/mata-mata', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const { jogo_id, time_casa, time_fora, acao } = req.body;
  if (!jogo_id) return res.redirect('/admin/mata-mata?msg=erro');

  if (acao === 'limpar') {
    limparConfronto(db, jogo_id);
    return res.redirect('/admin/mata-mata?msg=limpo');
  }

  const valido = nome => getTodasSelecoes().some(s => s.nome === nome);
  if (!valido(time_casa) || !valido(time_fora) || time_casa === time_fora) {
    return res.redirect('/admin/mata-mata?msg=erro');
  }
  setConfronto(db, jogo_id, time_casa, time_fora);
  res.redirect('/admin/mata-mata?msg=ok');
});

// Salva a chave PIX exibida aos participantes que ainda não depositaram.
router.post('/admin/pix', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const chave = (req.body.pix_chave || '').trim();
  db.prepare(`
    INSERT INTO config (chave, valor, atualizado_em) VALUES ('pix_chave', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizado_em = CURRENT_TIMESTAMP
  `).run(chave);
  res.redirect('/admin?msg=pix_ok#pagamentos');
});

module.exports = router;
