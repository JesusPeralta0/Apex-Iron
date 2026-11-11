document.getElementById('formRegistro')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let ok = true;
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value;
    const pass2 = document.getElementById('pass2').value;

    // Limpiar mensajes de error previos
    document.querySelectorAll('small.text-danger').forEach(s => s.classList.add('d-none'));

    // Validar campos vacíos
    if (!nombre) {
        document.getElementById('e-nombre').classList.remove('d-none');
        ok = false;
    }
    if (!apellido) {
        document.getElementById('e-apellido').classList.remove('d-none');
        ok = false;
    }

    // 2. Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const el = document.getElementById('e-email');
        el.textContent = 'Correo no válido';
        el.classList.remove('d-none');
        ok = false;
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(pass)) {
        document.getElementById('e-pass').classList.remove('d-none');
        ok = false;
    }

    // Validar que ambas contraseñas coincidan
    if (pass !== pass2) {
        document.getElementById('e-pass2').classList.remove('d-none');
        ok = false;
    }

    if (!ok) return;

    // Verificar si el usuario ya existe en localStorage
    const usuarios = JSON.parse(localStorage.getItem('apex_usuarios') || '[]');
    if (usuarios.find(u => u.email === email)) {
        const el = document.getElementById('e-email');
        el.textContent = 'Este correo ya está registrado';
        el.classList.remove('d-none');
        return;
    }

    // Guardar el nuevo usuario como cliente
    usuarios.push({ nombre, apellido, email, pass, rol: 'cliente' });
    localStorage.setItem('apex_usuarios', JSON.stringify(usuarios));

    // Mostrar alerta de éxito (usando SweetAlert2 que ya tienes) y redirigir al Login
    if (window.Swal) {
        Swal.fire({
            icon: 'success',
            title: '¡Cuenta creada!',
            text: 'Tu registro fue exitoso. Ahora puedes iniciar sesión.',
            timer: 1800,
            showConfirmButton: false
        }).then(() => {
            window.location.href = '../login/index.html';
        });
    } else {
        window.location.href = '../login/index.html';
    }
});
