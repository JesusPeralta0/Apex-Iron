// Este script se encarga de manejar la visualización del menú de usuario en la barra de navegación:
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menuUsuario');
    // Si estamos en login.html o registro.html, no hay menu, no hacemos nada
    if (!menu) return;

    const user = JSON.parse(localStorage.getItem('apex_user') || 'null');

    if (!user) {
        // NO LOGUEADO --
        menu.innerHTML = `
            <li><a class="dropdown-item text-white" href="/login.html" style="font-size:14px;">Iniciar Sesión</a></li>
            <li><a class="dropdown-item text-white" href="/registro.html" style="font-size:14px;">Crear Cuenta</a></li>
        `;
    } else {
        // LOGUEADO
        const adminLink = user.rol === 'admin' ? `
            <li>
                <a class="dropdown-item text-white d-flex align-items-center gap-2" href="/admin.html" style="font-size:14px;">
                    <i class="bi bi-person-gear"></i> Vista Administrador
                </a>
            </li>
            <li><hr class="dropdown-divider" style="border-color:#333;"></li>
        ` : '';

        menu.innerHTML = `
            ${adminLink}
            <li><a class="dropdown-item text-white" href="/perfil.html" style="font-size:14px;">Mi Perfil</a></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logout()" style="font-size:14px;">Cerrar Sesión</a></li>
        `;
    }
});

function logout(){
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_cart');
    window.location.href = '/index.html';
}