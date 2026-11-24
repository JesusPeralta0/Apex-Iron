// document.querySelector('.needs-validation').addEventListener('submit', function (event) {
//     if (!this.checkValidity()) {
//         event.preventDefault();
//         event.stopPropagation();
//     }

//     this.classList.add('was-validated');
// });


document.getElementById('formRegistro')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let ok = true;
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
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

    // Validar teléfono
    const telefonoRegex = /^\d{10}$/;
    if (!telefonoRegex.test(telefono)) {
        document.getElementById('e-telefono').classList.remove('d-none');
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
    usuarios.push({ nombre, apellido, telefono, email, pass, rol: 'cliente' });
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
            window.location.href = '../login/';
        });
    } else {
        window.location.href = '../login/';
    }
});


//validacion forms
const formRegistro = document.getElementById("formRegistro");
const camposRegistro = Array.from(formRegistro.querySelectorAll("input"));
const passEl = document.getElementById("pass");
const pass2El = document.getElementById("pass2");
const telEl = document.getElementById("telefono");

function mostrarErrorCampo(input, mensaje) {
    const errorEl = document.getElementById(`e-${input.id}`);
    const tieneError = Boolean(mensaje);

    input.classList.toggle("is-invalid", tieneError);
    if (errorEl) {
        if (mensaje) errorEl.textContent = mensaje;
        errorEl.classList.toggle("d-none", !tieneError);
    }
}

function validarCampoRegistro(input) {
    const valor = input.value.trim();
    let mensaje = "";

    switch (input.id) {
        case "nombre":
        case "apellido":
            if (!valor) mensaje = "Requerido";
            break;

        case "email":
            if (!valor) {
                mensaje = "Ingresa tu correo electrónico";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mensaje = "Ingresa un correo electrónico válido";
            }
            break;

        case "telefono": {
            const soloDigitos = input.value.replace(/\D/g, "");
            if (!/^\d{10}$/.test(soloDigitos)) {
                mensaje = "Ingresa un número de teléfono válido de 10 dígitos";
            }
            break;
        }

        case "pass": {
            const cumpleLongitudYTipo = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(input.value);
            if (!input.value) {
                mensaje = "Ingresa una contraseña";
            } else if (!cumpleLongitudYTipo) {
                mensaje = "Mínimo 8 caracteres, con letra y número";
            }
            break;
        }

        case "pass2":
            if (!input.value) {
                mensaje = "Confirma tu contraseña";
            } else if (input.value !== passEl.value) {
                mensaje = "No coincide";
            }
            break;
    }

    mostrarErrorCampo(input, mensaje);
    return !mensaje;
}

camposRegistro.forEach((input) => {
    input.addEventListener("blur", () => {
        input.dataset.touched = "true";
        validarCampoRegistro(input);

        // Si cambia "pass" y el usuario ya tocó "pass2", revalida coincidencia
        if (input.id === "pass" && pass2El.dataset.touched === "true") {
            validarCampoRegistro(pass2El);
        }
    });

    input.addEventListener("input", () => {
        if (input.dataset.touched === "true") {
            validarCampoRegistro(input);

            if (input.id === "pass" && pass2El.dataset.touched === "true") {
                validarCampoRegistro(pass2El);
            }
        }
    });
});

formRegistro.addEventListener("submit", (e) => {
    let todoValido = true;

    camposRegistro.forEach((input) => {
        input.dataset.touched = "true";
        const ok = validarCampoRegistro(input);
        if (!ok) todoValido = false;
    });

    if (!todoValido) {
        e.preventDefault();
        const primerInvalido = formRegistro.querySelector(".is-invalid");
        if (primerInvalido) primerInvalido.focus();
    }
});