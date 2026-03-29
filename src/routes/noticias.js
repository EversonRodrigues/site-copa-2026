const express = require('express');
const { fetchNoticias } = require('../services/rssService');

const router = express.Router();

router.get('/noticias', async (req, res) => {
  try {
    const noticias = await fetchNoticias();
    res.render('pages/noticias', { titulo: 'Notícias', noticias });
  } catch (err) {
    console.error('Erro ao buscar notícias:', err.message);
    res.render('pages/noticias', { titulo: 'Notícias', noticias: [] });
  }
});

module.exports = router;
