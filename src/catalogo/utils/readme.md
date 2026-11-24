#  Guía de Integración para productoController.js

## Datos de entrada

La función `crearProductoController()` recibe un único objeto JavaScript (`payload`) extraído de el formulario que ya creamos.

### Atributos que acepta:

| Campo | Tipo | Obligatorio | Descripción / Regla |
| :--- | :--- | :---: | :--- |
| `nombre` | `String` | **Sí** | Nombre del producto (mínimo 3 caracteres). |
| `categoriaPadre` | `String` | **Sí** | Categoría principal (` los definimos para mostrar en una lista desplegable creo.`); Con base en estas se generan los id's.            |
| `categoria` | `String` | **Sí** | Subcategoría en minúsculas.  |
| `marca` | `String` | **Sí** | Marca del producto. |
| `modelo` | `String` | **Sí** | Modelo del producto. |
| `descripcion` | `String` | **Sí** | Descripción (`Mínimo 10 caracteres`). |
| `precio` | `Number` o `String` | **Sí** | Precio mayor a 0 (`hay lógica para castearlo automaticamente a Number`). |
| `imagenes` | `Array<String>` | **Sí\*** | Array con las urls de las imágenes. |
| `imagen` | `String` | **Sí\*** |  Url de una imagen individual (por si no se envía un arreglo `imagenes`). |

> **\*  Nota:** El controlador acepta tanto un array en `imagenes` como un string único en `imagen`. Si no se envía ninguno de los dos válidos, regresa error. Tiene que integrar al menos una imagen.

> **Valores autogenerados por el controlador:**
> 
> * ***`id`**: Se genera siempre automáticamente a partir de la `categoria` (por ejemplo `com`) y el numero de 	elemento en el array. No debe integrarse una opción en el formulario para mandarlo.
> 
> * ***`calificacion`**: Por defecto viene asignado el valor `"Nuevo"`.
> 


## Operaciones Internas

Cuando invocas `crearProductoController(payload)`, el controlador corre las siguientes operaciones en orden:

1. **Validación (`validarProductoJSON`):**
   * Limpia espacios en blanco en los strings mediante `.trim()`.
   * Verifica requerimientos mínimos de longitud en nombre (>= 3) y descripción (>=10).
   * Valida que el precio sea un valor numérico válido y estricto mayor a 0.
   * Verifica la existencia de al menos una imagen válida.
   * Cuando detecta fallos, para el proceso inmediatamente sin alterar los datos.

2. **Normalización de estructura:**
   * Asegura que la propiedad `imagenes` sea siempre un arreglo uniforme `[URL1, URL2]`.
   * Asigna valores por defecto (`calificacion: "Nuevo"`).

3. **Generación de id automático:**
   * Ejecuta `generarIdProducto(categoria)` generando el prefijo según la subcategoría:
     * `'componentes'` ➔ `com-00X`
     * `'accesorios'` ➔ `acc-00X`
     * `'perifericos'` ➔ `per-00X`

4. **Persistencia y registro:**
   * Llama a `addProduct(nuevoProducto)` para insertar el objeto resultante en la lista global de productos.


## Datos de Salida

El controlador esta hecho para **siempre retornar un objeto con la misma estructura**, permitiendo conocer el estado del registro del producto mediante el atributo `exito`.

### Respuesta en caso de éxito (`exito: true`)

```json
{
  "exito": true,
  "producto": {
    "id": "com-001",
    "nombre": "Procesador Intel i7",
    "categoriaPadre": "Componentes",
    "descripcion": "Procesador de 16 núcleos de alta velocidad para gaming",
    "imagenes": ["https://ejemplo.com/cpu.jpg"],
    "marca": "Intel",
    "modelo": "13700K",
    "precio": 7500,
    "calificacion": "Nuevo"
  },
  "errores": []
}
```

### Respuesta en caso de error (`exito: false`)

```json
{
  "exito": false,
  "producto": null,
  "errores": [
    "El nombre debe tener al menos 3 caracteres.",
    "La marca es obligatoria.",
    "El precio debe ser un numero mayor a 0."
  ]
}
```