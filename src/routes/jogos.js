const express = require('express');
const { listarJogos, listarGrupos, listarSelecoes, detalheSelecao } = require('../controllers/jogosController');

const router = express.Router();

router.get('/jogos', listarJogos);
router.get('/grupos', listarGrupos);
router.get('/selecoes', listarSelecoes);
router.get('/selecoes/:id', detalheSelecao);

module.exports = router;
