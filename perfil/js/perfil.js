document.addEventListener("DOMContentLoaded", () => {
    // 1. Buscar usuario activo en localStorage (compatible con varias llaves comunes)
    const llavesPosibles = ["usuarioActivo", "sesionActiva", "usuarioLogueado", "currentUser"];
    let llaveEncontrada = llavesPosibles.find(k => localStorage.getItem(k) !== null);
    let usuario = llaveEncontrada ? JSON.parse(localStorage.getItem(llaveEncontrada)) : null;

    // Si no hay sesión iniciada, redirigir al login (comenta estas 4 líneas si quieres probar sin iniciar sesión)
    if (!usuario) {
        window.location.href = "/login/index.html";
        return;
    }

    // 2. Pintar datos del usuario en la tarjeta izquierda
    const nombreCompleto = usuario.nombre || usuario.name || "Usuario Apex";
    const correo = usuario.correo || usuario.email || "Sin correo";
    const telefono = usuario.telefono || usuario.phone || "No registrado";
    const direccion = usuario.direccion || "Sin dirección guardada";

    document.getElementById("perfil-nombre").textContent = nombreCompleto;
    document.getElementById("perfil-correo").textContent = correo;
    document.getElementById("perfil-telefono").textContent = telefono;
    document.getElementById("perfil-direccion").textContent = direccion;

    // Generar iniciales para el avatar
    const iniciales = nombreCompleto
        .split(" ")
        .map(p => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    document.getElementById("perfil-iniciales").textContent = iniciales || "AI";

    // Precargar el modal de edición
    document.getElementById("edit-nombre").value = nombreCompleto;
    document.getElementById("edit-telefono").value = usuario.telefono || "";
    document.getElementById("edit-direccion").value = usuario.direccion || "";

    // 3. Guardar cambios al editar perfil
    document.getElementById("form-editar-perfil").addEventListener("submit", (e) => {
        e.preventDefault();
        usuario.nombre = document.getElementById("edit-nombre").value.trim();
        usuario.telefono = document.getElementById("edit-telefono").value.trim();
        usuario.direccion = document.getElementById("edit-direccion").value.trim();

        // Actualizar en localStorage
        localStorage.setItem(llaveEncontrada || "usuarioActivo", JSON.stringify(usuario));

        // Actualizar también en la lista general de usuarios registrados si existe
        const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
        const idx = usuariosRegistrados.findIndex(u => (u.correo || u.email) === correo);
        if (idx !== -1) {
            usuariosRegistrados[idx] = { ...usuariosRegistrados[idx], ...usuario };
            localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
        }

        location.reload();
    });

    // 4. Cerrar sesión
    document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
        if (llaveEncontrada) {
            localStorage.removeItem(llaveEncontrada);
        }
        window.location.href = "/index.html";
    });

    // 5. Renderizar historial de compras / pedidos del usuario
    renderizarPedidos(correo);
});

function renderizarPedidos(correoUsuario) {
    const contenedor = document.getElementById("contenedor-pedidos");
    const contador = document.getElementById("contador-pedidos");

    const todosLosPedidos = JSON.parse(localStorage.getItem("apex_pedidos")) || [];
    // Filtrar solo los pedidos que pertenecen al usuario actual
    const misPedidos = todosLosPedidos.filter(p => p.usuarioCorreo === correoUsuario);

    contador.textContent = `${misPedidos.length} ${misPedidos.length === 1 ? "pedido" : "pedidos"}`;

    if (misPedidos.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag-x fs-1 texto-secundario d-block mb-3"></i>
                <h5 class="fw-semibold">Aún no tienes compras registradas</h5>
                <p class="texto-secundario small mb-4">Explora nuestro catálogo de componentes y arma tu setup ideal.</p>
                <a href="/catalogo/index.html" class="btn btn-apex-gradiente">Ir al catálogo</a>
            </div>
        `;
        return;
    }

    // Mostrar los pedidos más recientes primero
    contenedor.innerHTML = misPedidos.reverse().map(pedido => {
        const listaProductosHTML = pedido.productos.map(prod => `
            <div class="producto-mini-item d-flex justify-content-between align-items-center small">
                <div>
                    <span class="fw-semibold text-white">${prod.nombre}</span>
                    <span class="texto-secundario ms-2">x${prod.cantidad}</span>
                </div>
                <span class="text-info fw-semibold">$${(prod.precio * prod.cantidad).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
        `).join("");

        return `
            <div class="pedido-card">
                <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div>
                        <span class="fw-bold text-primary">Folio #${pedido.folio}</span>
                        <span class="texto-secundario small ms-2"><i class="bi bi-calendar3 me-1"></i>${pedido.fecha}</span>
                    </div>
                    <span class="badge bg-success bg-opacity-25 text-success border border-success px-3 py-1">
                        ${pedido.estado || "Completado"}
                    </span>
                </div>
                <div class="my-2">
                    ${listaProductosHTML}
                </div>
                <div class="d-flex justify-content-end align-items-center pt-2 border-top border-secondary border-opacity-25">
                    <span class="texto-secundario small me-2">Total pagado:</span>
                    <span class="fs-5 fw-bold text-white">$${Number(pedido.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        `;
    }).join("");
}
