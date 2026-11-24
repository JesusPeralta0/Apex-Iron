import {
    crearProductoController,
    actualizarProductoController,
    eliminarProductoController,
    obtenerProductosController,
    normalizarCategoria
} from "./productoController.js";

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formCrearProducto');
    const subtituloFormulario = document.querySelector('#subtituloFormulario');
    const tabCrear = document.querySelector('#tabCrear');
    const tabModificar = document.querySelector('#tabModificar');
    const seccionBuscador = document.querySelector('#seccionBuscador');
    const buscadorProducto = document.querySelector('#buscadorProducto');
    const btnLimpiarBusqueda = document.querySelector('#btnLimpiarBusqueda');
    const resultadosBuscador = document.querySelector('#resultadosBuscador');
    const avisoSeleccionar = document.querySelector('#avisoSeleccionar');
    const productoSeleccionadoInfo = document.querySelector('#productoSeleccionadoInfo');
    const productoSeleccionadoId = document.querySelector('#productoSeleccionadoId');
    const productoSeleccionadoNombre = document.querySelector('#productoSeleccionadoNombre');
    const btnDeseleccionar = document.querySelector('#btnDeseleccionar');
    const camposProducto = document.querySelector('#camposProducto');
    const inputNombre = document.querySelector('#nombre');
    const selectCategoria = document.querySelector('#categoria');
    const inputMarca = document.querySelector('#marca');
    const inputModelo = document.querySelector('#modelo');
    const inputDescripcion = document.querySelector('#descripcion');
    const inputPrecio = document.querySelector('#precio');
    const labelImagenes = document.querySelector('#labelImagenes');
    const inputImagenes = document.querySelector('#formFileMultiple');
    const contenedorImagenesActuales = document.querySelector('#contenedorImagenesActuales');
    const listaImagenesActuales = document.querySelector('#listaImagenesActuales');
    const btnGuardarProducto = document.querySelector('#btnGuardarProducto');
    const btnEliminarProducto = document.querySelector('#btnEliminarProducto');
    const modalConfirmarEliminar = document.querySelector('#modalConfirmarEliminar');
    const modalEliminarNombre = document.querySelector('#modalEliminarNombre');
    const modalEliminarId = document.querySelector('#modalEliminarId');
    const btnConfirmarEliminar = document.querySelector('#btnConfirmarEliminar');

    if (!formulario) return;

    // restrinjo el selector de archivos para aceptar solo imagenes
    if (inputImagenes) {
        inputImagenes.setAttribute('accept', 'image/*');
    }

    // creo el contenedor de notificaciones flotantes
    const contenedorNotificaciones = document.createElement('div');
    contenedorNotificaciones.className = 'apex-toast-container';
    document.body.appendChild(contenedorNotificaciones);

    let temporizadorAlerta;
    let modoActual = 'crear';
    let idProductoSeleccionado = null;
    let imagenesActuales = [];
    let resultadosFiltrados = [];
    let indiceResultadoActivo = -1;

    // escapo caracteres especiales antes de pintar texto dentro de plantillas html
    function escaparHTML(texto) {
        const contenedor = document.createElement('div');
        contenedor.textContent = texto ?? '';
        return contenedor.innerHTML;
    }

    // normalizo texto sin acentos ni mayusculas para que la busqueda sea mas flexible
    function normalizarTexto(texto) {
        return String(texto ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // muestro notificaciones de exito o error con los estilos del panel
    function mostrarNotificacion({ tipo, titulo, contenidoHTML, autoCerrar = true }) {
        clearTimeout(temporizadorAlerta);

        const claseTipo = tipo === 'exito' ? 'apex-alert-success' : 'apex-alert-error';
        const icono = tipo === 'exito'
            ? '<i class="fa-solid fa-circle-check apex-alert-icon-success me-2" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-triangle-exclamation text-danger me-2" aria-hidden="true"></i>';
        const claseBootstrap = tipo === 'exito' ? 'alert-success' : 'alert-danger';

        contenedorNotificaciones.innerHTML = `
            <div class="alert ${claseBootstrap} apex-alert ${claseTipo}" role="alert">
                <div class="apex-alert-header">
                    <span>${icono}${titulo}</span>
                    <button type="button" class="btn-close apex-alert-close" aria-label="Cerrar"></button>
                </div>
                <div class="apex-alert-body">
                    ${contenidoHTML}
                </div>
            </div>
        `;

        const btnCerrar = contenedorNotificaciones.querySelector('.apex-alert-close');
        btnCerrar.addEventListener('click', () => {
            clearTimeout(temporizadorAlerta);
            contenedorNotificaciones.innerHTML = '';
        });

        if (autoCerrar) {
            temporizadorAlerta = setTimeout(() => {
                contenedorNotificaciones.innerHTML = '';
            }, 5000);
        }
    }

    // convierto los archivos elegidos a base64 para guardarlos en localstorage sin backend
    function convertirArchivosABase64(fileList) {
        const archivos = Array.from(fileList);

        const promesas = archivos.map(archivo => {
            return new Promise((resolve, reject) => {
                const lector = new FileReader();
                lector.onload = () => resolve(lector.result);
                lector.onerror = (error) => reject(error);
                lector.readAsDataURL(archivo);
            });
        });

        return Promise.all(promesas);
    }

    // pinto las miniaturas de las imagenes que ya tiene el producto seleccionado
    function renderizarImagenesActuales() {
        if (!contenedorImagenesActuales || !listaImagenesActuales) return;

        if (modoActual !== 'modificar' || !idProductoSeleccionado || imagenesActuales.length === 0) {
            contenedorImagenesActuales.classList.add('d-none');
            listaImagenesActuales.innerHTML = '';
            return;
        }

        contenedorImagenesActuales.classList.remove('d-none');
        listaImagenesActuales.innerHTML = imagenesActuales.map((src, indice) => `
            <div class="admin-image-card">
                <img src="${escaparHTML(src)}" alt="Imagen actual ${indice + 1}">
                <button type="button" class="admin-image-remove" data-indice="${indice}"
                    aria-label="Quitar imagen ${indice + 1}" title="Quitar imagen">
                    <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                </button>
            </div>
        `).join('');
    }

    // limpio el estado de seleccion en el modo modificar y bloqueo los campos
    function limpiarSeleccionProducto() {
        idProductoSeleccionado = null;
        imagenesActuales = [];
        formulario.reset();

        if (camposProducto) {
            camposProducto.disabled = modoActual === 'modificar';
        }
        if (productoSeleccionadoInfo) {
            productoSeleccionadoInfo.classList.add('d-none');
        }
        if (avisoSeleccionar) {
            avisoSeleccionar.classList.toggle('d-none', modoActual !== 'modificar');
        }
        if (btnGuardarProducto) {
            btnGuardarProducto.disabled = modoActual === 'modificar';
        }
        if (btnEliminarProducto) {
            btnEliminarProducto.disabled = true;
        }
        renderizarImagenesActuales();
    }

    // cierro la lista desplegable de resultados de busqueda
    function cerrarDropdownBuscador() {
        if (!resultadosBuscador || !buscadorProducto) return;
        resultadosBuscador.classList.add('d-none');
        buscadorProducto.setAttribute('aria-expanded', 'false');
        indiceResultadoActivo = -1;
    }

    // cargo todos los datos del producto elegido dentro de los campos del formulario
    function seleccionarProductoParaEditar(producto) {
        if (!producto) return;

        idProductoSeleccionado = producto.id;
        imagenesActuales = Array.isArray(producto.imagenes) ? [...producto.imagenes] : [];

        if (camposProducto) camposProducto.disabled = false;
        inputNombre.value = producto.nombre ?? '';
        selectCategoria.value = normalizarCategoria(producto.categoria) || '';
        inputMarca.value = producto.marca ?? '';
        inputModelo.value = producto.modelo ?? '';
        inputDescripcion.value = producto.descripcion ?? '';
        inputPrecio.value = producto.precio ?? '';
        if (inputImagenes) inputImagenes.value = '';

        if (productoSeleccionadoId) productoSeleccionadoId.textContent = producto.id;
        if (productoSeleccionadoNombre) productoSeleccionadoNombre.textContent = producto.nombre;
        if (productoSeleccionadoInfo) productoSeleccionadoInfo.classList.remove('d-none');
        if (avisoSeleccionar) avisoSeleccionar.classList.add('d-none');
        if (btnGuardarProducto) btnGuardarProducto.disabled = false;
        if (btnEliminarProducto) btnEliminarProducto.disabled = false;

        if (buscadorProducto) {
            buscadorProducto.value = producto.nombre;
            actualizarBotonLimpiarBusqueda();
        }

        renderizarImagenesActuales();
        cerrarDropdownBuscador();
    }

    // filtro los productos actuales del catalogo segun lo que escribo en la barra
    function buscarProductos(consulta) {
        const lista = obtenerProductosController();
        const textoLimpio = normalizarTexto(consulta).trim();

        if (!textoLimpio) {
            return lista;
        }

        const palabras = textoLimpio.split(/\s+/).filter(Boolean);
        return lista.filter(producto => {
            const categoriaLegible = normalizarCategoria(producto.categoria) || producto.categoria;
            const textoCompleto = normalizarTexto(
                `${producto.id} ${producto.nombre} ${producto.marca} ${producto.modelo} ${producto.categoria} ${categoriaLegible}`
            );
            return palabras.every(palabra => textoCompleto.includes(palabra));
        });
    }

    // muestro los productos encontrados debajo de la barra de busqueda
    function renderizarResultadosBuscador(consulta = '') {
        if (!resultadosBuscador || !buscadorProducto) return;

        resultadosFiltrados = buscarProductos(consulta);
        indiceResultadoActivo = -1;

        if (resultadosFiltrados.length === 0) {
            resultadosBuscador.innerHTML = `
                <div class="admin-search-empty">
                    No encontré productos que coincidan con "<strong>${escaparHTML(consulta.trim())}</strong>".
                </div>
            `;
            resultadosBuscador.classList.remove('d-none');
            buscadorProducto.setAttribute('aria-expanded', 'true');
            return;
        }

        const etiquetaTotal = consulta.trim()
            ? `${resultadosFiltrados.length} resultado${resultadosFiltrados.length === 1 ? '' : 's'}`
            : `Productos disponibles (${resultadosFiltrados.length})`;

        resultadosBuscador.innerHTML = `
            <div class="admin-search-count">${etiquetaTotal}</div>
            ${resultadosFiltrados.map((producto, indice) => {
                const imagenPrincipal = Array.isArray(producto.imagenes) && producto.imagenes[0]
                    ? `<img class="admin-search-thumb" src="${escaparHTML(producto.imagenes[0])}" alt="${escaparHTML(producto.nombre)}">`
                    : `<span class="admin-search-thumb-placeholder"><i class="fa-solid fa-box" aria-hidden="true"></i></span>`;
                const categoriaTexto = normalizarCategoria(producto.categoria) || producto.categoria;
                const precioFormateado = Number(producto.precio || 0).toLocaleString('es-MX');

                return `
                    <button type="button" class="admin-search-item" role="option" data-id="${escaparHTML(producto.id)}" data-indice="${indice}">
                        <span class="admin-search-item-main">
                            ${imagenPrincipal}
                            <span class="admin-search-info">
                                <span class="admin-search-title">${escaparHTML(producto.nombre)}</span>
                                <span class="admin-search-meta">
                                    <span class="apex-id-badge">${escaparHTML(producto.id)}</span>
                                    <span>${escaparHTML(producto.marca)}</span>
                                    <span class="admin-search-tag">${escaparHTML(categoriaTexto)}</span>
                                </span>
                            </span>
                        </span>
                        <span class="admin-search-price">$${precioFormateado}</span>
                    </button>
                `;
            }).join('')}
        `;

        resultadosBuscador.classList.remove('d-none');
        buscadorProducto.setAttribute('aria-expanded', 'true');
    }

    // resalto el resultado activo cuando navego con el teclado
    function actualizarResultadoActivo() {
        if (!resultadosBuscador) return;
        const elementos = resultadosBuscador.querySelectorAll('.admin-search-item');
        elementos.forEach((elemento, indice) => {
            const activo = indice === indiceResultadoActivo;
            elemento.classList.toggle('is-active', activo);
            if (activo) {
                elemento.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // muestro u oculto el boton para limpiar el texto de busqueda
    function actualizarBotonLimpiarBusqueda() {
        if (!btnLimpiarBusqueda || !buscadorProducto) return;
        btnLimpiarBusqueda.classList.toggle('d-none', !buscadorProducto.value.trim());
    }

    // cambio la interfaz entre el modo añadir producto nuevo y el modo modificar existente
    function cambiarModo(nuevoModo) {
        modoActual = nuevoModo;
        const esModificar = modoActual === 'modificar';

        if (tabCrear) {
            tabCrear.classList.toggle('active', !esModificar);
            tabCrear.setAttribute('aria-selected', String(!esModificar));
        }
        if (tabModificar) {
            tabModificar.classList.toggle('active', esModificar);
            tabModificar.setAttribute('aria-selected', String(esModificar));
        }

        if (subtituloFormulario) {
            subtituloFormulario.textContent = esModificar
                ? 'Busca un producto existente para editar sus datos o eliminarlo del catálogo.'
                : 'Añade un producto nuevo al catálogo de Apex-Iron.';
        }

        if (seccionBuscador) {
            seccionBuscador.classList.toggle('d-none', !esModificar);
        }

        if (labelImagenes) {
            labelImagenes.textContent = esModificar
                ? 'Agregar nuevas imágenes (opcional):'
                : 'Ingresar imágenes:';
        }

        if (btnGuardarProducto) {
            btnGuardarProducto.innerHTML = esModificar
                ? '<i class="fa-solid fa-floppy-disk me-2" aria-hidden="true"></i>Guardar cambios'
                : '<i class="fa-solid fa-plus me-2" aria-hidden="true"></i>Añadir producto';
        }

        if (btnEliminarProducto) {
            btnEliminarProducto.classList.toggle('d-none', !esModificar);
        }

        if (buscadorProducto) {
            buscadorProducto.value = '';
            actualizarBotonLimpiarBusqueda();
        }

        cerrarDropdownBuscador();
        limpiarSeleccionProducto();

        if (esModificar && buscadorProducto) {
            buscadorProducto.focus();
        }
    }

    // acorto el placeholder del buscador en celulares para que no se recorte
    function ajustarPlaceholderBuscador() {
        if (!buscadorProducto) return;
        buscadorProducto.placeholder = window.matchMedia('(max-width: 575.98px)').matches
            ? 'Buscar por nombre, marca o ID...'
            : 'Busca por nombre, marca, modelo, categoría o ID...';
    }

    ajustarPlaceholderBuscador();
    window.addEventListener('resize', ajustarPlaceholderBuscador);

    // conecto las pestanas de modo
    tabCrear?.addEventListener('click', () => cambiarModo('crear'));
    tabModificar?.addEventListener('click', () => cambiarModo('modificar'));

    // conecto los eventos de la barra de busqueda
    buscadorProducto?.addEventListener('focus', () => {
        if (modoActual === 'modificar') {
            renderizarResultadosBuscador(buscadorProducto.value);
        }
    });

    buscadorProducto?.addEventListener('input', () => {
        actualizarBotonLimpiarBusqueda();
        renderizarResultadosBuscador(buscadorProducto.value);
    });

    buscadorProducto?.addEventListener('keydown', (event) => {
        if (resultadosBuscador.classList.contains('d-none')) {
            if (event.key === 'ArrowDown') {
                renderizarResultadosBuscador(buscadorProducto.value);
            }
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (resultadosFiltrados.length > 0) {
                indiceResultadoActivo = (indiceResultadoActivo + 1) % resultadosFiltrados.length;
                actualizarResultadoActivo();
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (resultadosFiltrados.length > 0) {
                indiceResultadoActivo = indiceResultadoActivo <= 0
                    ? resultadosFiltrados.length - 1
                    : indiceResultadoActivo - 1;
                actualizarResultadoActivo();
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const indiceElegido = indiceResultadoActivo >= 0 ? indiceResultadoActivo : 0;
            if (resultadosFiltrados[indiceElegido]) {
                seleccionarProductoParaEditar(resultadosFiltrados[indiceElegido]);
            }
        } else if (event.key === 'Escape') {
            cerrarDropdownBuscador();
        }
    });

    resultadosBuscador?.addEventListener('click', (event) => {
        const opcion = event.target.closest('.admin-search-item');
        if (!opcion) return;

        const idElegido = opcion.dataset.id;
        const producto = obtenerProductosController().find(item => item.id === idElegido);
        seleccionarProductoParaEditar(producto);
    });

    btnLimpiarBusqueda?.addEventListener('click', () => {
        buscadorProducto.value = '';
        actualizarBotonLimpiarBusqueda();
        renderizarResultadosBuscador('');
        buscadorProducto.focus();
    });

    btnDeseleccionar?.addEventListener('click', () => {
        limpiarSeleccionProducto();
        if (buscadorProducto) {
            buscadorProducto.value = '';
            actualizarBotonLimpiarBusqueda();
            renderizarResultadosBuscador('');
            buscadorProducto.focus();
        }
    });

    // cierro el buscador cuando hago clic fuera de su contenedor
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.admin-search-wrapper')) {
            cerrarDropdownBuscador();
        }
    });

    // permito quitar imagenes existentes antes de guardar cambios
    listaImagenesActuales?.addEventListener('click', (event) => {
        const botonQuitar = event.target.closest('.admin-image-remove');
        if (!botonQuitar) return;

        const indice = Number(botonQuitar.dataset.indice);
        if (!Number.isNaN(indice)) {
            imagenesActuales.splice(indice, 1);
            renderizarImagenesActuales();
        }
    });

    // abro el modal de confirmacion antes de eliminar el producto seleccionado
    btnEliminarProducto?.addEventListener('click', () => {
        if (!idProductoSeleccionado || !modalConfirmarEliminar) return;

        const producto = obtenerProductosController().find(item => item.id === idProductoSeleccionado);
        if (!producto) return;

        if (modalEliminarNombre) modalEliminarNombre.textContent = producto.nombre;
        if (modalEliminarId) modalEliminarId.textContent = producto.id;

        if (window.bootstrap?.Modal) {
            const instanciaModal = window.bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminar);
            instanciaModal.show();
        }
    });

    // ejecuto la eliminacion cuando confirmo dentro del modal
    btnConfirmarEliminar?.addEventListener('click', () => {
        if (!idProductoSeleccionado) return;

        const respuesta = eliminarProductoController(idProductoSeleccionado);

        if (window.bootstrap?.Modal && modalConfirmarEliminar) {
            const instanciaModal = window.bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminar);
            instanciaModal.hide();
        }

        if (respuesta.exito) {
            mostrarNotificacion({
                tipo: 'exito',
                titulo: 'Producto eliminado',
                contenidoHTML: `<strong>${escaparHTML(respuesta.producto.nombre)}</strong> (<span class="apex-id-badge">${escaparHTML(respuesta.producto.id)}</span>) se eliminó del almacenamiento local.`,
                autoCerrar: true
            });
            if (buscadorProducto) {
                buscadorProducto.value = '';
                actualizarBotonLimpiarBusqueda();
            }
            cerrarDropdownBuscador();
            limpiarSeleccionProducto();
        } else {
            mostrarNotificacion({
                tipo: 'error',
                titulo: 'No se pudo eliminar',
                contenidoHTML: `
                    <ul class="mb-0 ps-3">
                        ${respuesta.errores.map(err => `<li>${escaparHTML(err)}</li>`).join('')}
                    </ul>
                `,
                autoCerrar: false
            });
        }
    });

    // proceso el envio del formulario segun si estoy creando o modificando un producto
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        try {
            const imagenesCodificadas = await convertirArchivosABase64(inputImagenes.files);

            if (modoActual === 'modificar') {
                if (!idProductoSeleccionado) {
                    mostrarNotificacion({
                        tipo: 'error',
                        titulo: 'Ningún producto seleccionado',
                        contenidoHTML: 'Busca y selecciona primero un producto existente para poder modificarlo.',
                        autoCerrar: false
                    });
                    return;
                }

                // conservo las imagenes actuales y agrego las nuevas si subi archivos
                const imagenesFinales = [...imagenesActuales, ...imagenesCodificadas];

                const payloadEdicion = {
                    nombre: inputNombre.value,
                    categoria: selectCategoria.value,
                    marca: inputMarca.value,
                    modelo: inputModelo.value,
                    descripcion: inputDescripcion.value,
                    precio: inputPrecio.value,
                    imagenes: imagenesFinales
                };

                const respuesta = actualizarProductoController(idProductoSeleccionado, payloadEdicion);

                if (respuesta.exito) {
                    imagenesActuales = [...respuesta.producto.imagenes];
                    inputImagenes.value = '';
                    if (productoSeleccionadoNombre) {
                        productoSeleccionadoNombre.textContent = respuesta.producto.nombre;
                    }
                    if (buscadorProducto) {
                        buscadorProducto.value = respuesta.producto.nombre;
                        actualizarBotonLimpiarBusqueda();
                    }
                    renderizarImagenesActuales();

                    mostrarNotificacion({
                        tipo: 'exito',
                        titulo: 'Producto actualizado',
                        contenidoHTML: `<strong>${escaparHTML(respuesta.producto.nombre)}</strong> (<span class="apex-id-badge">${escaparHTML(respuesta.producto.id)}</span>) se actualizó correctamente.`,
                        autoCerrar: true
                    });
                } else {
                    mostrarNotificacion({
                        tipo: 'error',
                        titulo: 'Datos incompletos o inválidos',
                        contenidoHTML: `
                            <ul class="mb-0 ps-3">
                                ${respuesta.errores.map(err => `<li>${escaparHTML(err)}</li>`).join('')}
                            </ul>
                        `,
                        autoCerrar: false
                    });
                }
                return;
            }

            // armo el payload para registrar un producto nuevo
            const payloadNuevo = {
                nombre: inputNombre.value,
                categoria: selectCategoria.value,
                marca: inputMarca.value,
                modelo: inputModelo.value,
                descripcion: inputDescripcion.value,
                precio: inputPrecio.value,
                imagenes: imagenesCodificadas
            };

            const respuesta = crearProductoController(payloadNuevo);

            if (respuesta.exito) {
                mostrarNotificacion({
                    tipo: 'exito',
                    titulo: 'Producto registrado',
                    contenidoHTML: `<strong>${escaparHTML(respuesta.producto.nombre)}</strong> se añadió al catálogo con el ID <span class="apex-id-badge">${escaparHTML(respuesta.producto.id)}</span>`,
                    autoCerrar: true
                });
                formulario.reset();
            } else {
                mostrarNotificacion({
                    tipo: 'error',
                    titulo: 'Datos incompletos o inválidos',
                    contenidoHTML: `
                        <ul class="mb-0 ps-3">
                            ${respuesta.errores.map(err => `<li>${escaparHTML(err)}</li>`).join('')}
                        </ul>
                    `,
                    autoCerrar: false
                });
            }
        } catch (error) {
            console.error('Error en el formulario:', error);
            mostrarNotificacion({
                tipo: 'error',
                titulo: 'Error al procesar imágenes',
                contenidoHTML: 'No se pudieron leer los archivos seleccionados. Intenta nuevamente.',
                autoCerrar: false
            });
        }
    });
});
