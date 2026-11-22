import { initCarrito, renderizarCarrito } from './carrito.js';

// 1. INYECCIÓN DEL COMPONENTE NAVBAR EN EL DOM

const contenedorNavbar = document.getElementById('contenedor-navbar');
const navbarGuardado = sessionStorage.getItem('apex_navbar_html');

function montarNavbar(html) {
    if (contenedorNavbar) contenedorNavbar.innerHTML = html;
    initNavbar();
    retirarLinksCirculares();
}

// Si ya lo tenemos guardado, se muestra de inmediato
if (navbarGuardado) montarNavbar(navbarGuardado);

fetch('/componentes/navbar/navbar.html')
    .then(response => {
        if (!response.ok) throw new Error('La ruta a este componente no existe');
        return response.text();
    })
    .then(html => {
        sessionStorage.setItem('apex_navbar_html', html);
        if (!navbarGuardado) montarNavbar(html);
    })
    .catch(error => console.error('Hubo un problema al inyectar el navbar:', error));

// 2. BUSCADOR APEX-IRON

function initNavbar() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const offcanvasBuscador = document.getElementById('offcanvasBuscador');

    const SUGERENCIAS = ['Procesador', 'Tarjeta de video', 'Memoria RAM', 'Teclado', 'Mouse', 'Monitor'];

    const CATEGORIAS = {
        'componentes': 'Componentes',
        'accesorios-laptop': 'Laptops y accesorios',
        'perifericos': 'Periféricos'
    };

    // Cache de productos
    let productosCache = null;

    async function obtenerProductos() {
        if (productosCache) return productosCache;
        try {
            const modulo = await import('/catalogo/utils/productos.js');
            productosCache = modulo.productos;
        } catch (err) {
            console.error('No se pudieron cargar los productos:', err);
            productosCache = [];
        }
        return productosCache;
    }

    // Quita acentos y mayúsculas: "Audífonos" coincide con "audifonos"
    function normalizar(str) {
        return (str ?? '')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function escaparHTML(str) {
        const div = document.createElement('div');
        div.textContent = str ?? '';
        return div.innerHTML;
    }

    // Texto donde se busca (sin la descripción, para evitar resultados irrelevantes)
    // y alias para que "nvidia", "cpu" o "ram" funcionen
    function textoBuscable(p) {
        let texto = normalizar(`${p.nombre} ${p.marca} ${p.modelo} ${CATEGORIAS[p.categoria] ?? p.categoria}`);
        if (texto.includes('geforce') || texto.includes('rtx')) texto += ' nvidia gpu grafica';
        if (texto.includes('ryzen') || texto.includes('procesador')) texto += ' cpu';
        if (texto.includes('tarjeta de video')) texto += ' gpu grafica';
        if (texto.includes('memoria ram')) texto += ' ram';
        if (texto.includes('audifonos')) texto += ' headset auriculares';
        if (texto.includes('bocinas')) texto += ' altavoces speakers';
        return texto;
    }

    function mostrarSugerencias() {
        searchResults.innerHTML = `
            <p class="search-label">Sugerencias</p>
            <div class="search-chips">
                ${SUGERENCIAS.map(s => `<button type="button" class="search-chip" data-q="${escaparHTML(s)}">${escaparHTML(s)}</button>`).join('')}
            </div>
        `;
    }

    async function hacerBusqueda() {
        if (!searchInput || !searchResults) return;

        const valor = searchInput.value.trim();

        if (!valor) {
            mostrarSugerencias();
            return;
        }

        const palabras = normalizar(valor).split(/\s+/).filter(Boolean);
        const productos = await obtenerProductos();

        // Todas las palabras deben coincidir
        const coincidencias = productos.filter(p => {
            const texto = textoBuscable(p);
            return palabras.every(w => texto.includes(w));
        });

        if (coincidencias.length === 0) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <p class="mb-1">No encontramos resultados para "<b>${escaparHTML(valor)}</b>"</p>
                    <p class="mb-0">Prueba con otra palabra o una marca.</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = `
            <p class="search-label">${coincidencias.length} resultado${coincidencias.length > 1 ? 's' : ''}</p>
            <ul class="list-unstyled search-list mb-0">
                ${coincidencias.slice(0, 8).map(p => `
                    <li>
                        <a href="/catalogo/producto/?id=${encodeURIComponent(p.id)}" class="search-item">
                            <span class="search-info">
                                <span class="search-nombre">${escaparHTML(p.nombre)}</span>
                                <span class="search-meta">
                                    ${escaparHTML(p.marca)}
                                    <span class="search-tag">${escaparHTML(CATEGORIAS[p.categoria] ?? p.categoria)}</span>
                                </span>
                            </span>
                            <span class="search-precio">$${Number(p.precio).toLocaleString('es-MX')}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    // Listeners
    searchInput?.addEventListener('input', hacerBusqueda);
    // Placeholder corto en celular para que no se corte
    const mqMovil = window.matchMedia('(max-width: 576px)');

    function ajustarPlaceholder() {
        if (!searchInput) return;
        searchInput.placeholder = mqMovil.matches
            ? 'Buscar producto o marca...'
            : 'Busca un producto, marca o categoría...';
    }

    ajustarPlaceholder();
    mqMovil.addEventListener('change', ajustarPlaceholder);
    // Enter abre el primer resultado
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const primero = searchResults?.querySelector('.search-item');
            if (primero) primero.click();
        }
    });

    // Clic en una sugerencia
    searchResults?.addEventListener('click', (e) => {
        const chip = e.target.closest('.search-chip');
        if (!chip) return;
        searchInput.value = chip.dataset.q;
        hacerBusqueda();
        searchInput.focus();
    });

    // Al abrir: enfocar y mostrar sugerencias
    offcanvasBuscador?.addEventListener('shown.bs.offcanvas', () => {
        searchInput?.focus();
    });
    offcanvasBuscador?.addEventListener('show.bs.offcanvas', () => {
        if (searchResults) mostrarSugerencias();
    });

    // Limpiar al cerrar
    offcanvasBuscador?.addEventListener('hidden.bs.offcanvas', () => {
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    });


    // 3. CONTROL DINÁMICO DEL MENÚ DE USUARIO (APEX-IRON)

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
            // NO LOGUEADO: Admin + Iniciar Sesión + Crear Cuenta
            menu.innerHTML = `
            ${adminItem}
            <li><a class="dropdown-item text-white" href="/auth/login/" style="font-size:14px;">Iniciar Sesión</a></li>
            <li><a class="dropdown-item text-white" href="/auth/registro/" style="font-size:14px;">Crear Cuenta</a></li>
        `;
        } else {
            // LOGUEADO: Admin + Mi Perfil + Cerrar Sesión
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

    initCarrito();
    renderizarCarrito();
}

function retirarLinksCirculares() {
    const currentPath = window.location.pathname;

    document.querySelectorAll("#navbarPrincipal a").forEach(link => {
        const href = new URL(link.href, location.origin).pathname;

        if (href === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
            link.addEventListener("click", e => e.preventDefault());
        }
    });
}