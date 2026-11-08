import { productos } from '../utils/productos.js';

const params = new URLSearchParams(window.location.search);
const ID = params.get('id');

const PRODUCTO = productos.find(p => p.id === ID);

function renderProducto(producto) {
  if(!producto) {
    document.getElementById('producto').innerHTML = `
      <div class="container text-center">
        <h1 class="text-apex-secondary">Producto no encontrado</h1>
        <a href="index.html" class="btn btn-apex-primary">Volver al catálogo</a>
      </div>`;
    return;
  }

  const descripcion = producto.descripcion ?? producto.description ?? "";
  const imagenes = producto.imagenes ?? [];

  document.title = PRODUCTO.name;

  document.getElementById('p-name').textContent        = producto.name;
  document.getElementById('p-precio').textContent      = `Adquiere este producto por ${Number(producto.precio).toLocaleString('es-MX')} MXN`;
  document.getElementById('p-marca').textContent       = `MARCA: ${producto.marca}`;
  document.getElementById('p-modelo').textContent      = `MODELO: ${producto.modelo}`;
  document.getElementById('p-descripcion').textContent = descripcion;

  // Galería: slides
  document.getElementById('p-galeria').innerHTML = imagenes.map((src, i) => `
    <div class="carousel-item h-100 ${i === 0 ? "active" : ""}">
      <img class="rounded img-fluid h-100" src="${src}" alt="${producto.name} ${i + 1}" loading="lazy">
    </div>`).join('');
}

renderProducto(PRODUCTO);