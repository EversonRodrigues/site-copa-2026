const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/ranking', (req, res) => {
  const db = req.app.locals.db;
  const ranking = db.prepare(`
    SELECT u.nome, p.total_pontos
    FROM pontuacao p
    JOIN usuarios u ON u.id = p.usuario_id
    ORDER BY p.total_pontos DESC
    LIMIT 100
  `).all();
  res.render('pages/ranking', { titulo: 'Ranking do Bolão', ranking });
});

router.get('/meus-palpites', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const palpites = db.prepare(`
    SELECT p.*, jc.dados_json
    FROM palpites p
    JOIN jogos_cache jc ON jc.jogo_id_api = p.jogo_id
    WHERE p.usuario_id = ?
    ORDER BY p.criado_em DESC
  `).all(req.session.usuario.id).map(p => {
    const jogo = JSON.parse(p.dados_json);
    return {
      ...p,
      timeCasa: jogo.timeCasa || jogo.teams?.home?.name || '-',
      timeFora: jogo.timeFora || jogo.teams?.away?.name || '-',
      resultado: jogo.placar || null
    };
  });

  res.render('pages/meus-palpites', { titulo: 'Meus Palpites', palpites, jogos: [] });
});

router.post('/api/palpites', requireAuth, (req, res) => {
  const { jogo_id, gols_casa, gols_fora } = req.body;
  const db = req.app.locals.db;
  const usuario_id = req.session.usuario.id;

  if (jogo_id === undefined || gols_casa === undefined || gols_fora === undefined) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const jogo = db.prepare('SELECT dados_json FROM jogos_cache WHERE jogo_id_api = ?').get(jogo_id);
  if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado.' });

  const dados = JSON.parse(jogo.dados_json);
  const inicio = new Date(dados.inicio || dados.fixture?.date);
  if (isNaN(inicio) || new Date() >= new Date(inicio - 60 * 60 * 1000)) {
    return res.status(400).json({ erro: 'Prazo para palpitar encerrado (1h antes do jogo).' });
  }

  try {
    db.prepare(`
      INSERT INTO palpites (usuario_id, jogo_id, gols_casa, gols_fora)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(usuario_id, jogo_id) DO UPDATE SET gols_casa = excluded.gols_casa, gols_fora = excluded.gols_fora
    `).run(usuario_id, jogo_id, Number(gols_casa), Number(gols_fora));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar palpite.' });
  }
});

module.exports = router;
