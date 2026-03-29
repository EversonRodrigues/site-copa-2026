const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', { titulo: 'Copa do Mundo 2026' });
});

module.exports = router;
