import { productos, addProduct } from "./productos";


//funcion generadora de ids
//usan la nomenclatura que usa el manual del drive (com, acc y per)

function generarIdProducto(categoria){
    //mapa de categorias que tenemos
    const mapaPrefijos = {
        'componentes': 'com',
        'accesorios': 'acc',
        'perifericos': 'per'
    };

    //se asigna el prefijo
    const prefijo = mapaPrefijos[categoria];

    //variable para asignar numero de objeto en lista incremental
    const numero = String((productos.length +1).padStart(3, '0'));
    return `${prefijo}-${numero}`;
}


//funcion de validación del contenido del payload
export function validarProductoJSON(datos = {}){
    const precio = Number(datos.precio);
    const calificacion = datos.calificacion !== undefined ? datos.calificacion : "Nuevo";

    // normalizo las imagenes para que acepte un array de imagenes o un string imagen
    let listaImagenes = [];
    if (Array.isArray(datos.imagenes)) {
        listaImagenes = datos.imagenes;
    } else if (typeof datos.imagen === 'string' && datos.imagen.trim()) {
        listaImagenes = [datos.imagen.trim()];
}

    //arreglo con cada posible combinacion para gestionar errores
    //igual y lo vamos a borrar mas adelante
    const reglas = [
        
        {error: !datos.nombre?.trim() || datos.nombre.trim().length < 3, msg: 'El nombre debe tener al menos 3 caracteres.'},
        {error: !datos.categoriaPadre?.trim(), msg: 'La categoria principal es obligatoria.'},
        {error: !datos.categoria?.trim(), msg: 'La subcategoria es obligatoria.'},
        {error: !datos.marca?.trim(), msg: 'La marca es obligatoria.'},
        {error: !datos.modelo?.trim(), msg: 'El modelo es obligatorio.'},
        {error: !datos.descripcion?.trim || datos.descripcion.trim().length < 10, msg: 'La descripcion debe contener al menos 10 caracteres.'},
        {error: isNaN(precio) || precio <= 0, msg: 'El precio debe ser un numero mayor a 0.'},
        {error: listaImagenes.length === 0 || !listaImagenes[0]?.trim(), msg: 'Se requiere al menos una imagen valida.'}
    ];

    //return de la lista de mensajes de error en caso de que haya
    return reglas.filter(r => r.error).map(r => r.msg);
};


//controlador principal, o sea la que recibe los datos del formulario, los valida y registra el prodcuto
//esta funcion es la que dejo expuesta para que se consuma desde la vista

export function crearProductoController(payload){
    
    //se valida el payload
    const errores = validarProductoJSON(payload);

    if (errores.length > 0){

        return{
            exito: false,
            producto: null,
            errores: errores
        };
    }

    //se asegura la estructura del arreglo de imagenes

    let imagenesFinales = [];
    if (Array.isArray(payload.imagenes)) {
        imagenesFinales = payload.imagenes;
    } else if (typeof payload.imagen === 'string' && payload.imagen.trim()) {
        imagenesFinales = [payload.imagen.trim()];
    };


    //ahora si, se construye el objeto alineado a los atributos de productos

    const nuevoProducto = {
        id: payload.id?.trim() ? payload.id.trim() : generarIdProducto(payload.categoria.trim()),
        nombre: payload.nombre.trim(),
        categoriaPadre: payload.categoriaPadre.trim(),
        titulo: payload.titulo?.trim() || payload.nombre.trim(),
        descripcion: payload.descripcion?.trim(),
        imagenes: imagenesFinales,
        marca: payload.marca.trim(),
        modelo: payload.modelo.trim(),
        precio: Number(payload.precio),
        calificacion: payload.calificacion || "Nuevo"
    };




    //insertar el producto

    addProduct(nuevoProducto);

    //return de respuesta
    return {
        exito: true,
        producto: nuevoProducto,
        errores: []
    };
};
