const tarjetas = document.querySelectorAll('.nosotros-card');

// Al cargar la página, restaurar la tarjeta que estaba volteada
try {
  const guardada = localStorage.getItem('tarjetaVolteada');
  if (guardada !== null && tarjetas[guardada]) {
    tarjetas[guardada].classList.add('volteada');
  }
} catch (e) {
  console.error('No se pudo leer localStorage:', e);
}

// Voltear al hacer clic (solo una a la vez) y guardar el estado
tarjetas.forEach((tarjeta, indice) => {
  tarjeta.addEventListener('click', () => {
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
  });
});