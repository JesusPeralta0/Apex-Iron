const categorias = document.querySelectorAll(".categoria");

function filtrarProductos(categoriaSeleccionada) {

    const productos = document.querySelectorAll(".producto-card");

    productos.forEach(producto => {

        if (producto.dataset.categoria === categoriaSeleccionada) {

            producto.classList.remove("d-none");

        } else {

            producto.classList.add("d-none");

        }

    });
}


categorias.forEach(categoria => {

    categoria.addEventListener("click", () => {

        const categoriaSeleccionada =
            categoria.dataset.categoria;

        filtrarProductos(categoriaSeleccionada);

    });

});


// Mostrar al inicio solamente la categoría activa
const categoriaInicial =
    document.querySelector(".categoria.activa");

if (categoriaInicial) {

    filtrarProductos(
        categoriaInicial.dataset.categoria
    );

}