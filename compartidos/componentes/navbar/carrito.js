import { Swal } from '/js/vendor.js';

// =========================================================
// LÓGICA DEL CARRITO DE COMPRAS (OFFCANVAS NAVBAR)
// =========================================================
let carrito = JSON.parse(localStorage.getItem('apex_cart')) || [];

/**
 * Función que inicializa los elementos siempre presentes en el
 * carrito, como sus botones de vaciar y comprar.
 */
export function initCarrito() {
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnPagar = document.getElementById('btn-pagar');

    btnVaciar.addEventListener('click', () => {
        if (carrito.length === 0) return;
        carrito = [];
        guardarCarrito();
    });

    btnPagar.addEventListener('click', () => {
        if (carrito.length === 0) return;

        const usuario = JSON.parse(localStorage.getItem('apex_user'));
        
        if (!usuario) {
            window.location.href = '/auth/login/';
            return;
        }

        const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const nuevoPedido = {
            folio: 'APX-' + Math.floor(1000 + Math.random() * 9000),
            fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
            usuarioEmail: usuario.email,
            estado: 'Completado',
            total: totalCompra,
            productos: [...carrito]
        };

        const pedidosGuardados = JSON.parse(localStorage.getItem('apex_pedidos') || '[]');
        pedidosGuardados.push(nuevoPedido);
        localStorage.setItem('apex_pedidos', JSON.stringify(pedidosGuardados));

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'success',
                title: `Se han comprado los productos guardados en el carrito`,
                showConfirmButton: false,
                timer: 7200,
                background: '#0d1333',
                color: '#ffffff'
            });
        }
        
        carrito = [];
        guardarCarrito();

        // window.location.href = '/perfil/';
    });
}

/**
 * Función que cambia lo que se muestra en el carrito si hay alguna
 * actualización en cuanto a los productos que se compran.
 */
export function renderizarCarrito() {
    const contenedorItems = document.getElementById('cart-items');
    const badgeCount = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');

    if (!contenedorItems || !badgeCount || !totalEl) return;

    const totalPiezas = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    badgeCount.textContent = totalPiezas;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `<p class="text-center text-secondary mt-5" id="cart-empty">Tu carrito está vacío</p>`;
        totalEl.textContent = '$0.00';
        return;
    }

    let totalDinero = 0;

    contenedorItems.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        totalDinero += subtotal;

        return `
            <div class="d-flex align-items-center justify-content-between border-bottom border-secondary py-3 gap-2">
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; background: #0d1333;">
                <div class="flex-grow-1">
                    <h6 class="mb-0 text-white small fw-semibold">${item.nombre}</h6>
                    <small class="text-info">$${item.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</small>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button class="btn btn-sm btn-outline-light py-0 px-2" onclick="cambiarCantidadCarrito('${item.id}', -1)">-</button>
                        <span class="small fw-bold">${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-light py-0 px-2" onclick="cambiarCantidadCarrito('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="btn btn-sm text-danger" onclick="eliminarDelCarrito('${item.id}')">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        `;
    }).join('');

    totalEl.textContent = `$${totalDinero.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

function guardarCarrito() {
    localStorage.setItem('apex_cart', JSON.stringify(carrito));
    renderizarCarrito();
}

window.agregarAlCarrito = function (producto) {
    const existente = carrito.find(item => String(item.id) === String(producto.id));

    if (existente) {
        existente.cantidad += producto.cantidad || 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagen || '/res/logos/apex-simple.png',
            cantidad: producto.cantidad || 1
        });
    }

    guardarCarrito();

    console.log("A punto de sweet");
    console.log(typeof Swal !== 'undefined')
    if (typeof Swal !== 'undefined') {
        console.log("Hay sweet");
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: `${producto.nombre} agregado al carrito`,
            showConfirmButton: false,
            timer: 1800,
            background: '#0d1333',
            color: '#ffffff'
        });
    }
};

window.cambiarCantidadCarrito = function (id, delta) {
    const index = carrito.findIndex(item => String(item.id) === String(id));
    if (index === -1) return;

    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
};

window.eliminarDelCarrito = function (id) {
    carrito = carrito.filter(item => String(item.id) !== String(id));
    guardarCarrito();
};




