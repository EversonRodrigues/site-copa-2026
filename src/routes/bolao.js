const express = require('express');
const { requireAuth, requirePago } = require('../middleware/auth');
const { paginaMeusPalpites } = require('../controllers/bolaoController');
const { getTodasSelecoes } = require('../services/selecoesData');
const { getTodosJogosEstaticos } = require('../services/jogosEstaticos');
const { calcularPremio } = require('../services/premio');

const router = express.Router();

router.get('/ranking', (req, res) => {
  const db = req.app.locals.db;
  // Desempate (regulamento): mais pontos > mais placares exatos (5pts) > mais resultados certos (3pts)
  const ranking = db.prepare(`
    SELECT u.nome, p.total_pontos,
      (SELECT COUNT(*) FROM palpites pa WHERE pa.usuario_id = u.id AND pa.pontos = 5) AS exatos,
      (SELECT COUNT(*) FROM palpites pa WHERE pa.usuario_id = u.id AND pa.pontos = 3) AS resultados
    FROM pontuacao p
    JOIN usuarios u ON u.id = p.usuario_id
    ORDER BY p.total_pontos DESC, exatos DESC, resultados DESC
    LIMIT 100
  `).all();
  res.render('pages/ranking', { titulo: 'Ranking do Bolão', ranking, premio: calcularPremio(db) });
});

router.get('/meus-palpites', requireAuth, paginaMeusPalpites);

router.post('/api/palpites', requireAuth, requirePago, (req, res) => {
  const { jogo_id, gols_casa, gols_fora } = req.body;
  const db = req.app.locals.db;
  const usuario_id = req.session.usuario.id;

  if (jogo_id === undefined || gols_casa === undefined || gols_fora === undefined) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const jogo = db.prepare('SELECT dados_json FROM jogos_cache WHERE jogo_id_api = ?').get(String(jogo_id));
  if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado.' });

  const dados = JSON.parse(jogo.dados_json);
  const inicio = new Date(dados.inicio || dados.fixture?.date);
  if (isNaN(inicio) || new Date() >= inicio) {
    return res.status(400).json({ erro: 'Prazo encerrado: o jogo já começou.' });
  }

  try {
    db.prepare(`
      INSERT INTO palpites (usuario_id, jogo_id, gols_casa, gols_fora)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(usuario_id, jogo_id) DO UPDATE SET gols_casa = excluded.gols_casa, gols_fora = excluded.gols_fora
    `).run(usuario_id, String(jogo_id), Number(gols_casa), Number(gols_fora));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ erro: 'Erro ao salvar palpite.' });
  }
});

router.post('/api/palpite-campeao', requireAuth, requirePago, (req, res) => {
  const { selecao } = req.body;
  const db = req.app.locals.db;
  const usuario_id = req.session.usuario.id;

  if (!selecao) return res.status(400).json({ erro: 'Escolha uma seleção.' });

  // Seleção precisa existir entre as 48 da Copa
  const valida = getTodasSelecoes().some(s => s.nome === selecao);
  if (!valida) return res.status(400).json({ erro: 'Seleção inválida.' });

  // Prazo: até o início do primeiro jogo da Copa
  const inicios = getTodosJogosEstaticos().map(j => j.inicio).filter(Boolean).sort();
  const prazo = inicios[0] ? new Date(inicios[0]) : null;
  if (prazo && new Date() >= prazo) {
    return res.status(400).json({ erro: 'Prazo encerrado: a Copa já começou.' });
  }

  try {
    db.prepare(`
      INSERT INTO palpite_campeao (usuario_id, selecao)
      VALUES (?, ?)
      ON CONFLICT(usuario_id) DO UPDATE SET selecao = excluded.selecao, atualizado_em = CURRENT_TIMESTAMP
    `).run(usuario_id, selecao);
    res.json({ ok: true, selecao });
  } catch {
    res.status(500).json({ erro: 'Erro ao salvar palpite de campeão.' });
  }
});

module.exports = router;
