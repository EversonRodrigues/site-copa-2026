/**
 * Gerador de Apresentação de Vendas — Site Copa do Mundo 2026
 * Tema: FIFA 2026 Dark Premium
 * Cores: #07111F (fundo), #E8112D (vermelho), #FFD700 (ouro)
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new PptxGenJS();

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — FIFA 2026
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  darkNavy:   '07111F',
  darkCard:   '0D1B2A',
  darkBorder: '1a2d42',
  red:        'E8112D',
  redDark:    'B00D23',
  gold:       'FFD700',
  goldDark:   'CC9900',
  white:      'FFFFFF',
  gray:       'B0BEC5',
  lightGray:  'E8EDF4',
  textMuted:  '8899AA',
};

pptx.defineLayout({ name: 'WIDESCREEN', width: 13.33, height: 7.5 });
pptx.layout = 'WIDESCREEN';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function bgFull(slide, color = C.darkNavy) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color },
    line: { color, width: 0 },
  });
}

function accentLine(slide, x, y, w, color = C.red) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.05,
    fill: { color },
    line: { color, width: 0 },
  });
}

function card(slide, x, y, w, h, fillColor = C.darkCard, opacity = 100) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: fillColor, transparency: 100 - opacity },
    line: { color: C.darkBorder, width: 1 },
    shadow: { type: 'outer', color: '000000', blur: 8, offset: 4, angle: 315, opacity: 0.4 },
  });
}

function titleText(slide, text, x, y, w, h = 1.2, size = 40, color = C.white, bold = true, align = 'left') {
  slide.addText(text, {
    x, y, w, h,
    fontSize: size,
    fontFace: 'Segoe UI',
    color,
    bold,
    align,
    valign: 'middle',
    charSpacing: -0.5,
    wrap: true,
  });
}

function bodyText(slide, text, x, y, w, h = 0.5, size = 14, color = C.gray, bold = false, align = 'left') {
  slide.addText(text, {
    x, y, w, h,
    fontSize: size,
    fontFace: 'Segoe UI',
    color,
    bold,
    align,
    valign: 'top',
    wrap: true,
  });
}

function badge(slide, text, x, y, bgColor = C.red, textColor = C.white, w = 2) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.3,
    fill: { color: bgColor },
    line: { color: bgColor, width: 0 },
    rectRadius: 0.15,
  });
  slide.addText(text, {
    x, y, w, h: 0.3,
    fontSize: 9,
    fontFace: 'Segoe UI',
    color: textColor,
    bold: true,
    align: 'center',
    valign: 'middle',
    charSpacing: 1,
  });
}

function featureCard(slide, x, y, icon, title, desc) {
  card(slide, x, y, 3.8, 2.0);
  slide.addText(icon, { x: x + 0.2, y: y + 0.15, w: 0.5, h: 0.5, fontSize: 22, align: 'center', valign: 'middle' });
  slide.addText(title, {
    x: x + 0.75, y: y + 0.15, w: 2.8, h: 0.5,
    fontSize: 13, fontFace: 'Segoe UI', color: C.gold, bold: true, valign: 'middle',
  });
  accentLine(slide, x + 0.2, y + 0.72, 3.4, C.darkBorder);
  slide.addText(desc, {
    x: x + 0.2, y: y + 0.82, w: 3.4, h: 1.1,
    fontSize: 11, fontFace: 'Segoe UI', color: C.gray, valign: 'top', wrap: true,
  });
}

function statBox(slide, x, y, number, label, color = C.gold) {
  card(slide, x, y, 2.6, 1.5);
  slide.addText(number, {
    x, y: y + 0.1, w: 2.6, h: 0.8,
    fontSize: 36, fontFace: 'Segoe UI', color, bold: true, align: 'center', valign: 'middle',
  });
  accentLine(slide, x + 0.3, y + 0.95, 2.0, color);
  slide.addText(label, {
    x, y: y + 1.05, w: 2.6, h: 0.4,
    fontSize: 11, fontFace: 'Segoe UI', color: C.gray, align: 'center', valign: 'middle',
  });
}

function slideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.5, y: 7.15, w: 0.75, h: 0.25,
    fontSize: 9, fontFace: 'Segoe UI', color: C.textMuted, align: 'right', valign: 'middle',
  });
}

function footerBar(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: 13.33, h: 0.3,
    fill: { color: C.darkCard },
    line: { color: C.darkBorder, width: 0 },
  });
  accentLine(slide, 0, 7.2, 13.33, C.red);
  slide.addText('Site Copa do Mundo 2026  ·  Everson Rodrigues  ·  Desenvolvedor Full-Stack', {
    x: 0.4, y: 7.22, w: 10, h: 0.25,
    fontSize: 9, fontFace: 'Segoe UI', color: C.textMuted, valign: 'middle',
  });
}

function decorCircle(slide, x, y, size, color, opacity = 15) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color, transparency: 100 - opacity },
    line: { color, width: 0 },
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — CAPA
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);

  // Decoração - círculos
  decorCircle(slide, 9.5, -1.5, 5.5, C.red, 12);
  decorCircle(slide, 10.5, 3.5, 3.5, C.gold, 8);
  decorCircle(slide, -0.5, 5.5, 3.0, C.red, 10);

  // Linha vertical ouro
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 1.2, w: 0.07, h: 3.8,
    fill: { color: C.gold },
    line: { color: C.gold, width: 0 },
  });

  // Badge superior
  badge(slide, '⚽  APRESENTAÇÃO COMERCIAL', 0.8, 0.7, C.red, C.white, 3.5);

  // Título principal
  titleText(slide, 'Site Copa do\nMundo 2026', 0.8, 1.3, 8.5, 3.5, 58, C.white, true, 'left');

  // Destaque ouro
  titleText(slide, 'FIFA World Cup™', 0.8, 4.5, 6, 0.7, 20, C.gold, false, 'left');

  // Subtítulo
  bodyText(slide, 'Plataforma completa com calendário de jogos, seleções, bolão interativo,\nnotícias em tempo real e experiência visual de alto impacto.', 0.8, 5.1, 7.5, 0.9, 14, C.gray, false, 'left');

  // Card direito
  card(slide, 9.8, 1.5, 3.1, 4.5);
  slide.addText('🏆', { x: 9.8, y: 1.7, w: 3.1, h: 1.0, fontSize: 50, align: 'center', valign: 'middle' });
  slide.addText('Desenvolvido por', { x: 9.8, y: 2.75, w: 3.1, h: 0.4, fontSize: 10, fontFace: 'Segoe UI', color: C.textMuted, align: 'center', valign: 'middle', bold: false });
  slide.addText('Everson Rodrigues', { x: 9.8, y: 3.1, w: 3.1, h: 0.5, fontSize: 15, fontFace: 'Segoe UI', color: C.gold, align: 'center', valign: 'middle', bold: true });
  accentLine(slide, 10.2, 3.7, 2.3, C.darkBorder);
  slide.addText('Desenvolvedor Full-Stack', { x: 9.8, y: 3.8, w: 3.1, h: 0.4, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, align: 'center', valign: 'middle' });
  slide.addText('Node.js · Express · EJS\nSQLite · JavaScript', { x: 9.8, y: 4.25, w: 3.1, h: 0.65, fontSize: 10, fontFace: 'Segoe UI', color: C.textMuted, align: 'center', valign: 'middle' });

  footerBar(slide);
  slideNumber(slide, 1, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — O PROJETO
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, -1, -1, 4, C.gold, 8);
  decorCircle(slide, 11, 5, 3.5, C.red, 10);

  badge(slide, 'O PROJETO', 0.5, 0.4, C.gold, C.darkNavy, 1.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.red);

  titleText(slide, 'Uma experiência completa\nda Copa do Mundo', 0.5, 0.95, 9, 2.0, 34, C.white, true, 'left');

  bodyText(slide, 'O Site Copa do Mundo 2026 é uma plataforma web full-stack que centraliza tudo que o torcedor precisa: calendário completo dos 104 jogos, perfis ricos das 48 seleções participantes, bolão interativo com ranking em tempo real e notícias atualizadas via RSS.', 0.5, 2.8, 12, 1.1, 14, C.gray, false, 'left');

  // Cards de destaque
  const highlights = [
    { icon: '📅', label: '104 Jogos', desc: 'Calendário completo com filtro por fase' },
    { icon: '🌍', label: '48 Seleções', desc: 'Perfis ricos com dados da FIFA' },
    { icon: '🏆', label: 'Bolão', desc: 'Sistema de palpites com pontuação' },
    { icon: '📰', label: 'Notícias', desc: 'Feeds RSS em tempo real' },
  ];

  highlights.forEach((h, i) => {
    const x = 0.5 + i * 3.05;
    card(slide, x, 4.0, 2.8, 2.3);
    slide.addText(h.icon, { x, y: 4.1, w: 2.8, h: 0.7, fontSize: 28, align: 'center', valign: 'middle' });
    slide.addText(h.label, { x, y: 4.8, w: 2.8, h: 0.4, fontSize: 13, fontFace: 'Segoe UI', color: C.gold, bold: true, align: 'center', valign: 'middle' });
    slide.addText(h.desc, { x: x + 0.15, y: 5.25, w: 2.5, h: 0.9, fontSize: 11, fontFace: 'Segoe UI', color: C.gray, align: 'center', valign: 'top', wrap: true });
  });

  footerBar(slide);
  slideNumber(slide, 2, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — FUNCIONALIDADES DETALHADAS
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, 12, -1, 4, C.red, 8);

  badge(slide, 'FUNCIONALIDADES', 0.5, 0.4, C.red, C.white, 2.2);
  accentLine(slide, 0.5, 0.85, 12.3, C.gold);
  titleText(slide, 'Tudo que o torcedor precisa', 0.5, 0.95, 10, 1.0, 32, C.white, true, 'left');

  // 6 feature cards
  const features = [
    { icon: '⚽', title: 'Calendário de Jogos', desc: 'Todos os 104 jogos da Copa com data, horário e placar. Filtro por fase: grupos, oitavas, quartas, semis e final.' },
    { icon: '🌍', title: 'Perfil das Seleções', desc: '48 seleções com treinador, estilo de jogo, prováveis convocados, conquistas e curiosidades.' },
    { icon: '📊', title: 'Grupos e Tabela', desc: '12 grupos (A–L) com classificação, pontos, saldo de gols e confrontos diretos.' },
    { icon: '🎯', title: 'Bolão Interativo', desc: 'Cadastro, login seguro, palpites editáveis até 1h antes do jogo e ranking de pontos.' },
    { icon: '📰', title: 'Notícias Filtradas', desc: 'Feeds do GE Globo, ESPN Brasil e UOL com filtro automático por relevância Copa 2026.' },
    { icon: '⏱️', title: 'Countdown em Tempo Real', desc: 'Contagem regressiva animada para o início da Copa, com próximos jogos ao vivo.' },
  ];

  const cols = [0.4, 4.35, 8.3];
  const rows = [2.1, 4.3];
  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    featureCard(slide, cols[col], rows[row], f.icon, f.title, f.desc);
  });

  footerBar(slide);
  slideNumber(slide, 3, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — DESIGN & UX
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, -0.5, 4.5, 4, C.gold, 8);
  decorCircle(slide, 10.5, -1, 4, C.red, 10);

  badge(slide, 'DESIGN & UX', 0.5, 0.4, C.gold, C.darkNavy, 1.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.red);
  titleText(slide, 'Visual de alto impacto,\ninspiraç​ão FIFA 2026™', 0.5, 0.95, 9, 1.7, 32, C.white, true, 'left');

  // Coluna esquerda - lista de features de design
  const designFeats = [
    ['🎨', 'Sistema de design FIFA', 'Paleta oficial: Navy #07111F, Vermelho #E8112D, Ouro #FFD700'],
    ['✨', 'Animações CSS avançadas', 'Keyframes, scroll reveal, efeito shimmer, floating ball, pulse AO VIVO'],
    ['📱', 'Totalmente responsivo', 'Mobile-first, adaptado para qualquer tela'],
    ['🌟', 'Efeitos interativos', 'Ripple nos botões, counter animado, flip no countdown'],
  ];

  designFeats.forEach((f, i) => {
    const y = 2.75 + i * 0.95;
    card(slide, 0.5, y, 6.5, 0.82);
    slide.addText(f[0], { x: 0.65, y, w: 0.5, h: 0.82, fontSize: 18, align: 'center', valign: 'middle' });
    slide.addText(f[1], { x: 1.25, y: y + 0.08, w: 5.6, h: 0.32, fontSize: 12, fontFace: 'Segoe UI', color: C.gold, bold: true, valign: 'middle' });
    slide.addText(f[2], { x: 1.25, y: y + 0.42, w: 5.6, h: 0.35, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, valign: 'top' });
  });

  // Coluna direita - paleta + efeitos
  card(slide, 7.4, 2.7, 5.4, 4.0);
  slide.addText('Paleta de Cores', { x: 7.6, y: 2.85, w: 5.0, h: 0.4, fontSize: 13, fontFace: 'Segoe UI', color: C.white, bold: true, valign: 'middle' });

  const colors = [
    [C.darkNavy, '#07111F', 'Fundo'],
    [C.red, '#E8112D', 'Vermelho FIFA'],
    [C.gold, '#FFD700', 'Ouro FIFA'],
    ['1a2d42', '#1A2D42', 'Cards'],
  ];
  colors.forEach((c, i) => {
    const y = 3.35 + i * 0.62;
    slide.addShape(pptx.ShapeType.rect, { x: 7.7, y, w: 0.55, h: 0.42, fill: { color: c[0] }, line: { color: C.darkBorder, width: 1 } });
    slide.addText(c[1], { x: 8.35, y, w: 1.5, h: 0.42, fontSize: 12, fontFace: 'Courier New', color: C.lightGray, bold: true, valign: 'middle' });
    slide.addText(c[2], { x: 9.9, y, w: 2.6, h: 0.42, fontSize: 11, fontFace: 'Segoe UI', color: C.textMuted, valign: 'middle' });
  });

  accentLine(slide, 7.7, 5.9, 4.8, C.darkBorder);
  slide.addText('Arquivos CSS modulares: variables.css, base.css,\ncomponents.css, animations.css, layout.css', { x: 7.7, y: 6.0, w: 5.0, h: 0.6, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, valign: 'top', wrap: true });

  footerBar(slide);
  slideNumber(slide, 4, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — STACK TECNOLÓGICO
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, 12, 6, 4, C.gold, 8);

  badge(slide, 'TECNOLOGIA', 0.5, 0.4, C.red, C.white, 1.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.gold);
  titleText(slide, 'Stack moderno e robusto', 0.5, 0.95, 10, 1.0, 32, C.white, true, 'left');

  const techs = [
    { layer: 'BACKEND', color: C.red, items: [
      ['Node.js v25', 'Runtime JavaScript de alta performance'],
      ['Express 5', 'Framework web com suporte a async nativo'],
      ['EJS 5', 'Template engine para SSR'],
      ['better-sqlite3', 'Banco de dados SQLite síncrono e rápido'],
    ]},
    { layer: 'SEGURANÇA & AUTH', color: C.gold, items: [
      ['bcrypt', 'Hash seguro de senhas'],
      ['express-session', 'Gerenciamento de sessões'],
      ['express-rate-limit', 'Proteção contra brute force'],
      ['dotenv', 'Variáveis de ambiente seguras'],
    ]},
    { layer: 'DADOS & INTEGRAÇÕES', color: '4FC3F7', items: [
      ['TheSportsDB API', 'Placares em tempo real (gratuita)'],
      ['rss-parser', 'Feeds RSS: GE, ESPN, UOL'],
      ['Dataset estático', '104 jogos e 48 seleções com dados ricos'],
      ['node-fetch', 'HTTP client para APIs externas'],
    ]},
  ];

  techs.forEach((cat, ci) => {
    const x = 0.4 + ci * 4.27;
    card(slide, x, 2.1, 3.95, 4.9);
    badge(slide, cat.layer, x + 0.15, 2.2, cat.color, cat.color === C.gold ? C.darkNavy : C.white, 3.65);
    cat.items.forEach((item, ii) => {
      const iy = 2.65 + ii * 1.0;
      accentLine(slide, x + 0.2, iy, 3.55, C.darkBorder);
      slide.addText('▸  ' + item[0], { x: x + 0.2, y: iy + 0.08, w: 3.55, h: 0.38, fontSize: 12, fontFace: 'Segoe UI', color: cat.color, bold: true, valign: 'middle' });
      slide.addText(item[1], { x: x + 0.35, y: iy + 0.45, w: 3.4, h: 0.38, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, valign: 'top' });
    });
  });

  footerBar(slide);
  slideNumber(slide, 5, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — SISTEMA DE BOLÃO
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, -0.5, -0.5, 4, C.red, 10);
  decorCircle(slide, 11, 5.5, 4, C.gold, 8);

  badge(slide, '⭐  SISTEMA DE BOLÃO', 0.5, 0.4, C.red, C.white, 2.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.gold);
  titleText(slide, 'Engajamento real com\npalpites e ranking', 0.5, 0.95, 9, 1.7, 32, C.white, true, 'left');

  // Pontuação
  const scoring = [
    { pts: '5', icon: '⭐', label: 'Placar Exato', desc: 'Acertou o placar completo\nEx: palpitou 2×1, deu 2×1', color: C.gold },
    { pts: '2', icon: '✅', label: 'Resultado Certo', desc: 'Acertou o vencedor\nEx: palpitou 2×1, deu 3×0', color: '4CAF50' },
    { pts: '0', icon: '❌', label: 'Resultado Errado', desc: 'Não acertou o resultado\nEx: palpitou vitória, deu empate', color: C.red },
  ];

  scoring.forEach((s, i) => {
    const x = 0.5 + i * 3.3;
    card(slide, x, 2.7, 3.0, 2.7);
    slide.addText(s.icon, { x, y: 2.8, w: 3.0, h: 0.65, fontSize: 28, align: 'center', valign: 'middle' });
    slide.addText(s.pts + ' pts', { x, y: 3.45, w: 3.0, h: 0.7, fontSize: 32, fontFace: 'Segoe UI', color: s.color, bold: true, align: 'center', valign: 'middle' });
    slide.addText(s.label, { x, y: 4.15, w: 3.0, h: 0.4, fontSize: 12, fontFace: 'Segoe UI', color: C.white, bold: true, align: 'center', valign: 'middle' });
    slide.addText(s.desc, { x: x + 0.2, y: 4.55, w: 2.6, h: 0.7, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, align: 'center', valign: 'top', wrap: true });
  });

  // Features do bolão
  card(slide, 10.1, 2.7, 2.8, 4.5);
  slide.addText('Features', { x: 10.1, y: 2.85, w: 2.8, h: 0.4, fontSize: 13, fontFace: 'Segoe UI', color: C.gold, bold: true, align: 'center', valign: 'middle' });
  const bolaoFeats = ['✅ Cadastro seguro (bcrypt)', '✅ Login com sessão', '✅ Palpitar em qualquer jogo', '✅ Editar até 1h antes', '✅ Histórico de palpites', '✅ Ranking em tempo real', '✅ Medalhas top 3 🥇🥈🥉'];
  bolaoFeats.forEach((f, i) => {
    slide.addText(f, { x: 10.2, y: 3.35 + i * 0.52, w: 2.6, h: 0.45, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, valign: 'middle', wrap: true });
  });

  footerBar(slide);
  slideNumber(slide, 6, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — DADOS EM TEMPO REAL
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, 12, -0.5, 4.5, C.red, 8);

  badge(slide, 'DADOS AO VIVO', 0.5, 0.4, C.red, C.white, 2.2);
  accentLine(slide, 0.5, 0.85, 12.3, C.gold);
  titleText(slide, 'Informações atualizadas\nem tempo real', 0.5, 0.95, 10, 1.7, 32, C.white, true, 'left');

  // Arquitetura de dados
  const sources = [
    { icon: '🏟️', title: 'TheSportsDB', sub: 'API Gratuita', desc: 'Placares, status dos jogos (FT, NS, LIVE), estatísticas ao vivo. Sem necessidade de API key — 100% gratuito.', color: '4FC3F7' },
    { icon: '📰', title: 'RSS Feeds', sub: '3 Portais', desc: 'GE Globo, ESPN Brasil e UOL Esporte. Filtro automático por palavras-chave Copa: copa, mundial, 2026, seleção, FIFA, Brasil, Argentina...', color: C.gold },
    { icon: '📋', title: 'Dataset Estático', sub: 'Confiável', desc: '104 jogos com todos os dados FIFA: grupos, fases, sede, horários UTC. 48 seleções com treinador, ranking FIFA, estilo, conquistas.', color: 'A5D6A7' },
  ];

  sources.forEach((s, i) => {
    const x = 0.4 + i * 4.27;
    card(slide, x, 2.7, 3.95, 3.9);
    slide.addText(s.icon, { x, y: 2.8, w: 3.95, h: 0.7, fontSize: 30, align: 'center', valign: 'middle' });
    slide.addText(s.title, { x: x + 0.2, y: 3.5, w: 3.55, h: 0.45, fontSize: 14, fontFace: 'Segoe UI', color: s.color, bold: true, align: 'center', valign: 'middle' });
    badge(slide, s.sub, x + 0.85, 3.95, s.color, C.darkNavy, 2.25);
    slide.addText(s.desc, { x: x + 0.2, y: 4.35, w: 3.55, h: 2.0, fontSize: 11, fontFace: 'Segoe UI', color: C.gray, valign: 'top', wrap: true });
  });

  footerBar(slide);
  slideNumber(slide, 7, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 8 — NÚMEROS DO PROJETO
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, -0.5, -0.5, 4, C.gold, 8);
  decorCircle(slide, 11, 5, 3, C.red, 10);

  badge(slide, 'NÚMEROS', 0.5, 0.4, C.gold, C.darkNavy, 1.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.red);
  titleText(slide, 'O projeto em números', 0.5, 0.95, 10, 1.0, 32, C.white, true, 'left');

  // Stats grid
  const stats = [
    ['104', 'Jogos', C.gold], ['48', 'Seleções', C.red], ['12', 'Grupos (A–L)', C.gold],
    ['6', 'Fases', C.red], ['7', 'Páginas', C.gold], ['3', 'Feeds RSS', C.red],
    ['5', 'CSS Modulares', C.gold], ['3', 'Pontuações', C.red],
  ];

  const sRow = [2.0, 3.65, 5.3];
  const sCols = [0.35, 3.1, 5.85, 8.6, 11.35];

  stats.forEach((s, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    statBox(slide, 0.35 + col * 3.2, 2.0 + row * 1.75, s[0], s[1], s[2]);
  });

  // Frase de impacto
  card(slide, 0.5, 5.4, 12.3, 1.2);
  slide.addText('💻  Desenvolvido inteiramente por um único desenvolvedor — do banco de dados ao CSS de animações.', {
    x: 0.7, y: 5.5, w: 11.9, h: 1.0,
    fontSize: 15, fontFace: 'Segoe UI', color: C.white, bold: false, align: 'center', valign: 'middle', wrap: true,
  });

  footerBar(slide);
  slideNumber(slide, 8, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 9 — POR QUE COMPRAR / VALOR
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);
  decorCircle(slide, 12.5, -0.5, 5, C.red, 10);
  decorCircle(slide, -0.5, 5.5, 3.5, C.gold, 8);

  badge(slide, '💰  PROPOSTA DE VALOR', 0.5, 0.4, C.red, C.white, 2.8);
  accentLine(slide, 0.5, 0.85, 12.3, C.gold);
  titleText(slide, 'Por que investir neste projeto?', 0.5, 0.95, 10, 1.0, 32, C.white, true, 'left');

  // Coluna esquerda
  const reasons = [
    { icon: '🚀', title: 'Pronto para produção', desc: 'Deploy imediato. Apenas configure .env com SESSION_SECRET e PORT, e o sistema está no ar.' },
    { icon: '🔒', title: 'Segurança implementada', desc: 'Rate limiting, hash bcrypt, sessões seguras, validação de inputs — proteções reais, não teóricas.' },
    { icon: '📈', title: 'Alta escalabilidade', desc: 'SQLite para eventos de curto prazo, arquitetura limpa para migrar para PostgreSQL com mínimo esforço.' },
    { icon: '🎨', title: 'Design diferenciado', desc: 'Visual FIFA 2026 com animações exclusivas — os usuários vão se empolgar e compartilhar.' },
  ];

  reasons.forEach((r, i) => {
    const y = 2.05 + i * 1.1;
    card(slide, 0.5, y, 6.0, 0.95);
    slide.addText(r.icon, { x: 0.6, y, w: 0.6, h: 0.95, fontSize: 20, align: 'center', valign: 'middle' });
    slide.addText(r.title, { x: 1.3, y: y + 0.05, w: 5.0, h: 0.38, fontSize: 12, fontFace: 'Segoe UI', color: C.gold, bold: true, valign: 'middle' });
    slide.addText(r.desc, { x: 1.3, y: y + 0.48, w: 5.0, h: 0.42, fontSize: 10, fontFace: 'Segoe UI', color: C.gray, valign: 'top', wrap: true });
  });

  // Coluna direita — o que está incluso
  card(slide, 6.9, 2.05, 6.0, 4.0);
  badge(slide, '✅  INCLUSO NA COMPRA', 7.1, 2.2, C.gold, C.darkNavy, 3.6);
  const included = [
    '📁  Código-fonte completo e comentado',
    '📖  README profissional com guia de instalação',
    '🗃️  Schema do banco de dados documentado',
    '🔧  Arquivo .env.example configurado',
    '🎨  6 arquivos CSS modulares organizados',
    '📱  Layout 100% responsivo mobile',
    '🔄  Auto-reload em desenvolvimento',
    '⚽  Dataset com todos os 104 jogos FIFA',
  ];
  included.forEach((item, i) => {
    slide.addText(item, { x: 7.1, y: 2.65 + i * 0.42, w: 5.6, h: 0.4, fontSize: 11, fontFace: 'Segoe UI', color: C.gray, valign: 'middle' });
  });

  footerBar(slide);
  slideNumber(slide, 9, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 10 — CTA / CONTATO
// ─────────────────────────────────────────────────────────────────────────────
{
  const slide = pptx.addSlide();
  bgFull(slide);

  // Decorações dramáticas
  decorCircle(slide, 9.5, -2.5, 7, C.red, 15);
  decorCircle(slide, 10.5, 2.5, 5, C.gold, 8);
  decorCircle(slide, -1.5, 5.5, 4, C.red, 12);

  // Linha vertical ouro
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.55, y: 1.5, w: 0.07, h: 3.2,
    fill: { color: C.gold },
    line: { color: C.gold, width: 0 },
  });

  badge(slide, '📩  ENTRE EM CONTATO', 0.8, 1.2, C.red, C.white, 3.0);
  titleText(slide, 'Vamos trabalhar\njuntos?', 0.8, 1.65, 8, 2.2, 52, C.white, true, 'left');
  titleText(slide, 'Pronto para colocar sua marca na Copa!', 0.8, 3.65, 8.5, 0.7, 18, C.gold, false, 'left');

  bodyText(slide, 'Personalizações, novas funcionalidades, deploy em servidor, integração com APIs pagas — tudo pode ser negociado.', 0.8, 4.3, 7.5, 0.8, 14, C.gray, false, 'left');

  // Card de contato
  card(slide, 9.4, 1.4, 3.6, 5.0);

  const contacts = [
    ['👤', 'Desenvolvedor', 'Everson Rodrigues'],
    ['💼', 'GitHub', 'github.com/EversonRodrigues'],
    ['🛠️', 'Especialidade', 'Node.js · Express · SQLite'],
    ['🎨', 'Design', 'CSS avançado · Animações · UX'],
    ['⚽', 'Projeto', 'Site Copa do Mundo 2026'],
  ];

  contacts.forEach((c, i) => {
    const y = 1.65 + i * 0.9;
    slide.addText(c[0], { x: 9.55, y, w: 0.55, h: 0.75, fontSize: 18, align: 'center', valign: 'middle' });
    slide.addText(c[1], { x: 10.15, y: y + 0.05, w: 2.65, h: 0.3, fontSize: 9, fontFace: 'Segoe UI', color: C.textMuted, valign: 'middle', bold: false, charSpacing: 0.5 });
    slide.addText(c[2], { x: 10.15, y: y + 0.35, w: 2.65, h: 0.35, fontSize: 11, fontFace: 'Segoe UI', color: C.white, bold: true, valign: 'middle' });
    if (i < contacts.length - 1) accentLine(slide, 9.6, y + 0.82, 3.2, C.darkBorder);
  });

  // Botão CTA
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 5.3, w: 4.0, h: 0.72,
    fill: { color: C.red },
    line: { color: C.redDark, width: 0 },
    shadow: { type: 'outer', color: C.red, blur: 12, offset: 0, angle: 0, opacity: 0.6 },
  });
  slide.addText('⚽  Quero este Projeto!', {
    x: 0.8, y: 5.3, w: 4.0, h: 0.72,
    fontSize: 17, fontFace: 'Segoe UI', color: C.white, bold: true, align: 'center', valign: 'middle',
  });

  // Rodapé especial
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.2, w: 13.33, h: 0.3,
    fill: { color: C.darkCard },
    line: { color: C.darkBorder, width: 0 },
  });
  accentLine(slide, 0, 7.2, 13.33, C.gold);
  slide.addText('Site Copa do Mundo 2026  ·  ⚽  Feito com paixão pela Copa  ·  Everson Rodrigues', {
    x: 0, y: 7.22, w: 13.33, h: 0.25,
    fontSize: 9, fontFace: 'Segoe UI', color: C.textMuted, align: 'center', valign: 'middle',
  });

  slideNumber(slide, 10, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SALVAR
// ─────────────────────────────────────────────────────────────────────────────
const outputDir = path.join(__dirname, '..', 'docs');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, 'Apresentacao-Copa-2026.pptx');

pptx.writeFile({ fileName: outputFile }).then(() => {
  console.log('✅ Apresentação gerada com sucesso!');
  console.log('📁 Arquivo:', outputFile);
}).catch(err => {
  console.error('❌ Erro ao gerar apresentação:', err);
  process.exit(1);
});
