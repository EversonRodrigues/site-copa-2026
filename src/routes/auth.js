const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.render('pages/login', { titulo: 'Login', erro: null }));
router.get('/cadastro', (req, res) => res.render('pages/cadastro', { titulo: 'Cadastro', erro: null }));
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
