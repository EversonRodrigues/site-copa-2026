const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { processarBonusCampeao, registrarResultado, removerResultado, getResultadosMap } = require('../controllers/bolaoController');
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
