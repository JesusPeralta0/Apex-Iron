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
        window.location.href = '/';
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
    window.location.href = '/';
});


// validacion froms 
const formLogin = document.getElementById("formLogin");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("pass");
const loginErrorGlobal = document.getElementById("e-login");

function setErrorGeneral(mensaje = "") {
    if (!loginErrorGlobal) return;
    loginErrorGlobal.textContent = mensaje;
    loginErrorGlobal.classList.toggle("d-none", !mensaje);
}

function validarCampoLogin(input) {
    const feedbackEl = document.getElementById(`err-${input.id}`);
    const valor = input.value.trim();
    let mensaje = "";

    if (input.required && valor === "") {
        mensaje = input.id === "email"
            ? "Ingresa tu correo electrónico."
            : "Ingresa tu contraseña.";
    } else if (input.type === "email") {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
        if (!emailValido) {
            mensaje = "El formato del correo no es válido.";
        }
    }

    input.classList.toggle("is-invalid", Boolean(mensaje));
    if (feedbackEl) {
        feedbackEl.textContent = mensaje;
    }

    return !mensaje;
}

[emailInput, passInput].forEach((input) => {
    input.addEventListener("blur", () => {
        input.dataset.touched = "true";
        validarCampoLogin(input);
    });

    input.addEventListener("input", () => {
        setErrorGeneral("");
        if (input.dataset.touched === "true") {
            validarCampoLogin(input);
        }
    });
});

formLogin.addEventListener("submit", (e) => {
    setErrorGeneral("");

    const emailOk = validarCampoLogin(emailInput);
    const passOk = validarCampoLogin(passInput);
    emailInput.dataset.touched = "true";
    passInput.dataset.touched = "true";

    if (!emailOk || !passOk) {
        e.preventDefault();
        const primeroInvalido = formLogin.querySelector(".is-invalid");
        if (primeroInvalido) primeroInvalido.focus();
    }
});