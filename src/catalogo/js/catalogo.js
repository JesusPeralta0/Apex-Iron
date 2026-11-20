import { productos } from '../utils/productos.js';

const CATEGORIAS_SELECCIONABLES = document.querySelectorAll('.categoria');
const indicador = document.querySelector('.indicador');
let categoriaSeleccionada = document.querySelector('.categoria.activa');

moverIndicador(categoriaSeleccionada);

function moverIndicador(elemento) {
    indicador.style.left = `${elemento.offsetLeft}px`;
    indicador.style.width = `${elemento.offsetWidth}px`;
    indicador.style.height = `${elemento.offsetHeight}px`;
    indicador.style.top = `${elemento.offsetTop}px`;
}

window.addEventListener('resize', () => {
    moverIndicador(categoriaSeleccionada);
});

CATEGORIAS_SELECCIONABLES.forEach(categoria =>
    categoria.addEventListener('click', () => {
        if (categoriaSeleccionada === categoria) return;
        categoriaSeleccionada.classList.remove('activa');
        categoria.classList.add('activa');
        moverIndicador(categoria);
        categoriaSeleccionada = categoria;
    })
);

function inyectarProductos() {
    const ESPACIO_PRODUCTOS = document.getElementById('productos');
    let htmlProductos = '';

    for (const PRODUCTO of productos) {
        // <img class="rounded img-fluid align-content-center" src="${PRODUCTO.imagenes[0]}" alt="${PRODUCTO.nombre}" loading="lazy"></img>
        let tarjetaProducto =
            `
        <div class="producto-card col-12 col-md-6 col-lg-4" data-categoria="${PRODUCTO.categoriaPadre}">
            <div class="card h-100 p-2 border-0">
                <div class="card-img d-flex ratio ratio-4x3">

                    <div id="galeria-${PRODUCTO.id}" class="carousel slide galeria" data-bs-interval="false">
                        <!-- Puntitos -->
                        <div class="carousel-indicators">
                            ${PRODUCTO.imagenes.map((_, i) => `
                            <button type="button" data-bs-target="#galeria-${PRODUCTO.id}" data-bs-slide-to="${i}"
                                class="bg-apex-primary ${i === 0 ? "active" : ""}" ${i === 0 ? 'aria-current="true"' : ""}
                                aria-label="Imagen ${i + 1}"></button>`).join('')}
                        </div>

                        <!-- Imágenes -->
                        <div class="carousel-inner h-100">
                        ${PRODUCTO.imagenes.map((src, i) => `
                            <div class="carousel-item h-100 ${i === 0 ? "active" : ""}">
                            <img class="rounded img-fluid" src="${src}" alt="${PRODUCTO.nombre} ${i + 1}" loading="lazy">
                            </div>`).join('')}
                        </div>
                    </div>

                </div>
                
                               <!-- Texto -->
                <div class="card-body rounded-bottom-3 vidrio rounded-3 p-3 d-flex flex-column">
                    <h3 class="card-title text-apex-secondary h5 text-center align-content-end titulo-2l">${PRODUCTO.nombre}</h3>
                    <h4 class="card-subtitle text-apex-accent h6 mb-2 text-center text-muted">${PRODUCTO.marca ?? ''}</h4>
                    <p class="card-text text-apex-secondary descripcion-3l">${PRODUCTO.descripcion}</p>
                    <p class="text-apex-secondary fw-bold text-center mb-3">\$${Number(PRODUCTO.precio).toLocaleString('es-MX')} MXN</p>

                    <div class="card-btns mt-auto d-flex flex-column gap-2 align-items-center justify-content-center w-100">
                        <a href="/catalogo/producto/?id=${PRODUCTO.id}" class="btn-apex-secondary text-apex-secondary text-decoration-none text-center w-75">Más información</a>
                        <a href="#" class="btn-apex-primary text-decoration-none text-center w-75 btn-comprar" data-id="${PRODUCTO.id}">Comprar</a>
                    </div>
                </div>
            </div>
        </div>
        `
        htmlProductos += tarjetaProducto;
    }
    ESPACIO_PRODUCTOS.innerHTML = htmlProductos;
}

inyectarProductos();
// Conectar botones "Comprar" del catálogo con el carrito global del navbar
document.getElementById('productos')?.addEventListener('click', (e) => {
    const botonComprar = e.target.closest('.btn-comprar');
    if (!botonComprar) return;

    e.preventDefault(); // Evita que el href="#" brinque la página hacia arriba

    const idProducto = botonComprar.getAttribute('data-id');
    const productoEncontrado = productos.find(p => String(p.id) === String(idProducto));

    if (productoEncontrado && typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito({
            id: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: productoEncontrado.precio,
            imagen: productoEncontrado.imagenes?.[0] || '/res/logos/apex-simple.png'
        });
    }
});
