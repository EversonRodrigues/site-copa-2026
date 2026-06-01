const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { processarBonusCampeao } = require('../controllers/bolaoController');
const { getTodasSelecoes } = require('../services/selecoesData');
const { bandeiraDe } = require('../services/bandeiras');

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
  res.render('pages/admin', {
    titulo: 'Administração',
    selecoes: listaSelecoes(),
    campeaoReal: campeaoReal?.valor || null,
    totalPalpites,
    msg: req.query.msg || null,
    premiados: req.query.premiados || null
  });
});

router.post('/admin/campeao', requireAdmin, (req, res) => {
  const { selecao } = req.body;
  const valida = getTodasSelecoes().some(s => s.nome === selecao);
  if (!valida) return res.redirect('/admin?msg=erro');

  const total = processarBonusCampeao(selecao);
  res.redirect(`/admin?msg=ok&premiados=${total}`);
});

module.exports = router;
