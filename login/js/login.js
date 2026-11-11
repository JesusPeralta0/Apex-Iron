document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value;
    const err = document.getElementById('e-login');
    
    err.classList.add('d-none');

    // Cuenta Admin para pruebas: admin@apexiron.mx / Admin123
    if (email === 'admin@apexiron.mx' && pass === 'Admin123') {
        localStorage.setItem('apex_user', JSON.stringify({
            nombre: 'Admin', 
            apellido: 'Apex', 
            email, 
            rol: 'admin'
        }));
        window.location.href = '/index.html';
        return;
    }

    // Validación contra usuarios registrados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('apex_usuarios') || '[]');
    const u = usuarios.find(x => x.email === email && x.pass === pass);
    
    if (!u) {
        err.textContent = 'Correo o contraseña incorrectos'; 
        err.classList.remove('d-none'); 
        return;
    }

    // Guardar sesión activa y redirigir al inicio
    localStorage.setItem('apex_user', JSON.stringify(u));
    window.location.href = '/index.html';
});
