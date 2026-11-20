import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { crearProductoController } from './productoController.js';

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

});