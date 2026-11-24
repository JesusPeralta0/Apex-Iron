const tarjetas = document.querySelectorAll('.nosotros-card');

// Restaurar la tarjeta que estaba volteada
try {
  const guardada = localStorage.getItem('tarjetaVolteada');
  if (guardada !== null && tarjetas[guardada]) {
    tarjetas[guardada].classList.add('volteada');
  }
} catch (e) {
  console.error('No se pudo leer localStorage:', e);
}

// Voltear (solo una a la vez) y guardar el estado
function alternarTarjeta(tarjeta, indice) {
  const estabaVolteada = tarjeta.classList.contains('volteada');
  tarjetas.forEach(t => t.classList.remove('volteada'));

  try {
    if (!estabaVolteada) {
      tarjeta.classList.add('volteada');
      localStorage.setItem('tarjetaVolteada', indice);
    } else {
      localStorage.removeItem('tarjetaVolteada');
    }
  } catch (e) {
    console.error('No se pudo guardar en localStorage:', e);
  }
}

tarjetas.forEach((tarjeta, indice) => {
  tarjeta.addEventListener('click', (e) => {
    // Si se hizo clic en LinkedIn/GitHub, no voltear
    if (e.target.closest('.card-social')) return;
    alternarTarjeta(tarjeta, indice);
  });

  // Teclado: solo si el foco está en la tarjeta (no en un enlace)
  tarjeta.addEventListener('keydown', (e) => {
    if (e.target !== tarjeta) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      alternarTarjeta(tarjeta, indice);
    }
  });
});

// Animación de aparición al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.nosotros .reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  observer.observe(el);
});