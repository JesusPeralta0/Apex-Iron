
// 1. INYECCIÓN DEL COMPONENTE NAVBAR EN EL DOM

fetch('/componentes/navbar/navbar.html')
    .then(response => {
        if (!response.ok) throw new Error('La ruta a este componente no existe');
        return response.text();
    })
    .then(html => {
        const contenedorNavbar = document.getElementById('contenedor-navbar');
        if (contenedorNavbar) contenedorNavbar.innerHTML = html;
        initNavbar();
        retirarLinksCirculares();
    })
    .catch(error => console.error('Hubo un problema al inyectar el navbar:', error));


// 2. BUSCADOR INTELIGENTE APEX-IRON

function initNavbar() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const btnBuscar = document.getElementById('btnBuscar');
    const offcanvasBuscador = document.getElementById('offcanvasBuscador');

    const productosIndex = [
        { nombre: 'Componentes de alto rendimiento', keywords: 'cpu procesador tarjeta video ram nvidia intel amd', el: '.card-category:nth-child(1)' },
        { nombre: 'Laptops y Equipos Armados', keywords: 'laptop pc equipo armado computadora', el: '.categorias .col-md-4:nth-child(2)' },
        { nombre: 'Periféricos y Accesorios', keywords: 'perifericos teclado mouse monitor accesorios', el: '.categorias .col-md-4:nth-child(3)' },
        { nombre: 'Garantía Local', keywords: 'garantia', el: '#elegirnos' },
        { nombre: 'Envíos Asegurados', keywords: 'envios', el: '#elegirnos' },
    ];

    function hacerBusqueda() {
        if (!searchInput || !searchResults) return;

        const q = searchInput.value.toLowerCase().trim();

        if (!q) {
            document.querySelectorAll('.card-category').forEach(c => {
                c.style.opacity = '1';
                c.style.border = 'none';
            });
            searchResults.textContent = '';
            return;
        }

        const esInicio = document.querySelector('.card-category') !== null;
        if (!esInicio) {
            const destino = window.location.pathname.includes('catalogo')
                ? `${window.location.pathname}?q=${encodeURIComponent(q)}`
                : `/?q=${encodeURIComponent(q)}#categorias`;

            if (window.location.pathname.includes('catalogo')) {
                filtrarCatalogo(q);
            } else {
                window.location.href = destino;
            }
            return;
        }

        let encontrados = 0;
        const cards = document.querySelectorAll('.card-category');

        cards.forEach((card, index) => {
            const productoData = productosIndex[index];
            const keywords = productoData ? productoData.keywords : '';
            const texto = (card.innerText + ' ' + keywords).toLowerCase();

            if (texto.includes(q)) {
                card.style.opacity = '1';
                card.style.border = '2px solid #00d1ff';
                encontrados++;
            } else {
                card.style.opacity = '0.3';
                card.style.border = 'none';
            }
        });

        if (q.includes('garantia') || q.includes('envios')) {
            const elegirnos = document.querySelector('#elegirnos');
            if (elegirnos) {
                encontrados++;
                elegirnos.style.border = '2px solid #00d1ff';
                setTimeout(() => elegirnos.style.border = 'none', 2000);
            }
        }

        if (encontrados > 0) {
            searchResults.innerHTML = `Se encontraron <b class="text-white">${encontrados}</b> resultados para "${q}"`;
            document.querySelector('.categorias')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            searchResults.innerHTML = `No hay resultados para "${q}". Prueba con: cpu, laptop, teclado...`;
        }
    }

    function filtrarCatalogo(q) {
        let encontrados = 0;
        document.querySelectorAll('.card, .producto-card, [data-producto]').forEach(card => {
            if (card.closest('#navbarPrincipal') || card.closest('footer') || card.classList.contains('card-category')) return;
            const coincide = card.innerText.toLowerCase().includes(q);
            card.style.display = coincide ? '' : 'none';
            if (coincide) encontrados++;
        });
        if (searchResults) {
            searchResults.innerHTML = encontrados > 0
                ? `Se encontraron <b class="text-white">${encontrados}</b> productos para "${q}"`
                : `No hay resultados para "${q}". Prueba con: cpu, laptop, teclado...`;
        }
    }

    // Configurar los listeners
    searchInput?.addEventListener('input', hacerBusqueda);
    btnBuscar?.addEventListener('click', hacerBusqueda);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') hacerBusqueda();
    });

    offcanvasBuscador?.addEventListener('hidden.bs.offcanvas', () => {
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.card-category').forEach(c => {
            c.style.opacity = '1';
            c.style.border = 'none';
        });
        if (searchResults) searchResults.textContent = '';
    });

    // Comprobar parámetros de URL al iniciar
    function checkQueryURL() {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q && searchInput) {
            searchInput.value = q;
        }
    }

    // CONTROL DINÁMICO DEL MENÚ DE USUARIO (APEX-IRON)

    function renderizarMenuUsuario() {
        const menu = document.getElementById('menuUsuario');
        if (!menu) return;

        const user = JSON.parse(localStorage.getItem('apex_user') || 'null');

        // Vista Administrador visible para conectar el formulario de productos
        const adminItem = `
        <li>
            <a class="dropdown-item text-white d-flex align-items-center gap-2" href="/panel_adm/" style="font-size:14px;">
                <i class="bi bi-person-gear"></i> Vista Administrador
            </a>
        </li>
        <li><hr class="dropdown-divider" style="border-color:#333;"></li>
    `;

        if (!user) {
            // NO LOGUEADO: Muestra Admin + Iniciar Sesión + Crear Cuenta
            menu.innerHTML = `
            ${adminItem}
            <li><a class="dropdown-item text-white" href="/auth/login/" style="font-size:14px;">Iniciar Sesión</a></li>
            <li><a class="dropdown-item text-white" href="/auth/registro/" style="font-size:14px;">Crear Cuenta</a></li>
        `;
        } else {
            // LOGUEADO: Muestra Admin + Mi Perfil + Cerrar Sesión
            menu.innerHTML = `
            ${adminItem}
            <li><a class="dropdown-item text-white" href="/perfil/" style="font-size:14px;">Mi Perfil</a></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logout()" style="font-size:14px;">Cerrar Sesión</a></li>
        `;
        }
    }

    window.logout = function () {
        localStorage.removeItem('apex_user');
        localStorage.removeItem('apex_cart');
        window.location.href = '/';
    };

    // Ejecutar al cargar el navbar
    renderizarMenuUsuario();
        // =========================================================
    // 3. LÓGICA DEL CARRITO DE COMPRAS (OFFCANVAS NAVBAR)
    // =========================================================

    let carrito = JSON.parse(localStorage.getItem('apex_cart')) || [];

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

        if (typeof Swal !== 'undefined') {
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

    function renderizarCarrito() {
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

    const btnVaciar = document.getElementById('btn-vaciar');
    const btnPagar = document.getElementById('btn-pagar');

    btnVaciar?.addEventListener('click', () => {
        if (carrito.length === 0) return;
        carrito = [];
        guardarCarrito();
    });

    btnPagar?.addEventListener('click', () => {
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

        carrito = [];
        guardarCarrito();

        window.location.href = '/perfil/';
    });

    // Pintar carrito al terminar de cargar el navbar
    renderizarCarrito();

}

function retirarLinksCirculares() {
    const currentPath = window.location.pathname;

    document.querySelectorAll("#navbarPrincipal a").forEach(link => {
        console.log(currentPath)
        const href = new URL(link.href, location.origin).pathname;

        if (href === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
            link.addEventListener("click", e => e.preventDefault());
        }
    });
}
