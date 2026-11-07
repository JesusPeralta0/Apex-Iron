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
        let tarjetaProducto = 
        `
        <div class="producto-card container-fluid d-flex justify-content-evenly col-6 col-md-4 card g-4 p-2 border border-0" data-categoria="${PRODUCTO.categoriaPadre}">
            <div class="card-img img-fluid border border-light d-flex align-items-center justify-content-center overflow-hidden">
                <img src="${PRODUCTO.imagenes[0]}" alt="Accecibilidad de producto 1" loading="lazy" class="img-fluid rounded" />
            </div>

            <div class="nombre">
                <h3 class="card-title text-center"> ${PRODUCTO.name} </h3>
                <h4 class="card-subtitle mb-2 text-center text-muted">Algo sobre el producto</h4>
            </div>

            <ul class="list-group list-group-flush">
                <li class="descripcion list-group-item"> ${PRODUCTO.description} </li>
                <li class="list-group-item"> \$${PRODUCTO.precio} </li>
            </ul>

            <div class="card-body">
                <a href="#" class="card-link btn btn-success">Más información</a>
                <a href="#" class="card-link">Comprar</a>
            </div>
        </div>
        `
        ESPACIO_PRODUCTOS.innerHTML += tarjetaProducto;
    }
}

inyectarProductos();


