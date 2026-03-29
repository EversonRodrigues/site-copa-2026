const express = require('express');
const rateLimit = require('express-rate-limit');
const { cadastro, login } = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/login', (req, res) => {
  if (req.session.usuario) return res.redirect('/');
  res.render('pages/login', { titulo: 'Login', erro: null });
});

router.post('/login', authLimiter, login);

router.get('/cadastro', (req, res) => {
  if (req.session.usuario) return res.redirect('/');
  res.render('pages/cadastro', { titulo: 'Cadastro', erro: null });
});

router.post('/cadastro', authLimiter, cadastro);

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
