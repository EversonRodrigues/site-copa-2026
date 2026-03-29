const express = require('express');
const router = express.Router();

router.get('/jogos', (req, res) => res.render('pages/jogos', { titulo: 'Jogos', jogos: [] }));
router.get('/grupos', (req, res) => res.render('pages/grupos', { titulo: 'Grupos', grupos: [] }));
router.get('/selecoes', (req, res) => res.render('pages/selecoes', { titulo: 'Seleções', selecoes: [] }));

module.exports = router;
