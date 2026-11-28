import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    crearProductoController,
    actualizarProductoController,
    eliminarProductoController,
    obtenerProductosController,
    normalizarCategoria
} from './productoController.js';

describe('pruebas de test runner para productoController', () => {

    it('debe crear el producto porque se le pasan datos validos', () => {
        const payloadValido = {
            nombre: 'Procesador Intel i7',
            categoria: 'componentes',
            marca: 'Intel',
            modelo: '13700K',
            descripcion: 'Procesador de 16 núcleos y 24 hilos',
            precio: 7500,
            imagenes: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==']
        };

        const resultado = crearProductoController(payloadValido);

        assert.equal(resultado.exito, true);
        assert.equal(resultado.errores.length, 0);
        assert.equal(resultado.producto.nombre, 'Procesador Intel i7');
        assert.equal(resultado.producto.categoriaPadre, 'componentes-alto-rendimiento');
        assert.equal(resultado.producto.precio, 7500);
    });

    it('va a rechazar porque el json tiene parametros invalidos', () => {
        const payloadInvalido = {
            nombre: 'XY',
            precio: 0
        };

        const resultado = crearProductoController(payloadInvalido);

        assert.equal(resultado.exito, false);
        assert.equal(resultado.producto, null);
        assert.ok(resultado.errores.length > 0);
    });

    it('normalizo categorias del catalogo para que coincidan con el select del formulario', () => {
        assert.equal(normalizarCategoria('componentes'), 'Componentes');
        assert.equal(normalizarCategoria('accesorios-laptop'), 'Accesorios para laptop');
        assert.equal(normalizarCategoria('perifericos'), 'Perifericos');
        assert.equal(normalizarCategoria('Audio y video'), 'Audio y video');
    });

    it('actualizo un producto existente con datos validos', () => {
        const primero = obtenerProductosController()[0];
        const resultado = actualizarProductoController(primero.id, {
            nombre: 'Procesador AMD Ryzen 5 7600 Editado',
            categoria: 'Componentes',
            marca: 'AMD',
            modelo: 'Ryzen 5 7600',
            descripcion: 'Descripcion actualizada con mas de diez caracteres',
            precio: 4299,
            imagenes: primero.imagenes
        });

        assert.equal(resultado.exito, true);
        assert.equal(resultado.producto.id, primero.id);
        assert.equal(resultado.producto.nombre, 'Procesador AMD Ryzen 5 7600 Editado');
        assert.equal(resultado.producto.precio, 4299);
    });

    it('elimino un producto existente y dejo de encontrarlo en la lista actual', () => {
        const creado = crearProductoController({
            nombre: 'Mouse de prueba para eliminar',
            categoria: 'Perifericos',
            marca: 'Logitech',
            modelo: 'Test-01',
            descripcion: 'Producto temporal creado para validar la eliminacion',
            precio: 599,
            imagenes: ['/res/productos/teclado.jpg']
        });

        const resultado = eliminarProductoController(creado.producto.id);

        assert.equal(resultado.exito, true);
        assert.equal(resultado.producto.id, creado.producto.id);
        assert.equal(
            obtenerProductosController().some(item => item.id === creado.producto.id),
            false
        );
    });

});
