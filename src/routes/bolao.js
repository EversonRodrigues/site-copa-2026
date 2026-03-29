const express = require('express');
const router = express.Router();

router.get('/ranking', (req, res) => res.render('pages/ranking', { titulo: 'Ranking do Bolão', ranking: [] }));
router.get('/meus-palpites', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  res.render('pages/meus-palpites', { titulo: 'Meus Palpites', palpites: [], jogos: [] });
});

module.exports = router;
