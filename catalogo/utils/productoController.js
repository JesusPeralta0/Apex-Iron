import { productos, addProduct } from "./productos.js";

//categorias que tenemos en total
function generarIdProducto(categoria) {
    const mapaPrefijos = {
        'Componentes': 'com',
        'Accesorios para laptop': 'acc',
        'Perifericos': 'per',
        'Almacenamiento': 'alm',
        'Conectividad': 'con',
        'Audio y video': 'auv',
        'Laptops': 'lpt',
        'PCs': 'pcs'
    };

    const prefijo = mapaPrefijos[categoria];
    const numero = String(productos.length + 1).padStart(3, '0');
    return `${prefijo}-${numero}`;
}

//funcion para generar las categorias padre.
//refactorizada para no usar arreglos/diccionarios porque me daba unos errores al recorrerlos
function generarCategoriaPadre(categoria) {
    const mapaCatPadre = {
        'Componentes': 'componentes-alto-rendimiento',
        'Almacenamiento': 'componentes-alto-rendimiento',
        'Conectividad': 'componentes-alto-rendimiento',
        'Accesorios para laptop': 'laptops-equipos-armados',
        'Perifericos': 'perifericos-accesorios',
        'Audio y video': 'perifericos-accesorios',
        'Laptops': 'laptops-equipos-armados',
        'PCs': 'laptops-equipos-armados'
    };

    return mapaCatPadre[categoria] || '';
}

//valida el payload
export function validarProductoJSON(datos = {}) {
    const precio = Number(datos.precio);

    let listaImagenes = [];
    if (Array.isArray(datos.imagenes)) {
        listaImagenes = datos.imagenes;
    } else if (typeof datos.imagen === 'string' && datos.imagen.trim()) {
        listaImagenes = [datos.imagen.trim()];
    }

    const categoriaLimpia = datos.categoria?.trim() || '';
    const catPadreCalculada = generarCategoriaPadre(categoriaLimpia);

    const reglas = [
        { error: !datos.nombre?.trim() || datos.nombre.trim().length < 3, msg: 'El nombre debe tener al menos 3 caracteres.' },
        { error: !categoriaLimpia, msg: 'La categoría es obligatoria.' },
        { error: Boolean(categoriaLimpia) && !catPadreCalculada, msg: 'La categoría seleccionada no es válida.' },
        { error: !datos.marca?.trim(), msg: 'La marca es obligatoria.' },
        { error: !datos.modelo?.trim(), msg: 'El modelo es obligatorio.' },
        { error: !datos.descripcion?.trim() || datos.descripcion.trim().length < 10, msg: 'La descripción debe contener al menos 10 caracteres.' },
        { error: isNaN(precio) || precio <= 0, msg: 'El precio debe ser un número mayor a 0.' },
        { error: listaImagenes.length === 0 || !listaImagenes[0]?.trim(), msg: 'Se requiere al menos una imagen válida.' }
    ];

    //regresa los errores
    return reglas.filter(r => r.error).map(r => r.msg);
}


//funcion principal para crear producto
//es la funcion descrita en el readmi y recibe el json/payload del form
export function crearProductoController(payload) {
    const errores = validarProductoJSON(payload);

    if (errores.length > 0) {
        return {
            exito: false,
            producto: null,
            errores: errores
        };
    }

    let imagenesFinales = [];
    if (Array.isArray(payload.imagenes)) {
        imagenesFinales = payload.imagenes;
    } else if (typeof payload.imagen === 'string' && payload.imagen.trim()) {
        imagenesFinales = [payload.imagen.trim()];
    }

    const categoriaLimpia = payload.categoria.trim();



    //se defininen los atributos del form para corresponder con los atributos de la plantilla de producto
    //se refactoriza nomas las variables para llamar a la funcion de generar categoria padre
    const nuevoProducto = {
        id: generarIdProducto(categoriaLimpia),
        nombre: payload.nombre.trim(),
        categoriaPadre: generarCategoriaPadre(categoriaLimpia),
        categoria: categoriaLimpia,
        descripcion: payload.descripcion.trim(),
        imagenes: imagenesFinales,
        marca: payload.marca.trim(),
        modelo: payload.modelo.trim(),
        precio: Number(payload.precio),
        calificacion: payload.calificacion || "Nuevo"
    };

    
    addProduct(nuevoProducto);

    return {
        exito: true,
        producto: nuevoProducto,
        errores: []
    };
}