const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/perfil', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const pontuacao = db.prepare('SELECT total_pontos FROM pontuacao WHERE usuario_id = ?').get(req.session.usuario.id);
  const posicao = db.prepare(`
    SELECT COUNT(*) + 1 as pos FROM pontuacao WHERE total_pontos > ?
  `).get(pontuacao?.total_pontos || 0);

  res.render('pages/perfil', {
    titulo: 'Meu Perfil',
    total_pontos: pontuacao?.total_pontos || 0,
    posicao: posicao?.pos || '-'
  });
});

module.exports = router;
