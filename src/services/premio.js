// Taxa de inscrição do bolão e cálculo do prêmio.
// Cada participante deposita R$10; o prêmio é 80% do total arrecadado
// (ou seja, +R$8 a cada pessoa que tem o depósito confirmado).
const TAXA = 10;
const PERCENT_PREMIO = 0.8;

function brl(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Conta os pagantes e calcula o prêmio acumulado.
function calcularPremio(db) {
  const pagantes = db.prepare('SELECT COUNT(*) AS n FROM usuarios WHERE pago = 1').get().n;
  const total = pagantes * TAXA;
  const premio = Math.round(total * PERCENT_PREMIO * 100) / 100;
  return {
    pagantes,
    total,
    premio,
    taxa: TAXA,
    percentual: PERCENT_PREMIO,
    totalFmt: brl(total),
    premioFmt: brl(premio),
    taxaFmt: brl(TAXA)
  };
}

module.exports = { TAXA, PERCENT_PREMIO, calcularPremio, brl };
