// Classificação dos grupos calculada dinamicamente a partir dos resultados reais
// (tabela `resultados`, alimentada tanto pela TheSportsDB quanto pelo admin).
// Ordena pelos critérios de desempate da FIFA 2026:
//   1) Pontos  2) Saldo de gols  3) Gols marcados
//   4) Confronto direto entre os empatados (pontos, saldo, gols nas partidas entre eles)
//   5) (fallback) ordem alfabética
const { GRUPOS, getTodosJogosEstaticos } = require('./jogosEstaticos');
const { bandeiraDe } = require('./bandeiras');

function novoTime(nome) {
  return {
    nome, bandeira: bandeiraDe(nome),
    jogos: 0, vitorias: 0, empates: 0, derrotas: 0,
    gp: 0, gc: 0, sg: 0, pontos: 0
  };
}

// Mini-tabela considerando só os jogos ENTRE os times empatados (confronto direto)
function miniTabela(nomes, jogos) {
  const set = new Set(nomes);
  const m = {};
  nomes.forEach(n => { m[n] = { pontos: 0, gp: 0, gc: 0, sg: 0 }; });
  jogos.forEach(j => {
    if (!set.has(j.casa) || !set.has(j.fora)) return;
    m[j.casa].gp += j.gc; m[j.casa].gc += j.gf;
    m[j.fora].gp += j.gf; m[j.fora].gc += j.gc;
    if (j.gc > j.gf) m[j.casa].pontos += 3;
    else if (j.gc < j.gf) m[j.fora].pontos += 3;
    else { m[j.casa].pontos += 1; m[j.fora].pontos += 1; }
  });
  nomes.forEach(n => { m[n].sg = m[n].gp - m[n].gc; });
  return m;
}

function ordenarGrupo(times, jogos) {
  // Critérios gerais (1–3)
  times.sort((a, b) =>
    b.pontos - a.pontos || b.sg - a.sg || b.gp - a.gp ||
    a.nome.localeCompare(b.nome, 'pt-BR')
  );
  // Confronto direto (4) entre blocos ainda empatados em pontos+saldo+gols
  let i = 0;
  while (i < times.length) {
    let k = i + 1;
    while (k < times.length &&
           times[k].pontos === times[i].pontos &&
           times[k].sg === times[i].sg &&
           times[k].gp === times[i].gp) k++;
    if (k - i > 1) {
      const bloco = times.slice(i, k);
      const mini = miniTabela(bloco.map(t => t.nome), jogos);
      bloco.sort((a, b) => {
        const ma = mini[a.nome], mb = mini[b.nome];
        return (mb.pontos - ma.pontos) || (mb.sg - ma.sg) || (mb.gp - ma.gp) ||
               a.nome.localeCompare(b.nome, 'pt-BR');
      });
      for (let p = i; p < k; p++) times[p] = bloco[p - i];
    }
    i = k;
  }
  return times;
}

function getClassificacao(db) {
  // Resultados oficiais já registrados (jogo_id -> placar)
  const resultados = {};
  try {
    db.prepare('SELECT jogo_id, gols_casa, gols_fora FROM resultados').all()
      .forEach(r => { resultados[String(r.jogo_id)] = r; });
  } catch { /* tabela ainda não populada */ }

  // Estrutura base (todas as seleções de cada grupo, zeradas)
  const tabela = {};
  Object.entries(GRUPOS).forEach(([g, times]) => {
    tabela[g] = {};
    times.forEach(t => { tabela[g][t] = novoTime(t); });
  });

  // Aplica cada jogo de grupo que já tem resultado
  const jogosPorGrupo = {};
  getTodosJogosEstaticos().filter(j => j.grupo).forEach(j => {
    const r = resultados[String(j.id)];
    if (!r) return;
    const gc = Number(r.gols_casa), gf = Number(r.gols_fora);
    if (!Number.isInteger(gc) || !Number.isInteger(gf)) return;

    const casa = tabela[j.grupo][j.timeCasa];
    const fora = tabela[j.grupo][j.timeFora];
    if (!casa || !fora) return;

    casa.jogos++; fora.jogos++;
    casa.gp += gc; casa.gc += gf;
    fora.gp += gf; fora.gc += gc;
    if (gc > gf) { casa.vitorias++; casa.pontos += 3; fora.derrotas++; }
    else if (gc < gf) { fora.vitorias++; fora.pontos += 3; casa.derrotas++; }
    else { casa.empates++; fora.empates++; casa.pontos++; fora.pontos++; }

    (jogosPorGrupo[j.grupo] = jogosPorGrupo[j.grupo] || [])
      .push({ casa: j.timeCasa, fora: j.timeFora, gc, gf });
  });

  // Saldo + ordenação por grupo
  return Object.keys(GRUPOS).sort().map(g => {
    const times = Object.values(tabela[g]);
    times.forEach(t => { t.sg = t.gp - t.gc; });
    ordenarGrupo(times, jogosPorGrupo[g] || []);
    return { nome: g, times };
  });
}

module.exports = { getClassificacao };
