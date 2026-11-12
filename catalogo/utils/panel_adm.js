import { crearProductoController } from "./productoController.js";

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formCrearProducto');
    const selectCategoria = document.querySelector('#categoria');
    const inputImagenes = document.querySelector('#formFileMultiple');

    if (!formulario) return;

        //restringimos el selector de archivos para que solo acepte imagenes.
    if (inputImagenes) {
        inputImagenes.setAttribute('accept', 'image/*');
    }

        //se crea de manera dinamica el contenedor de errores
    const contenedorNotificaciones = document.createElement('div');
    contenedorNotificaciones.className = 'apex-toast-container';
    document.body.appendChild(contenedorNotificaciones);

    let temporizadorAlerta;

    //logica para gestionar las notificaciones con respecto a estilos
    function mostrarNotificacion({ tipo, titulo, contenidoHTML, autoCerrar = true }) {
        clearTimeout(temporizadorAlerta);

        const claseTipo = tipo === 'exito' ? 'apex-alert-success' : 'apex-alert-error';
        const icono = tipo === 'exito'
            ? '<i class="bi bi-check-circle-fill apex-alert-icon-success me-2"></i>'
            : '<i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>';

        contenedorNotificaciones.innerHTML = `
            <div class="apex-alert ${claseTipo}" role="alert">
                <div class="apex-alert-header">
                    <span>${icono}${titulo}</span>
                    <button type="button" class="apex-alert-close" aria-label="Cerrar">&times;</button>
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

    //la unica manera coherente que tenemos para que nos deje subir imagenes sin backend
    //codificamos loos objetos a base64 para guardarlos como string en el array inicial que teniamos (de strings)
    //filelist es lo que retorna el formulario cuando subes archivos
    function convertirArchivosABase64(fileList) {
        const archivos = Array.from(fileList);

        const promesas = archivos.map(archivo => {
            return new Promise((resolve, reject) => {
                const lector = new FileReader();
                lector.onload = () => resolve(lector.result);
                lector.onerror = (error) => reject(error);
                //aqui se convierte el objeto a base64
                //al final todos los objetos son archivos binarios por debajo
                lector.readAsDataURL(archivo);
            });
        });

        return Promise.all(promesas);
    }

    //se crea el evento del formulario
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        //fix temporal para que no afecte la ejecución de otros eventos
        event.stopPropagation();

        try {
            // Convierte los archivos subidos (segun la documentación, se le llaman FileList) a un arreglo de strings base64
            //al parecer no se pueden subir imagenes directamente sin un backend que las gestione por motivos de seguridad, asi que 
            //se opta por condificarlas a base64 y se guardan en localstorage, porque sin backend tampoco se pueden guardar mas objetos en la lista de productos
            const imagenesCodificadas = await convertirArchivosABase64(inputImagenes.files);

            //el json formateado o como lo llamo yo, payload
            //equivalente a "modelo de datos en formato json" del punto 5 de las instrucciones
            const payload = {
                nombre: document.querySelector('#nombre').value,
                categoria: selectCategoria.value,
                marca: document.querySelector('#marca').value,
                modelo: document.querySelector('#modelo').value,
                descripcion: document.querySelector('#descripcion').value,
                precio: document.querySelector('#precio').value,
                //cambio la variable para que se regresen ya como string base64 en lugar de solo strings directos del form
                imagenes: imagenesCodificadas
            };

            const respuesta = crearProductoController(payload);

            if (respuesta.exito) {
                mostrarNotificacion({
                    tipo: 'exito',
                    titulo: 'Producto registrado',
                    contenidoHTML: `<strong>${respuesta.producto.nombre}</strong> se añadió al catálogo con el ID <span class="apex-id-badge">${respuesta.producto.id}</span>`,
                    autoCerrar: true
                });
                formulario.reset();
            } else {
                mostrarNotificacion({
                    tipo: 'error',
                    titulo: 'Datos incompletos o inválidos',
                    contenidoHTML: `
                        <ul class="mb-0 ps-3">
                            ${respuesta.errores.map(err => `<li>${err}</li>`).join('')}
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