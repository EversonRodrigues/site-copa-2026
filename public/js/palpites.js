document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-palpitar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const jogoId = btn.dataset.jogoId;
      const card = document.querySelector(`.card-palpite[data-jogo-id="${jogoId}"]`);
      const gols_casa = card.querySelector('[name="gols_casa"]').value;
      const gols_fora = card.querySelector('[name="gols_fora"]').value;

      if (gols_casa === '' || gols_fora === '') {
        alert('Preencha os dois placares antes de palpitar.');
        return;
      }

      try {
        const res = await fetch('/api/palpites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jogo_id: jogoId, gols_casa: Number(gols_casa), gols_fora: Number(gols_fora) })
        });
        const data = await res.json();
        if (res.ok) {
          btn.textContent = 'Palpite enviado!';
          btn.disabled = true;
        } else {
          alert(data.erro || 'Erro ao enviar palpite.');
        }
      } catch {
        alert('Erro de conexão. Tente novamente.');
      }
    });
  });
});
