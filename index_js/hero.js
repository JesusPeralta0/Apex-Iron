/*JS para boton secundario seccion hero*/
/*----------------------------------------------*/

// 1. Buscamos los dos elementos del HTML por su id
const botonGuia = document.getElementById('btnGuia');
const ventanaGuia = document.getElementById('modalGuia');

// 2. Le decimos a Bootstrap que esa ventana es un modal
const modalGuia = new bootstrap.Modal(ventanaGuia);

// 3. Cuando den clic en el botón, abrimos el modal
botonGuia.addEventListener('click', function () {
  modalGuia.show();
});