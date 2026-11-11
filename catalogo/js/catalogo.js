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
        if(categoriaSeleccionada === categoria) return;
        categoriaSeleccionada.classList.remove('activa');
        categoria.classList.add('activa');
        moverIndicador(categoria);
        categoriaSeleccionada = categoria;
    })
);

function inyectarProductos() {
    const ESPACIO_PRODUCTOS = document.getElementById('productos');
    
    for(const PRODUCTO of productos) {
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
                    <h4 class="card-subtitle text-apex-accent h6 mb-2 text-center text-muted">Algo sobre el producto</h4>
                    <p class="card-text text-apex-secondary descripcion-3l">${PRODUCTO.descripcion}</p>
                    <p class="text-apex-secondary fw-bold mb-3">\$${Number(PRODUCTO.precio).toLocaleString('es-MX')} MXN</p>

                    <div class="card-btns mt-auto d-flex gap-3 align-items-center justify-content-center">
                        <a href="/catalogo/producto.html?id=${PRODUCTO.id}" class="btn-apex-secondary text-apex-secondary text-decoration-underline">Más información</a>
                        <a href="#" class="btn-apex-primary text-decoration-none">Comprar</a>
                    </div>
                </div>
            </div>
        </div>
        `
        ESPACIO_PRODUCTOS.innerHTML += tarjetaProducto;
    }
}

inyectarProductos();


