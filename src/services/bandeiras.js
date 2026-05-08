// Mapa de seleções da Copa 2026 → códigos ISO 3166-1 alpha-2
// Bandeiras servidas via FlagCDN (https://flagcdn.com), gratuito, sem API key.
const ISO = {
  'México': 'mx',
  'Jamaica': 'jm',
  'África do Sul': 'za',
  'Uzbequistão': 'uz',
  'Qatar': 'qa',
  'Suíça': 'ch',
  'Canadá': 'ca',
  'Panamá': 'pa',
  'Brasil': 'br',
  'Marrocos': 'ma',
  'Haiti': 'ht',
  'Escócia': 'gb-sct',
  'EUA': 'us',
  'Estados Unidos': 'us',
  'Paraguai': 'py',
  'Austrália': 'au',
  'Nigéria': 'ng',
  'Alemanha': 'de',
  'Curaçao': 'cw',
  'Costa do Marfim': 'ci',
  'Equador': 'ec',
  'Holanda': 'nl',
  'Países Baixos': 'nl',
  'Japão': 'jp',
  'Colômbia': 'co',
  'Camarões': 'cm',
  'Bélgica': 'be',
  'Egito': 'eg',
  'Irã': 'ir',
  'Nova Zelândia': 'nz',
  'Arábia Saudita': 'sa',
  'Uruguai': 'uy',
  'Espanha': 'es',
  'Cabo Verde': 'cv',
  'França': 'fr',
  'Senegal': 'sn',
  'Honduras': 'hn',
  'Venezuela': 've',
  'Argentina': 'ar',
  'Argélia': 'dz',
  'Áustria': 'at',
  'Jordânia': 'jo',
  'Coreia do Sul': 'kr',
  'Inglaterra': 'gb-eng',
  'Tunísia': 'tn',
  'Portugal': 'pt',
  'Sérvia': 'rs',
  'El Salvador': 'sv',
  'Iraque': 'iq'
};

function bandeiraDe(nomeSelecao, tamanho = 'w80') {
  const code = ISO[nomeSelecao];
  if (!code) return '';
  return `https://flagcdn.com/${tamanho}/${code}.png`;
}

module.exports = { bandeiraDe, ISO };
