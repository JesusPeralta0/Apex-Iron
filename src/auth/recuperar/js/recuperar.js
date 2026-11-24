document.getElementById('formRecuperar')?.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;

    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value;
    const pass2 = document.getElementById('pass2').value;

    // Limpiar mensajes de error previos
    document.querySelectorAll('small.text-danger').forEach(s => {
        s.classList.add('d-none');
    });

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        const el = document.getElementById('e-email');
        el.textContent = 'Correo no válido';
        el.classList.remove('d-none');
        ok = false;
    }

    // Validar contraseña
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

    // Obtener usuarios registrados
    const usuarios = JSON.parse(
        localStorage.getItem('apex_usuarios') || '[]'
    );

    // Buscar usuario por correo
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        const el = document.getElementById('e-email');
        el.textContent = 'No existe una cuenta registrada con este correo';
        el.classList.remove('d-none');
        return;
    }

    // Actualizar contraseña
    usuario.pass = pass;

    localStorage.setItem(
        'apex_usuarios',
        JSON.stringify(usuarios)
    );

    // Mostrar alerta de éxito y regresar al Login
    if (window.Swal) {
        Swal.fire({
            icon: 'success',
            title: '¡Contraseña actualizada!',
            text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
            timer: 1800,
            showConfirmButton: false
        }).then(() => {
            window.location.href = '../login/';
        });
    } else {
        window.location.href = '../login/';
    }
});