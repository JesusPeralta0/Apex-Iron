document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const estado = document.getElementById("estadoFormulario");
  const btn = document.getElementById("btnEnviar");

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("error-nombre"),
      validar: (v) => {
        if (!v) return "El nombre es obligatorio.";
        if (v.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(v))
          return "El nombre solo puede contener letras y espacios.";
        return "";
      },
    },
    correo: {
      input: document.getElementById("correo"),
      error: document.getElementById("error-correo"),
      validar: (v) => {
        if (!v) return "El correo es obligatorio.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
          return "Ingresa un correo válido (ej. ejemplo@dominio.com).";
        return "";
      },
    },
    telefono: {
      input: document.getElementById("telefono"),
      error: document.getElementById("error-telefono"),
      validar: (v) => {
        if (!v) return "El teléfono es obligatorio.";
        const limpio = v.replace(/[\s\-()]/g, "");
        if (!/^\d+$/.test(limpio)) return "El teléfono solo debe contener números.";
        if (limpio.length !== 10) return "El teléfono debe tener 10 dígitos.";
        return "";
      },
    },
    mensaje: {
      input: document.getElementById("mensaje"),
      error: document.getElementById("error-mensaje"),
      validar: (v) => {
        if (!v) return "El mensaje es obligatorio.";
        if (v.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
        if (v.length > 1000) return "El mensaje no puede exceder 1000 caracteres.";
        return "";
      },
    },
  };

  function validarCampo(campo) {
    const mensaje = campo.validar(campo.input.value.trim());
    campo.error.textContent = mensaje;
    campo.input.classList.toggle("is-invalid", mensaje !== "");
    campo.input.classList.toggle("is-valid", mensaje === "");
    return mensaje === "";
  }

  // Validación en tiempo real al salir del campo / corregir un error
  Object.values(campos).forEach((campo) => {
    campo.input.addEventListener("blur", () => validarCampo(campo));
    campo.input.addEventListener("input", () => {
      if (campo.input.classList.contains("is-invalid")) validarCampo(campo);
    });
  });

  function mostrarEstado(texto, tipo) {
    estado.className = `mt-3 alert alert-${tipo}`;
    estado.textContent = texto;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    estado.className = "mt-3";
    estado.textContent = "";

    // Validar todos los campos (sin cortar en el primero que falle)
    const resultados = Object.values(campos).map(validarCampo);
    if (!resultados.every(Boolean)) {
      mostrarEstado("Revisa los campos marcados en rojo.", "danger");
      return;
    }

    // Todo válido: enviar a Formspree
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const respuesta = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (respuesta.ok) {
        mostrarEstado("¡Gracias! Tu mensaje fue enviado correctamente.", "success");
        form.reset();
        Object.values(campos).forEach((c) =>
          c.input.classList.remove("is-valid", "is-invalid")
        );
      } else {
        const data = await respuesta.json().catch(() => ({}));
        const detalle = data.errors ? data.errors.map((er) => er.message).join(", ") : "";
        mostrarEstado(`No se pudo enviar el mensaje. ${detalle}`, "danger");
      }
    } catch (error) {
      mostrarEstado("Error de conexión. Inténtalo de nuevo más tarde.", "danger");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar";
    }
  });
});