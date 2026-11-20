// BUSCADOR APEX-IRON
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

const productosIndex = [
  { nombre: 'Componentes de alto rendimiento', keywords: 'cpu procesador tarjeta video ram nvidia intel amd', el: '.card-category:nth-child(1)' },
  { nombre: 'Laptops y Equipos Armados', keywords: 'laptop pc equipo armado computadora', el: '.categorias .col-md-4:nth-child(2)' },
  { nombre: 'Periféricos y Accesorios', keywords: 'perifericos teclado mouse monitor accesorios', el: '.categorias .col-md-4:nth-child(3)' },
  { nombre: 'Garantía Local', keywords: 'garantia', el: '#elegirnos' },
  { nombre: 'Envíos Asegurados', keywords: 'envios', el: '#elegirnos' },
];

function hacerBusqueda() {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) {
    document.querySelectorAll('.card-category').forEach(c => c.style.opacity = '1');
    searchResults.textContent = '';
    return;
  }

  let encontrados = 0;
  document.querySelectorAll('.card-category').forEach(card => {
    const texto = card.innerText.toLowerCase();
    if (texto.includes(q)) {
      card.style.opacity = '1';
      card.style.border = '2px solid #00d1ff';
      encontrados++;
    } else {
      card.style.opacity = '0.3';
      card.style.border = 'none';
    }
  });

  if (encontrados > 0) {
    searchResults.innerHTML = `Se encontraron <b class="text-white">${encontrados}</b> resultados para "${q}"`;
    // Scroll a categorías
    document.querySelector('.categorias')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    searchResults.innerHTML = `No hay resultados para "${q}". Prueba con: cpu, laptop, teclado...`;
  }
}

searchInput?.addEventListener('input', hacerBusqueda);
document.getElementById('btnBuscar')?.addEventListener('click', hacerBusqueda);
searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') hacerBusqueda();
});

// Reset al cerrar
document.getElementById('offcanvasBuscador')?.addEventListener('hidden.bs.offcanvas', () => {
  searchInput.value = '';
  document.querySelectorAll('.card-category').forEach(c => {
    c.style.opacity = '1';
    c.style.border = 'none';
  });
  searchResults.textContent = '';
});