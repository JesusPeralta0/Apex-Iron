
// 1. INYECCIÓN DEL COMPONENTE NAVBAR EN EL DOM

const navbarHTML = `
<header>
     <nav class="navbar navbar-expand-lg navbar-dark px-4 py-1" id="navbarPrincipal">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center" href="#">
                <img src="res/logos/apexiron.png" alt="Apex Iron Logo" class="logo-navbar">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarApexIron">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-center" id="navbarApexIron">
                <ul class="navbar-nav mb-2 mb-lg-0 gap-4">
                    <li class="nav-item"><a class="nav-link active" href="#">Inicio</a></li>
                    <li class="nav-item"><a class="nav-link" href="nosotros/index.html">Acerca de Nosotros</a></li>
                    <li class="nav-item"><a class="nav-link" href="catalogo/index.html">Catálogo</a></li>
                    <li class="nav-item"><a class="nav-link" href="contacto/index.html">Contacto</a></li>
                </ul>
            </div>

            <div class="d-flex align-items-center gap-3 visual-icons">
                <a href="#" class="icon-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBuscador">
                    <img src="res/iconos/lupa.svg" alt="Buscar" width="24" height="24">
                </a>
                <a href="#" class="icon-btn position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrito">
                    <img src="res/iconos/carrito.svg" alt="Carrito" width="24" height="24">
                    <span id="cart-count" class="cart-badge">0</span>
                </a>
                <div class="dropdown">
                    <a href="#" class="icon-btn dropdown-toggle no-arrow" id="dropdownPerfil" data-bs-toggle="dropdown">
                        <img src="res/iconos/usuario.svg" alt="Usuario" width="24" height="24">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" id="menuUsuario" aria-labelledby="dropdownPerfil">
                    <!-- Vista Administrador siempre visible -->
                    <li>
                        <a class="dropdown-item" href="/admin/index.html" id="nav-admin">
                          <img src="res/iconos/usuario.svg" width="16"> Vista Administrador
                        </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
    
                   <!-- Opciones cuando NO hay sesión iniciada -->
                  <li id="opcion-login">
                    <a class="dropdown-item" href="/login/index.html">Iniciar Sesión</a>
                  </li>
                    <li id="opcion-registro">
                    <a class="dropdown-item" href="/registro/index.html">Crear Cuenta</a>
                  </li>

                  <!-- Opciones cuando SÍ hay sesión iniciada -->
                  <li id="opcion-perfil" class="d-none">
                    <a class="dropdown-item" href="/perfil/index.html">Mi Perfil</a>
                  </li>
                  <li id="opcion-logout" class="d-none">
                  <a class="dropdown-item text-danger" href="#" id="btn-cerrar-sesion">Cerrar Sesión</a>
                  </li>
              </ul>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <!-- BUSCADOR - VA FUERA DEL NAV -->
    <div class="offcanvas offcanvas-top offcanvas-apex" tabindex="-1" id="offcanvasBuscador" style="background-color: #1a1a1a; color: white;">
        <div class="offcanvas-body">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="text-white mb-0">¿Qué estás buscando?</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" id="searchInput" class="form-control" placeholder="Ej: cpu, laptop, teclado, nvidia...">
                    <button class="btn btn-light" id="btnBuscar">Buscar</button>
                </div>
                <div id="searchResults" class="mt-3 small"></div>
            </div>
        </div>
    </div>

    <!-- CARRITO - VA FUERA DEL NAV -->
    <div class="offcanvas offcanvas-end offcanvas-apex" tabindex="-1" id="offcanvasCarrito" style="background-color: #1a1a1a; color: white;">
        <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title"><i class="bi bi-cart3 me-2"></i>Tu Carrito</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column">
            <div id="cart-items" class="flex-grow-1">
                <p class="text-center text-secondary mt-5" id="cart-empty">Tu carrito está vacío</p>
            </div>
            <div class="border-top pt-3 mt-3">
                <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
                    <span>Total:</span><span id="cart-total">$0.00</span>
                </div>
                <button class="btn btn-light w-100 fw-bold py-2" id="btn-pagar">Pagar ahora</button>
                <button class="btn btn-outline-secondary w-100 mt-2" id="btn-vaciar">Vaciar carrito</button>
            </div>
        </div>
    </div>
</header>
`;

// Insertar el HTML inmediatamente al cargar el archivo script
const contenedorNavbar = document.getElementById("contenedor-navbar");
if (contenedorNavbar) {
    contenedorNavbar.innerHTML = navbarHTML;
} else {
    console.error("No se encontró el contenedor-navbar");
}

// Inyectar la hoja de estilos vinculada
const linkCSS = document.createElement("link");
linkCSS.rel = "stylesheet";
linkCSS.href = "Componentes/navbar.css";
document.head.appendChild(linkCSS);


// 2. BUSCADOR INTELIGENTE APEX-IRON

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
      : `/index.html?q=${encodeURIComponent(q)}#categorias`;
    
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
            <a class="dropdown-item text-white d-flex align-items-center gap-2" href="/admin.html" style="font-size:14px;">
                <i class="bi bi-person-gear"></i> Vista Administrador
            </a>
        </li>
        <li><hr class="dropdown-divider" style="border-color:#333;"></li>
    `;

    if (!user) {
        // NO LOGUEADO: Muestra Admin + Iniciar Sesión + Crear Cuenta
        menu.innerHTML = `
            ${adminItem}
            <li><a class="dropdown-item text-white" href="/login/index.html" style="font-size:14px;">Iniciar Sesión</a></li>
            <li><a class="dropdown-item text-white" href="/registro/index.html" style="font-size:14px;">Crear Cuenta</a></li>
        `;
    } else {
        // LOGUEADO: Muestra Admin + Mi Perfil + Cerrar Sesión
        menu.innerHTML = `
            ${adminItem}
            <li><a class="dropdown-item text-white" href="/perfil.html" style="font-size:14px;">Mi Perfil</a></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logout()" style="font-size:14px;">Cerrar Sesión</a></li>
        `;
    }
}

window.logout = function() {
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_cart');
    window.location.href = '/index.html';
};

// Ejecutar al cargar el navbar
renderizarMenuUsuario();
