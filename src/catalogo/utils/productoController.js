import { productos, addProduct, updateProduct, deleteProduct, getProducts } from "./productos.js";

// normalizo el nombre de la categoria para que coincida con las opciones del formulario y el catalogo
export function normalizarCategoria(categoria = '') {
    const clave = String(categoria)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ');

    const mapaCategorias = {
        'componentes': 'Componentes',
        'almacenamiento': 'Almacenamiento',
        'conectividad': 'Conectividad',
        'accesorios para laptop': 'Accesorios para laptop',
        'accesorios laptop': 'Accesorios para laptop',
        'accesorios': 'Accesorios para laptop',
        'laptops': 'Laptops',
        'pcs': 'PCs',
        'perifericos': 'Perifericos',
        'audio y video': 'Audio y video'
    };

    return mapaCategorias[clave] || '';
}

// genero un id unico segun la categoria evitando duplicados si antes borre productos
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

    const categoriaNormalizada = normalizarCategoria(categoria);
    const prefijo = mapaPrefijos[categoriaNormalizada];
    let consecutivo = productos.length + 1;
    let idGenerado = `${prefijo}-${String(consecutivo).padStart(3, '0')}`;

    while (productos.some(p => p.id === idGenerado)) {
        consecutivo += 1;
        idGenerado = `${prefijo}-${String(consecutivo).padStart(3, '0')}`;
    }

    return idGenerado;
}

// calculo la categoria padre correspondiente para agrupar el producto en el catalogo
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

    const categoriaNormalizada = normalizarCategoria(categoria);
    return mapaCatPadre[categoriaNormalizada] || '';
}

// valido el payload antes de crear o actualizar un producto
export function validarProductoJSON(datos = {}) {
    const precio = Number(datos.precio);

    let listaImagenes = [];
    if (Array.isArray(datos.imagenes)) {
        listaImagenes = datos.imagenes.filter(img => typeof img === 'string' && img.trim());
    } else if (typeof datos.imagen === 'string' && datos.imagen.trim()) {
        listaImagenes = [datos.imagen.trim()];
    }

    const categoriaEntrada = datos.categoria?.trim() || '';
    const categoriaLimpia = normalizarCategoria(categoriaEntrada);
    const catPadreCalculada = generarCategoriaPadre(categoriaLimpia);

    const reglas = [
        { error: !datos.nombre?.trim() || datos.nombre.trim().length < 3, msg: 'El nombre debe tener al menos 3 caracteres.' },
        { error: !categoriaEntrada, msg: 'La categoría es obligatoria.' },
        { error: Boolean(categoriaEntrada) && !catPadreCalculada, msg: 'La categoría seleccionada no es válida.' },
        { error: !datos.marca?.trim(), msg: 'La marca es obligatoria.' },
        { error: !datos.modelo?.trim(), msg: 'El modelo es obligatorio.' },
        { error: !datos.descripcion?.trim() || datos.descripcion.trim().length < 10, msg: 'La descripción debe contener al menos 10 caracteres.' },
        { error: isNaN(precio) || precio <= 0, msg: 'El precio debe ser un número mayor a 0.' },
        { error: listaImagenes.length === 0 || !listaImagenes[0]?.trim(), msg: 'Se requiere al menos una imagen válida.' }
    ];

    // regreso los errores encontrados
    return reglas.filter(r => r.error).map(r => r.msg);
}

// consulto todos los productos actuales y despues aqui conecto la peticion a mysql
export function obtenerProductosController() {
    return getProducts();
}

// creo un producto nuevo a partir del payload del formulario
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
        imagenesFinales = payload.imagenes.filter(img => typeof img === 'string' && img.trim());
    } else if (typeof payload.imagen === 'string' && payload.imagen.trim()) {
        imagenesFinales = [payload.imagen.trim()];
    }

    const categoriaLimpia = normalizarCategoria(payload.categoria);

    // armo el objeto con los atributos esperados por el catalogo
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

// actualizo un producto existente validando sus datos y guardando el cambio en localstorage
export function actualizarProductoController(id, payload) {
    if (!id || !String(id).trim()) {
        return {
            exito: false,
            producto: null,
            errores: ['Debes seleccionar un producto para modificar.']
        };
    }

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
        imagenesFinales = payload.imagenes.filter(img => typeof img === 'string' && img.trim());
    } else if (typeof payload.imagen === 'string' && payload.imagen.trim()) {
        imagenesFinales = [payload.imagen.trim()];
    }

    const categoriaLimpia = normalizarCategoria(payload.categoria);

    const datosActualizados = {
        nombre: payload.nombre.trim(),
        categoriaPadre: generarCategoriaPadre(categoriaLimpia),
        categoria: categoriaLimpia,
        descripcion: payload.descripcion.trim(),
        imagenes: imagenesFinales,
        marca: payload.marca.trim(),
        modelo: payload.modelo.trim(),
        precio: Number(payload.precio)
    };

    const productoActualizado = updateProduct(id, datosActualizados);

    if (!productoActualizado) {
        return {
            exito: false,
            producto: null,
            errores: ['No se encontró el producto seleccionado para actualizar.']
        };
    }

    return {
        exito: true,
        producto: productoActualizado,
        errores: []
    };
}

// elimino un producto del localstorage y mas adelante aqui hare la peticion delete al backend
export function eliminarProductoController(id) {
    if (!id || !String(id).trim()) {
        return {
            exito: false,
            producto: null,
            errores: ['Debes seleccionar un producto para eliminar.']
        };
    }

    const productoEliminado = deleteProduct(id);

    if (!productoEliminado) {
        return {
            exito: false,
            producto: null,
            errores: ['No se encontró el producto que intentas eliminar.']
        };
    }

    return {
        exito: true,
        producto: productoEliminado,
        errores: []
    };
}
