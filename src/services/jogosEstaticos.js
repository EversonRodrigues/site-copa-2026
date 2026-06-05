// Calendário completo da Copa do Mundo 2026
// Baseado no SORTEIO OFICIAL (dez/2025) e no calendário oficial da FIFA.
// Horários em horário de Brasília (offset -03:00, gravado explicitamente para
// não depender do fuso do servidor). 12 grupos de 4 | 72 jogos na fase de
// grupos | 32 no mata-mata = 104 total.

const { bandeiraDe } = require('./bandeiras');

// Ordem das seleções em cada grupo segue o chaveamento oficial da FIFA:
// índice 0 = "Seleção 1", 1 = "Seleção 2", 2 = "Seleção 3", 3 = "Seleção 4".
const GRUPOS = {
  A: ['México', 'África do Sul', 'Coreia do Sul', 'República Tcheca'],
  B: ['Canadá', 'Bósnia-Herzegovina', 'Qatar', 'Suíça'],
  C: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'],
  D: ['EUA', 'Paraguai', 'Austrália', 'Turquia'],
  E: ['Alemanha', 'Curaçao', 'Costa do Marfim', 'Equador'],
  F: ['Holanda', 'Japão', 'Suécia', 'Tunísia'],
  G: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
  H: ['Espanha', 'Cabo Verde', 'Arábia Saudita', 'Uruguai'],
  I: ['França', 'Senegal', 'Iraque', 'Noruega'],
  J: ['Áustria', 'Jordânia', 'Argentina', 'Argélia'],
  K: ['Portugal', 'Congo (RD)', 'Uzbequistão', 'Colômbia'],
  L: ['Inglaterra', 'Croácia', 'Gana', 'Panamá'],
};

// Cidade-sede → estádio (16 sedes oficiais da Copa 2026).
const ESTADIOS = {
  'Cidade do México': 'Estadio Azteca',
  'Guadalajara': 'Estadio Akron',
  'Monterrey': 'Estadio BBVA',
  'Toronto': 'BMO Field',
  'Vancouver': 'BC Place',
  'Nova York': 'MetLife Stadium',
  'Boston': 'Gillette Stadium',
  'Filadélfia': 'Lincoln Financial Field',
  'Miami': 'Hard Rock Stadium',
  'Atlanta': 'Mercedes-Benz Stadium',
  'Dallas': 'AT&T Stadium',
  'Houston': 'NRG Stadium',
  'Kansas City': 'Arrowhead Stadium',
  'Los Angeles': 'SoFi Stadium',
  'San Francisco': "Levi's Stadium",
  'Seattle': 'Lumen Field',
};

// Fase de grupos — datas/horários (Brasília) e sedes conforme calendário oficial.
// casa/fora referenciam o índice da seleção dentro do grupo (ver GRUPOS acima).
const CALENDARIO_GRUPOS = [
  // --- GRUPO A ---
  { grupo: 'A', casa: 0, fora: 1, data: '2026-06-11T16:00:00-03:00', rodada: 1, cidade: 'Cidade do México' },
  { grupo: 'A', casa: 2, fora: 3, data: '2026-06-11T23:00:00-03:00', rodada: 1, cidade: 'Guadalajara' },
  { grupo: 'A', casa: 3, fora: 1, data: '2026-06-18T13:00:00-03:00', rodada: 2, cidade: 'Atlanta' },
  { grupo: 'A', casa: 0, fora: 2, data: '2026-06-18T22:00:00-03:00', rodada: 2, cidade: 'Guadalajara' },
  { grupo: 'A', casa: 3, fora: 0, data: '2026-06-24T22:00:00-03:00', rodada: 3, cidade: 'Cidade do México' },
  { grupo: 'A', casa: 1, fora: 2, data: '2026-06-24T22:00:00-03:00', rodada: 3, cidade: 'Monterrey' },
  // --- GRUPO B ---
  { grupo: 'B', casa: 0, fora: 1, data: '2026-06-12T16:00:00-03:00', rodada: 1, cidade: 'Toronto' },
  { grupo: 'B', casa: 2, fora: 3, data: '2026-06-13T16:00:00-03:00', rodada: 1, cidade: 'San Francisco' },
  { grupo: 'B', casa: 3, fora: 1, data: '2026-06-18T16:00:00-03:00', rodada: 2, cidade: 'Los Angeles' },
  { grupo: 'B', casa: 0, fora: 2, data: '2026-06-18T19:00:00-03:00', rodada: 2, cidade: 'Vancouver' },
  { grupo: 'B', casa: 3, fora: 0, data: '2026-06-24T16:00:00-03:00', rodada: 3, cidade: 'Vancouver' },
  { grupo: 'B', casa: 1, fora: 2, data: '2026-06-24T16:00:00-03:00', rodada: 3, cidade: 'Seattle' },
  // --- GRUPO C ---
  { grupo: 'C', casa: 0, fora: 1, data: '2026-06-13T19:00:00-03:00', rodada: 1, cidade: 'Nova York' },
  { grupo: 'C', casa: 2, fora: 3, data: '2026-06-13T22:00:00-03:00', rodada: 1, cidade: 'Boston' },
  { grupo: 'C', casa: 3, fora: 1, data: '2026-06-19T19:00:00-03:00', rodada: 2, cidade: 'Boston' },
  { grupo: 'C', casa: 0, fora: 2, data: '2026-06-19T21:30:00-03:00', rodada: 2, cidade: 'Filadélfia' },
  { grupo: 'C', casa: 3, fora: 0, data: '2026-06-24T19:00:00-03:00', rodada: 3, cidade: 'Miami' },
  { grupo: 'C', casa: 1, fora: 2, data: '2026-06-24T19:00:00-03:00', rodada: 3, cidade: 'Atlanta' },
  // --- GRUPO D ---
  { grupo: 'D', casa: 0, fora: 1, data: '2026-06-12T22:00:00-03:00', rodada: 1, cidade: 'Los Angeles' },
  { grupo: 'D', casa: 2, fora: 3, data: '2026-06-13T01:00:00-03:00', rodada: 1, cidade: 'Vancouver' },
  { grupo: 'D', casa: 3, fora: 1, data: '2026-06-19T01:00:00-03:00', rodada: 2, cidade: 'San Francisco' },
  { grupo: 'D', casa: 0, fora: 2, data: '2026-06-19T16:00:00-03:00', rodada: 2, cidade: 'Seattle' },
  { grupo: 'D', casa: 3, fora: 0, data: '2026-06-25T23:00:00-03:00', rodada: 3, cidade: 'Los Angeles' },
  { grupo: 'D', casa: 1, fora: 2, data: '2026-06-25T23:00:00-03:00', rodada: 3, cidade: 'San Francisco' },
  // --- GRUPO E ---
  { grupo: 'E', casa: 0, fora: 1, data: '2026-06-14T14:00:00-03:00', rodada: 1, cidade: 'Houston' },
  { grupo: 'E', casa: 2, fora: 3, data: '2026-06-14T20:00:00-03:00', rodada: 1, cidade: 'Filadélfia' },
  { grupo: 'E', casa: 0, fora: 2, data: '2026-06-20T17:00:00-03:00', rodada: 2, cidade: 'Toronto' },
  { grupo: 'E', casa: 3, fora: 1, data: '2026-06-20T21:00:00-03:00', rodada: 2, cidade: 'Kansas City' },
  { grupo: 'E', casa: 3, fora: 0, data: '2026-06-25T17:00:00-03:00', rodada: 3, cidade: 'Nova York' },
  { grupo: 'E', casa: 1, fora: 2, data: '2026-06-25T17:00:00-03:00', rodada: 3, cidade: 'Filadélfia' },
  // --- GRUPO F ---
  { grupo: 'F', casa: 0, fora: 1, data: '2026-06-14T17:00:00-03:00', rodada: 1, cidade: 'Dallas' },
  { grupo: 'F', casa: 2, fora: 3, data: '2026-06-14T23:00:00-03:00', rodada: 1, cidade: 'Monterrey' },
  { grupo: 'F', casa: 3, fora: 1, data: '2026-06-20T01:00:00-03:00', rodada: 2, cidade: 'Monterrey' },
  { grupo: 'F', casa: 0, fora: 2, data: '2026-06-20T14:00:00-03:00', rodada: 2, cidade: 'Houston' },
  { grupo: 'F', casa: 1, fora: 2, data: '2026-06-25T20:00:00-03:00', rodada: 3, cidade: 'Dallas' },
  { grupo: 'F', casa: 3, fora: 0, data: '2026-06-25T20:00:00-03:00', rodada: 3, cidade: 'Kansas City' },
  // --- GRUPO G ---
  { grupo: 'G', casa: 0, fora: 1, data: '2026-06-15T16:00:00-03:00', rodada: 1, cidade: 'Seattle' },
  { grupo: 'G', casa: 2, fora: 3, data: '2026-06-15T22:00:00-03:00', rodada: 1, cidade: 'Los Angeles' },
  { grupo: 'G', casa: 0, fora: 2, data: '2026-06-21T16:00:00-03:00', rodada: 2, cidade: 'Los Angeles' },
  { grupo: 'G', casa: 3, fora: 1, data: '2026-06-21T22:00:00-03:00', rodada: 2, cidade: 'Vancouver' },
  { grupo: 'G', casa: 1, fora: 2, data: '2026-06-27T00:00:00-03:00', rodada: 3, cidade: 'Seattle' },
  { grupo: 'G', casa: 3, fora: 0, data: '2026-06-27T00:00:00-03:00', rodada: 3, cidade: 'Vancouver' },
  // --- GRUPO H ---
  { grupo: 'H', casa: 0, fora: 1, data: '2026-06-15T13:00:00-03:00', rodada: 1, cidade: 'Atlanta' },
  { grupo: 'H', casa: 2, fora: 3, data: '2026-06-15T19:00:00-03:00', rodada: 1, cidade: 'Miami' },
  { grupo: 'H', casa: 0, fora: 2, data: '2026-06-21T13:00:00-03:00', rodada: 2, cidade: 'Atlanta' },
  { grupo: 'H', casa: 3, fora: 1, data: '2026-06-21T19:00:00-03:00', rodada: 2, cidade: 'Miami' },
  { grupo: 'H', casa: 3, fora: 0, data: '2026-06-26T21:00:00-03:00', rodada: 3, cidade: 'Guadalajara' },
  { grupo: 'H', casa: 1, fora: 2, data: '2026-06-26T21:00:00-03:00', rodada: 3, cidade: 'Houston' },
  // --- GRUPO I ---
  { grupo: 'I', casa: 0, fora: 1, data: '2026-06-16T16:00:00-03:00', rodada: 1, cidade: 'Nova York' },
  { grupo: 'I', casa: 2, fora: 3, data: '2026-06-16T19:00:00-03:00', rodada: 1, cidade: 'Boston' },
  { grupo: 'I', casa: 0, fora: 2, data: '2026-06-22T18:00:00-03:00', rodada: 2, cidade: 'Filadélfia' },
  { grupo: 'I', casa: 3, fora: 1, data: '2026-06-22T21:00:00-03:00', rodada: 2, cidade: 'Nova York' },
  { grupo: 'I', casa: 3, fora: 0, data: '2026-06-26T16:00:00-03:00', rodada: 3, cidade: 'Boston' },
  { grupo: 'I', casa: 1, fora: 2, data: '2026-06-26T16:00:00-03:00', rodada: 3, cidade: 'Toronto' },
  // --- GRUPO J ---
  { grupo: 'J', casa: 0, fora: 1, data: '2026-06-16T01:00:00-03:00', rodada: 1, cidade: 'San Francisco' },
  { grupo: 'J', casa: 2, fora: 3, data: '2026-06-16T22:00:00-03:00', rodada: 1, cidade: 'Kansas City' },
  { grupo: 'J', casa: 1, fora: 3, data: '2026-06-22T00:00:00-03:00', rodada: 2, cidade: 'San Francisco' },
  { grupo: 'J', casa: 2, fora: 0, data: '2026-06-22T14:00:00-03:00', rodada: 2, cidade: 'Dallas' },
  { grupo: 'J', casa: 3, fora: 0, data: '2026-06-27T23:00:00-03:00', rodada: 3, cidade: 'Kansas City' },
  { grupo: 'J', casa: 1, fora: 2, data: '2026-06-27T23:00:00-03:00', rodada: 3, cidade: 'Dallas' },
  // --- GRUPO K ---
  { grupo: 'K', casa: 0, fora: 1, data: '2026-06-17T14:00:00-03:00', rodada: 1, cidade: 'Houston' },
  { grupo: 'K', casa: 2, fora: 3, data: '2026-06-17T23:00:00-03:00', rodada: 1, cidade: 'Cidade do México' },
  { grupo: 'K', casa: 0, fora: 2, data: '2026-06-23T14:00:00-03:00', rodada: 2, cidade: 'Houston' },
  { grupo: 'K', casa: 3, fora: 1, data: '2026-06-23T23:00:00-03:00', rodada: 2, cidade: 'Guadalajara' },
  { grupo: 'K', casa: 3, fora: 0, data: '2026-06-27T20:30:00-03:00', rodada: 3, cidade: 'Miami' },
  { grupo: 'K', casa: 1, fora: 2, data: '2026-06-27T20:30:00-03:00', rodada: 3, cidade: 'Atlanta' },
  // --- GRUPO L ---
  { grupo: 'L', casa: 0, fora: 1, data: '2026-06-17T17:00:00-03:00', rodada: 1, cidade: 'Dallas' },
  { grupo: 'L', casa: 2, fora: 3, data: '2026-06-17T20:00:00-03:00', rodada: 1, cidade: 'Toronto' },
  { grupo: 'L', casa: 0, fora: 2, data: '2026-06-23T17:00:00-03:00', rodada: 2, cidade: 'Boston' },
  { grupo: 'L', casa: 3, fora: 1, data: '2026-06-23T20:00:00-03:00', rodada: 2, cidade: 'Toronto' },
  { grupo: 'L', casa: 3, fora: 0, data: '2026-06-27T18:00:00-03:00', rodada: 3, cidade: 'Nova York' },
  { grupo: 'L', casa: 1, fora: 2, data: '2026-06-27T18:00:00-03:00', rodada: 3, cidade: 'Filadélfia' },
];

// Mata-mata (32 jogos). Datas/horários (Brasília) e sedes conforme calendário
// oficial; os confrontos são placeholders do chaveamento — o admin define os
// times reais em /admin/mata-mata conforme a fase de grupos avança.
const MATA_MATA = [
  // 16-avos de Final (Round of 32) — 28 jun a 3 jul
  { fase: '16-avos de Final', casa: '1ºA', fora: '2ºB', data: '2026-06-28T16:00:00-03:00', cidade: 'Los Angeles' },
  { fase: '16-avos de Final', casa: '1ºC', fora: '2ºD', data: '2026-06-29T14:00:00-03:00', cidade: 'Houston' },
  { fase: '16-avos de Final', casa: '1ºE', fora: '2ºF', data: '2026-06-29T17:30:00-03:00', cidade: 'Boston' },
  { fase: '16-avos de Final', casa: '1ºG', fora: '2ºH', data: '2026-06-29T22:00:00-03:00', cidade: 'Monterrey' },
  { fase: '16-avos de Final', casa: '1ºI', fora: '2ºJ', data: '2026-06-30T14:00:00-03:00', cidade: 'Dallas' },
  { fase: '16-avos de Final', casa: '1ºK', fora: '2ºL', data: '2026-06-30T18:00:00-03:00', cidade: 'Nova York' },
  { fase: '16-avos de Final', casa: '1ºB', fora: '2ºA', data: '2026-06-30T22:00:00-03:00', cidade: 'Cidade do México' },
  { fase: '16-avos de Final', casa: '1ºD', fora: '2ºC', data: '2026-07-01T13:00:00-03:00', cidade: 'Atlanta' },
  { fase: '16-avos de Final', casa: '1ºF', fora: '2ºE', data: '2026-07-01T17:00:00-03:00', cidade: 'Seattle' },
  { fase: '16-avos de Final', casa: '1ºH', fora: '2ºG', data: '2026-07-01T21:00:00-03:00', cidade: 'San Francisco' },
  { fase: '16-avos de Final', casa: '1ºJ', fora: '2ºI', data: '2026-07-02T00:00:00-03:00', cidade: 'Vancouver' },
  { fase: '16-avos de Final', casa: '1ºL', fora: '2ºK', data: '2026-07-02T16:00:00-03:00', cidade: 'Los Angeles' },
  { fase: '16-avos de Final', casa: 'Melhor 3ºA/B/C', fora: 'Melhor 3ºD/E/F', data: '2026-07-02T20:00:00-03:00', cidade: 'Toronto' },
  { fase: '16-avos de Final', casa: 'Melhor 3ºG/H/I', fora: 'Melhor 3ºJ/K/L', data: '2026-07-03T15:00:00-03:00', cidade: 'Dallas' },
  { fase: '16-avos de Final', casa: 'Melhor 3º(1)', fora: 'Melhor 3º(2)', data: '2026-07-03T17:00:00-03:00', cidade: 'Atlanta' },
  { fase: '16-avos de Final', casa: 'Melhor 3º(3)', fora: 'Melhor 3º(4)', data: '2026-07-03T22:30:00-03:00', cidade: 'Kansas City' },
  // Oitavas de Final (Round of 16) — 4 a 7 jul
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 1', fora: 'Venc. 16-avos 2', data: '2026-07-04T14:00:00-03:00', cidade: 'Houston' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 3', fora: 'Venc. 16-avos 4', data: '2026-07-04T18:00:00-03:00', cidade: 'Filadélfia' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 5', fora: 'Venc. 16-avos 6', data: '2026-07-05T17:00:00-03:00', cidade: 'Nova York' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 7', fora: 'Venc. 16-avos 8', data: '2026-07-05T21:00:00-03:00', cidade: 'Cidade do México' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 9', fora: 'Venc. 16-avos 10', data: '2026-07-06T15:00:00-03:00', cidade: 'Dallas' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 11', fora: 'Venc. 16-avos 12', data: '2026-07-06T20:00:00-03:00', cidade: 'Seattle' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 13', fora: 'Venc. 16-avos 14', data: '2026-07-07T13:00:00-03:00', cidade: 'Atlanta' },
  { fase: 'Oitavas de Final', casa: 'Venc. 16-avos 15', fora: 'Venc. 16-avos 16', data: '2026-07-07T17:00:00-03:00', cidade: 'Vancouver' },
  // Quartas de Final — 9 a 11 jul
  { fase: 'Quartas de Final', casa: 'Venc. Oitavas 1', fora: 'Venc. Oitavas 2', data: '2026-07-09T17:00:00-03:00', cidade: 'Boston' },
  { fase: 'Quartas de Final', casa: 'Venc. Oitavas 3', fora: 'Venc. Oitavas 4', data: '2026-07-10T16:00:00-03:00', cidade: 'Los Angeles' },
  { fase: 'Quartas de Final', casa: 'Venc. Oitavas 5', fora: 'Venc. Oitavas 6', data: '2026-07-11T18:00:00-03:00', cidade: 'Miami' },
  { fase: 'Quartas de Final', casa: 'Venc. Oitavas 7', fora: 'Venc. Oitavas 8', data: '2026-07-11T21:00:00-03:00', cidade: 'Kansas City' },
  // Semifinais — 14 e 15 jul
  { fase: 'Semifinal', casa: 'Venc. Quartas 1', fora: 'Venc. Quartas 2', data: '2026-07-14T16:00:00-03:00', cidade: 'Dallas' },
  { fase: 'Semifinal', casa: 'Venc. Quartas 3', fora: 'Venc. Quartas 4', data: '2026-07-15T16:00:00-03:00', cidade: 'Dallas' },
  // 3º Lugar — 18 jul
  { fase: '3º Lugar', casa: 'Perd. Semifinal 1', fora: 'Perd. Semifinal 2', data: '2026-07-18T18:00:00-03:00', cidade: 'Miami' },
  // Final — 19 jul
  { fase: 'Final', casa: 'Venc. Semifinal 1', fora: 'Venc. Semifinal 2', data: '2026-07-19T16:00:00-03:00', cidade: 'Nova York' },
];

// IDs determinísticos e estáveis (não mudam entre chamadas), para o cache
// não duplicar e os palpites referenciarem sempre o mesmo jogo.
const BASE_ID_GRUPOS = 9000000;
const BASE_ID_MATA = 9100000;

function dataFmt(dataHora) {
  return dataHora.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
}

function gerarJogosGrupos() {
  return CALENDARIO_GRUPOS.map((c, index) => {
    const times = GRUPOS[c.grupo];
    const timeCasa = times[c.casa];
    const timeFora = times[c.fora];
    const dataHora = new Date(c.data);

    return {
      id: String(BASE_ID_GRUPOS + index),
      timeCasa,
      timeFora,
      bandeirasCasa: bandeiraDe(timeCasa),
      bandeiraFora: bandeiraDe(timeFora),
      gols_casa: null,
      gols_fora: null,
      placar: '-',
      status: 'em_breve',
      statusLabel: 'Em breve',
      data: dataFmt(dataHora),
      inicio: dataHora.toISOString(),
      fase: `Grupo ${c.grupo} — Rodada ${c.rodada}`,
      estadio: ESTADIOS[c.cidade] || '',
      cidade: c.cidade,
      grupo: c.grupo,
      fonte: 'estatico'
    };
  });
}

function gerarJogosMataMata() {
  return MATA_MATA.map((m, index) => {
    const dataHora = new Date(m.data);
    return {
      id: String(BASE_ID_MATA + index),
      timeCasa: m.casa,
      timeFora: m.fora,
      bandeirasCasa: bandeiraDe(m.casa),
      bandeiraFora: bandeiraDe(m.fora),
      gols_casa: null,
      gols_fora: null,
      placar: '-',
      status: 'em_breve',
      statusLabel: 'Em breve',
      data: dataFmt(dataHora),
      inicio: dataHora.toISOString(),
      fase: m.fase,
      estadio: ESTADIOS[m.cidade] || '',
      cidade: m.cidade,
      mataMata: true,
      // confronto "cru" (placeholder), preservado para referência do admin
      confrontoCasa: m.casa,
      confrontoFora: m.fora,
      fonte: 'estatico'
    };
  });
}

function getTodosJogosEstaticos() {
  return [...gerarJogosGrupos(), ...gerarJogosMataMata()];
}

function getJogoEstatico(id) {
  return getTodosJogosEstaticos().find(j => j.id === String(id)) || null;
}

function getGruposEstaticos() {
  return Object.entries(GRUPOS).map(([nome, times]) => ({
    nome,
    times: times.map(t => ({
      nome: t,
      bandeira: bandeiraDe(t),
      jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0
    }))
  }));
}

module.exports = { getTodosJogosEstaticos, getJogoEstatico, getGruposEstaticos, GRUPOS };
