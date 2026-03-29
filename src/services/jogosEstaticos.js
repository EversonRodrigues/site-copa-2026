// Calendário completo da Copa do Mundo 2026
// Baseado no sorteio oficial de dezembro de 2024
// Formato: 12 grupos de 4 seleções | 72 jogos na fase de grupos | 32 no mata-mata = 104 total

const GRUPOS = {
  A: ['México', 'Jamaica', 'África do Sul', 'Uzbequistão'],
  B: ['Qatar', 'Suíça', 'Canadá', 'Panamá'],
  C: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'],
  D: ['EUA', 'Paraguai', 'Austrália', 'Nigéria'],
  E: ['Alemanha', 'Curaçao', 'Costa do Marfim', 'Equador'],
  F: ['Holanda', 'Japão', 'Colômbia', 'Camarões'],
  G: ['Bélgica', 'Egito', 'Irã', 'Nova Zelândia'],
  H: ['Arábia Saudita', 'Uruguai', 'Espanha', 'Cabo Verde'],
  I: ['França', 'Senegal', 'Honduras', 'Venezuela'],
  J: ['Argentina', 'Argélia', 'Áustria', 'Jordânia'],
  K: ['Canadá', 'Coreia do Sul', 'Inglaterra', 'Tunísia'],
  L: ['Portugal', 'Sérvia', 'El Salvador', 'Iraque'],
};

// Datas aproximadas da fase de grupos (ajustadas conforme calendário oficial)
// Rodada 1: 11-19 jun | Rodada 2: 20-25 jun | Rodada 3: 26 jun - 2 jul
const CALENDARIO_GRUPOS = [
  // --- GRUPO A ---
  { grupo: 'A', casa: 0, fora: 1, data: '2026-06-11T19:00:00', rodada: 1, estadio: 'Estadio Azteca', cidade: 'Cidade do México' },
  { grupo: 'A', casa: 2, fora: 3, data: '2026-06-12T16:00:00', rodada: 1, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'A', casa: 0, fora: 2, data: '2026-06-20T16:00:00', rodada: 2, estadio: 'Estadio Azteca', cidade: 'Cidade do México' },
  { grupo: 'A', casa: 1, fora: 3, data: '2026-06-20T19:00:00', rodada: 2, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'A', casa: 0, fora: 3, data: '2026-06-26T20:00:00', rodada: 3, estadio: 'Estadio Azteca', cidade: 'Cidade do México' },
  { grupo: 'A', casa: 1, fora: 2, data: '2026-06-26T20:00:00', rodada: 3, estadio: 'Rose Bowl', cidade: 'Los Angeles' },
  // --- GRUPO B ---
  { grupo: 'B', casa: 0, fora: 1, data: '2026-06-13T13:00:00', rodada: 1, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'B', casa: 2, fora: 3, data: '2026-06-13T16:00:00', rodada: 1, estadio: 'BC Place', cidade: 'Vancouver' },
  { grupo: 'B', casa: 0, fora: 2, data: '2026-06-20T13:00:00', rodada: 2, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'B', casa: 1, fora: 3, data: '2026-06-21T16:00:00', rodada: 2, estadio: 'Estadio Akron', cidade: 'Guadalajara' },
  { grupo: 'B', casa: 0, fora: 3, data: '2026-06-27T20:00:00', rodada: 3, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'B', casa: 1, fora: 2, data: '2026-06-27T20:00:00', rodada: 3, estadio: 'BC Place', cidade: 'Vancouver' },
  // --- GRUPO C ---
  { grupo: 'C', casa: 0, fora: 1, data: '2026-06-13T19:00:00', rodada: 1, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'C', casa: 2, fora: 3, data: '2026-06-14T13:00:00', rodada: 1, estadio: 'Levi\'s Stadium', cidade: 'San Francisco' },
  { grupo: 'C', casa: 0, fora: 2, data: '2026-06-21T13:00:00', rodada: 2, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'C', casa: 1, fora: 3, data: '2026-06-21T19:00:00', rodada: 2, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'C', casa: 0, fora: 3, data: '2026-06-28T20:00:00', rodada: 3, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'C', casa: 1, fora: 2, data: '2026-06-28T20:00:00', rodada: 3, estadio: 'Levi\'s Stadium', cidade: 'San Francisco' },
  // --- GRUPO D ---
  { grupo: 'D', casa: 0, fora: 1, data: '2026-06-13T20:00:00', rodada: 1, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'D', casa: 2, fora: 3, data: '2026-06-14T16:00:00', rodada: 1, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'D', casa: 0, fora: 2, data: '2026-06-22T16:00:00', rodada: 2, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'D', casa: 1, fora: 3, data: '2026-06-22T19:00:00', rodada: 2, estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  { grupo: 'D', casa: 0, fora: 3, data: '2026-06-29T20:00:00', rodada: 3, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'D', casa: 1, fora: 2, data: '2026-06-29T20:00:00', rodada: 3, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  // --- GRUPO E ---
  { grupo: 'E', casa: 0, fora: 1, data: '2026-06-14T13:00:00', rodada: 1, estadio: 'Estadio Akron', cidade: 'Guadalajara' },
  { grupo: 'E', casa: 2, fora: 3, data: '2026-06-14T19:00:00', rodada: 1, estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  { grupo: 'E', casa: 0, fora: 2, data: '2026-06-22T13:00:00', rodada: 2, estadio: 'Estadio Akron', cidade: 'Guadalajara' },
  { grupo: 'E', casa: 1, fora: 3, data: '2026-06-22T16:00:00', rodada: 2, estadio: 'Levi\'s Stadium', cidade: 'San Francisco' },
  { grupo: 'E', casa: 0, fora: 3, data: '2026-06-30T20:00:00', rodada: 3, estadio: 'Estadio Akron', cidade: 'Guadalajara' },
  { grupo: 'E', casa: 1, fora: 2, data: '2026-06-30T20:00:00', rodada: 3, estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  // --- GRUPO F ---
  { grupo: 'F', casa: 0, fora: 1, data: '2026-06-14T16:00:00', rodada: 1, estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  { grupo: 'F', casa: 2, fora: 3, data: '2026-06-15T13:00:00', rodada: 1, estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  { grupo: 'F', casa: 0, fora: 2, data: '2026-06-23T13:00:00', rodada: 2, estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  { grupo: 'F', casa: 1, fora: 3, data: '2026-06-23T16:00:00', rodada: 2, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'F', casa: 0, fora: 3, data: '2026-07-01T20:00:00', rodada: 3, estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  { grupo: 'F', casa: 1, fora: 2, data: '2026-07-01T20:00:00', rodada: 3, estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  // --- GRUPO G ---
  { grupo: 'G', casa: 0, fora: 1, data: '2026-06-15T16:00:00', rodada: 1, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'G', casa: 2, fora: 3, data: '2026-06-16T13:00:00', rodada: 1, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'G', casa: 0, fora: 2, data: '2026-06-23T19:00:00', rodada: 2, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'G', casa: 1, fora: 3, data: '2026-06-24T13:00:00', rodada: 2, estadio: 'Gillette Stadium', cidade: 'Boston' },
  { grupo: 'G', casa: 0, fora: 3, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { grupo: 'G', casa: 1, fora: 2, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  // --- GRUPO H ---
  { grupo: 'H', casa: 0, fora: 1, data: '2026-06-15T19:00:00', rodada: 1, estadio: 'Gillette Stadium', cidade: 'Boston' },
  { grupo: 'H', casa: 2, fora: 3, data: '2026-06-15T22:00:00', rodada: 1, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'H', casa: 0, fora: 2, data: '2026-06-24T19:00:00', rodada: 2, estadio: 'Gillette Stadium', cidade: 'Boston' },
  { grupo: 'H', casa: 1, fora: 3, data: '2026-06-24T16:00:00', rodada: 2, estadio: 'Estadio BBVA', cidade: 'Monterrey' },
  { grupo: 'H', casa: 0, fora: 3, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'Gillette Stadium', cidade: 'Boston' },
  { grupo: 'H', casa: 1, fora: 2, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  // --- GRUPO I ---
  { grupo: 'I', casa: 0, fora: 1, data: '2026-06-16T19:00:00', rodada: 1, estadio: 'Stade Olympique', cidade: 'Toronto' },
  { grupo: 'I', casa: 2, fora: 3, data: '2026-06-16T16:00:00', rodada: 1, estadio: 'Mercedes-Benz Stadium', cidade: 'Atlanta' },
  { grupo: 'I', casa: 0, fora: 2, data: '2026-06-25T13:00:00', rodada: 2, estadio: 'Stade Olympique', cidade: 'Toronto' },
  { grupo: 'I', casa: 1, fora: 3, data: '2026-06-25T19:00:00', rodada: 2, estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { grupo: 'I', casa: 0, fora: 3, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'Stade Olympique', cidade: 'Toronto' },
  { grupo: 'I', casa: 1, fora: 2, data: '2026-07-02T20:00:00', rodada: 3, estadio: 'Mercedes-Benz Stadium', cidade: 'Atlanta' },
  // --- GRUPO J ---
  { grupo: 'J', casa: 0, fora: 1, data: '2026-06-17T19:00:00', rodada: 1, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'J', casa: 2, fora: 3, data: '2026-06-17T16:00:00', rodada: 1, estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  { grupo: 'J', casa: 0, fora: 2, data: '2026-06-25T16:00:00', rodada: 2, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'J', casa: 1, fora: 3, data: '2026-06-25T22:00:00', rodada: 2, estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { grupo: 'J', casa: 0, fora: 3, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'J', casa: 1, fora: 2, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  // --- GRUPO K ---
  { grupo: 'K', casa: 0, fora: 1, data: '2026-06-17T13:00:00', rodada: 1, estadio: 'BC Place', cidade: 'Vancouver' },
  { grupo: 'K', casa: 2, fora: 3, data: '2026-06-18T16:00:00', rodada: 1, estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  { grupo: 'K', casa: 0, fora: 2, data: '2026-06-25T13:00:00', rodada: 2, estadio: 'BC Place', cidade: 'Vancouver' },
  { grupo: 'K', casa: 1, fora: 3, data: '2026-06-26T16:00:00', rodada: 2, estadio: 'Gillette Stadium', cidade: 'Boston' },
  { grupo: 'K', casa: 0, fora: 3, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'BC Place', cidade: 'Vancouver' },
  { grupo: 'K', casa: 1, fora: 2, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  // --- GRUPO L ---
  { grupo: 'L', casa: 0, fora: 1, data: '2026-06-18T19:00:00', rodada: 1, estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  { grupo: 'L', casa: 2, fora: 3, data: '2026-06-18T16:00:00', rodada: 1, estadio: 'Mercedes-Benz Stadium', cidade: 'Atlanta' },
  { grupo: 'L', casa: 0, fora: 2, data: '2026-06-26T13:00:00', rodada: 2, estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  { grupo: 'L', casa: 1, fora: 3, data: '2026-06-26T19:00:00', rodada: 2, estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { grupo: 'L', casa: 0, fora: 3, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  { grupo: 'L', casa: 1, fora: 2, data: '2026-07-03T20:00:00', rodada: 3, estadio: 'Mercedes-Benz Stadium', cidade: 'Atlanta' },
];

// Mata-mata (times a confirmar conforme fase de grupos)
const MATA_MATA = [
  // Oitavas de Final (Round of 32) — 4-9 jul
  { fase: 'Oitavas de Final', casa: '1ºA', fora: '2ºB', data: '2026-07-04T19:00:00', estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { fase: 'Oitavas de Final', casa: '1ºC', fora: '2ºD', data: '2026-07-04T22:00:00', estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { fase: 'Oitavas de Final', casa: '1ºE', fora: '2ºF', data: '2026-07-05T19:00:00', estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { fase: 'Oitavas de Final', casa: '1ºG', fora: '2ºH', data: '2026-07-05T22:00:00', estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  { fase: 'Oitavas de Final', casa: '1ºI', fora: '2ºJ', data: '2026-07-06T19:00:00', estadio: 'Gillette Stadium', cidade: 'Boston' },
  { fase: 'Oitavas de Final', casa: '1ºK', fora: '2ºL', data: '2026-07-06T22:00:00', estadio: 'BC Place', cidade: 'Vancouver' },
  { fase: 'Oitavas de Final', casa: '1ºB', fora: '2ºA', data: '2026-07-07T19:00:00', estadio: 'Arrowhead Stadium', cidade: 'Kansas City' },
  { fase: 'Oitavas de Final', casa: '1ºD', fora: '2ºC', data: '2026-07-07T22:00:00', estadio: 'Levi\'s Stadium', cidade: 'San Francisco' },
  { fase: 'Oitavas de Final', casa: '1ºF', fora: '2ºE', data: '2026-07-08T19:00:00', estadio: 'Lincoln Financial Field', cidade: 'Filadélfia' },
  { fase: 'Oitavas de Final', casa: '1ºH', fora: '2ºG', data: '2026-07-08T22:00:00', estadio: 'Seattle Seahawks Stadium', cidade: 'Seattle' },
  { fase: 'Oitavas de Final', casa: '1ºJ', fora: '2ºI', data: '2026-07-09T19:00:00', estadio: 'Mercedes-Benz Stadium', cidade: 'Atlanta' },
  { fase: 'Oitavas de Final', casa: '1ºL', fora: '2ºK', data: '2026-07-09T22:00:00', estadio: 'Estadio Azteca', cidade: 'Cidade do México' },
  { fase: 'Oitavas de Final', casa: 'Melhor 3ºA/B/C', fora: 'Melhor 3ºD/E/F', data: '2026-07-10T19:00:00', estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { fase: 'Oitavas de Final', casa: 'Melhor 3ºG/H/I', fora: 'Melhor 3ºJ/K/L', data: '2026-07-10T22:00:00', estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { fase: 'Oitavas de Final', casa: 'Melhor 3º(1)', fora: 'Melhor 3º(2)', data: '2026-07-11T19:00:00', estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { fase: 'Oitavas de Final', casa: 'Melhor 3º(3)', fora: 'Melhor 3º(4)', data: '2026-07-11T22:00:00', estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  // Quartas de Final — 14-17 jul
  { fase: 'Quartas de Final', casa: 'A definir', fora: 'A definir', data: '2026-07-14T19:00:00', estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { fase: 'Quartas de Final', casa: 'A definir', fora: 'A definir', data: '2026-07-14T22:00:00', estadio: 'AT&T Stadium', cidade: 'Dallas' },
  { fase: 'Quartas de Final', casa: 'A definir', fora: 'A definir', data: '2026-07-15T19:00:00', estadio: 'SoFi Stadium', cidade: 'Los Angeles' },
  { fase: 'Quartas de Final', casa: 'A definir', fora: 'A definir', data: '2026-07-15T22:00:00', estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  // Semifinais — 19-22 jul
  { fase: 'Semifinal', casa: 'A definir', fora: 'A definir', data: '2026-07-19T20:00:00', estadio: 'MetLife Stadium', cidade: 'Nova York' },
  { fase: 'Semifinal', casa: 'A definir', fora: 'A definir', data: '2026-07-22T20:00:00', estadio: 'AT&T Stadium', cidade: 'Dallas' },
  // 3º Lugar
  { fase: '3º Lugar', casa: 'A definir', fora: 'A definir', data: '2026-07-25T17:00:00', estadio: 'Hard Rock Stadium', cidade: 'Miami' },
  // Final
  { fase: 'Final', casa: 'A definir', fora: 'A definir', data: '2026-07-19T17:00:00', estadio: 'MetLife Stadium', cidade: 'Nova York' },
];

let _idCounter = 9000000;

function gerarJogosGrupos() {
  const jogos = [];
  CALENDARIO_GRUPOS.forEach(c => {
    const times = GRUPOS[c.grupo];
    const timeCasa = times[c.casa];
    const timeFora = times[c.fora];
    const dataHora = new Date(c.data);
    const dataFormatada = dataHora.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });

    jogos.push({
      id: String(_idCounter++),
      timeCasa,
      timeFora,
      bandeirasCasa: '',
      bandeiraFora: '',
      gols_casa: null,
      gols_fora: null,
      placar: '-',
      status: 'em_breve',
      statusLabel: 'Em breve',
      data: dataFormatada,
      inicio: dataHora.toISOString(),
      fase: `Grupo ${c.grupo} — Rodada ${c.rodada}`,
      estadio: c.estadio,
      cidade: c.cidade,
      grupo: c.grupo,
      fonte: 'estatico'
    });
  });
  return jogos;
}

function gerarJogosMataMata() {
  return MATA_MATA.map(m => {
    const dataHora = new Date(m.data);
    const dataFormatada = dataHora.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
    return {
      id: String(_idCounter++),
      timeCasa: m.casa,
      timeFora: m.fora,
      bandeirasCasa: '',
      bandeiraFora: '',
      gols_casa: null,
      gols_fora: null,
      placar: '-',
      status: 'em_breve',
      statusLabel: 'Em breve',
      data: dataFormatada,
      inicio: dataHora.toISOString(),
      fase: m.fase,
      estadio: m.estadio,
      cidade: m.cidade,
      fonte: 'estatico'
    };
  });
}

function getTodosJogosEstaticos() {
  return [...gerarJogosGrupos(), ...gerarJogosMataMata()];
}

function getGruposEstaticos() {
  return Object.entries(GRUPOS).map(([nome, times]) => ({
    nome,
    times: times.map(t => ({
      nome: t,
      bandeira: '',
      jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0
    }))
  }));
}

module.exports = { getTodosJogosEstaticos, getGruposEstaticos, GRUPOS };
