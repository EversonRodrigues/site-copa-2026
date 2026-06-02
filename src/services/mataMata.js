// Confrontos do mata-mata definidos pelo admin.
// Enquanto os grupos não terminam, os jogos eliminatórios têm placeholders
// ("1ºA x 2ºB"). Quando o admin define os dois times de um jogo, gravamos aqui
// e passamos a exibir os nomes reais (e o palpite é liberado).
const { bandeiraDe } = require('./bandeiras');
const { getTodasSelecoes } = require('./selecoesData');

let _selecoesSet = null;
function selecoesSet() {
  if (!_selecoesSet) _selecoesSet = new Set(getTodasSelecoes().map(s => s.nome));
  return _selecoesSet;
}

// Um jogo está "definido" quando os dois times são seleções reais (não placeholder).
function timeDefinido(nome) {
  return selecoesSet().has(nome);
}
function jogoDefinido(jogo) {
  return timeDefinido(jogo.timeCasa) && timeDefinido(jogo.timeFora);
}

function getConfrontosMap(db) {
  const map = {};
  db.prepare('SELECT jogo_id, time_casa, time_fora FROM mata_mata').all()
    .forEach(r => { map[r.jogo_id] = { timeCasa: r.time_casa, timeFora: r.time_fora }; });
  return map;
}

// Aplica os confrontos definidos sobre uma lista de jogos (sobrescreve times e bandeiras).
function aplicarConfrontos(db, jogos) {
  const map = getConfrontosMap(db);
  return jogos.map(j => {
    const c = map[j.id];
    if (!c) return j;
    return {
      ...j,
      timeCasa: c.timeCasa,
      timeFora: c.timeFora,
      bandeirasCasa: bandeiraDe(c.timeCasa),
      bandeiraFora: bandeiraDe(c.timeFora)
    };
  });
}

function setConfronto(db, jogoId, timeCasa, timeFora) {
  db.prepare(`
    INSERT INTO mata_mata (jogo_id, time_casa, time_fora, atualizado_em)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(jogo_id) DO UPDATE SET
      time_casa = excluded.time_casa,
      time_fora = excluded.time_fora,
      atualizado_em = CURRENT_TIMESTAMP
  `).run(String(jogoId), timeCasa, timeFora);
}

function limparConfronto(db, jogoId) {
  db.prepare('DELETE FROM mata_mata WHERE jogo_id = ?').run(String(jogoId));
}

module.exports = {
  timeDefinido,
  jogoDefinido,
  getConfrontosMap,
  aplicarConfrontos,
  setConfronto,
  limparConfronto
};
