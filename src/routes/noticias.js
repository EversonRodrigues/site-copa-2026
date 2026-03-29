const express = require('express');
const router = express.Router();

router.get('/noticias', (req, res) => res.render('pages/noticias', { titulo: 'Notícias', noticias: [] }));

module.exports = router;
