document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-palpitar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const jogoId = btn.dataset.jogoId;
      const card = document.querySelector(`[data-jogo-id="${jogoId}"]`);
      const gols_casa = card.querySelector('[name="gols_casa"]').value;
      const gols_fora = card.querySelector('[name="gols_fora"]').value;

      if (gols_casa === '' || gols_fora === '') {
        mostrarFeedback(card, 'Preencha os dois placares antes de confirmar.', 'erro');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Salvando…';

      try {
        const res = await fetch('/api/palpites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jogo_id: jogoId,
            gols_casa: Number(gols_casa),
            gols_fora: Number(gols_fora)
          })
        });
        const data = await res.json();

        if (res.ok) {
          // Atualiza label do palpite atual se estiver na seção de edição
          const labelAtual = card.querySelector('.palpite-atual-label');
          if (labelAtual) {
            labelAtual.innerHTML = `Seu palpite atual: <strong>${gols_casa} × ${gols_fora}</strong>`;
            mostrarFeedback(card, 'Palpite atualizado!', 'sucesso');
            btn.textContent = 'Salvar edição';
            btn.disabled = false;
          } else {
            // Novo palpite — esconde o card
            mostrarFeedback(card, 'Palpite confirmado!', 'sucesso');
            setTimeout(() => {
              card.style.opacity = '0';
              card.style.transform = 'translateX(20px)';
              card.style.transition = 'all 0.3s ease';
              setTimeout(() => card.remove(), 300);
            }, 1000);
          }
        } else {
          mostrarFeedback(card, data.erro || 'Erro ao enviar palpite.', 'erro');
          btn.textContent = btn.closest('.card-palpite-editavel') ? 'Salvar edição' : 'Confirmar palpite';
          btn.disabled = false;
        }
      } catch {
        mostrarFeedback(card, 'Erro de conexão. Tente novamente.', 'erro');
        btn.textContent = btn.closest('.card-palpite-editavel') ? 'Salvar edição' : 'Confirmar palpite';
        btn.disabled = false;
      }
    });
  });
});

function mostrarFeedback(card, mensagem, tipo) {
  let feedback = card.querySelector('.palpite-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'palpite-feedback';
    card.appendChild(feedback);
  }
  feedback.textContent = mensagem;
  feedback.className = `palpite-feedback palpite-feedback-${tipo}`;

  if (tipo === 'sucesso') {
    clearTimeout(feedback._timer);
    feedback._timer = setTimeout(() => {
      feedback.remove();
    }, 3000);
  }
}
