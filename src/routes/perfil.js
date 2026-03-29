const express = require('express');
const router = express.Router();

router.get('/perfil', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  res.render('pages/perfil', { titulo: 'Meu Perfil' });
});

module.exports = router;
