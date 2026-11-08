# Apex-Iron

> Lleva tu rendimiento al siguiente nivel. Encuentra el hardware que necesitas y arma tu equipo ideal con nuestro acompañamiento, aunque sea tu primera vez.
Proyecto desarrollado por el equipo **BinaryMinds** para el bootcamp **Java Full Stack de Generation México (CH73)**.

🔗 **Sitio en línea:** [jesusperalta0.github.io/Apex-Iron](https://jesusperalta0.github.io/Apex-Iron/)

> El sitio publicado se actualiza conforme se integran los avances a la rama `master`.
---

## Tabla de contenidos

- [Descripción](#descripción)
- [Motivación](#motivación)
- [Funcionalidades](#funcionalidades)
- [Estado del proyecto](#estado-del-proyecto)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura y convenciones](#arquitectura-y-convenciones)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Equipo](#equipo)

---

## Descripción

**Apex-Iron** es un e-commerce de hardware: procesadores, tarjetas de video, memorias RAM, almacenamiento, laptops, equipos armados, periféricos y accesorios.

Además de vender, Apex-Iron busca **guiar** a quien compra, sobre todo si es su primera vez armando una computadora. Por eso incluye recursos de apoyo, como una infografía con los pasos básicos para armar una PC y a **Aironcito**, nuestro asistente virtual.

## Motivación

Elegimos este giro porque nos apasiona la tecnología. Sabemos que cuando alguien va a comprar componentes y es novato en el armado de computadoras, necesita acompañamiento: entender qué pieza es compatible con otra y qué le conviene según lo que quiere hacer. Apex-Iron nace de esa necesidad.

**Nuestra misión:** conectar a las personas con los componentes de computación idóneos para sus proyectos mediante una experiencia digital intuitiva y confiable, asegurando que la compra de tecnología sea un proceso sencillo, informado y al alcance de todos.

## Funcionalidades

| Página | Qué incluye |
|---|---|
| **Inicio** (`/`) | Hero con carrusel de equipos, guía "¿Cómo armar mi equipo?" en ventana modal, categorías, carrusel de marcas, sección "¿Por qué elegirnos?" y presentación de Aironcito |
| **Catálogo** (`/catalogo/`) | Hero promocional ("¡Solo este Buen Fin!") con imágenes adaptadas a móvil, tablet y escritorio; productos con descripción técnica y precio; y **filtrado por categoría** (Componentes, Laptops y Equipos Armados, Periféricos y Accesorios) |
| **Acerca de nosotros** (`/nosotros/`) | Quiénes somos, misión y perfiles del equipo |
| **Contacto** (`/contacto/`) | Formulario de contacto (nombre, correo, teléfono y mensaje) |

Todas las páginas comparten la misma barra de navegación y el mismo footer, y son **responsivas** gracias a Bootstrap.

## Estado del proyecto

🚧 Proyecto en desarrollo por sprints.

**En desarrollo:**

- Funcionalidad de los botones **Comprar** y **Más información** en las tarjetas del catálogo.
- Página de detalle de producto.
- Estilos de botones reutilizables en los estilos generales: **principal** (azul) y **secundario** (gris), para usarlos en cualquier página.

## Tecnologías

| Tecnología | Uso en el proyecto |
|---|---|
| HTML5 | Estructura de las páginas |
| CSS3 | Estilos propios y variables de diseño |
| JavaScript | Interactividad (modal del hero, catálogo y filtrado, formulario) |
| [Bootstrap 5.3](https://getbootstrap.com/) | Diseño responsivo, navbar, carruseles y modales |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | Íconos de la sección "¿Por qué elegirnos?" |
| [Font Awesome 6](https://fontawesome.com/) | Íconos de redes sociales en el footer |
| [SweetAlert2](https://sweetalert2.github.io/) | Alertas visuales |
| Google Fonts | Tipografías Poppins y Lexend Deca |

## Requisitos

Antes de empezar, necesitas tener instalado:

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- Extensión **Live Server** para VS Code (autor: Ritwick Dey)
- Un navegador web actualizado (Chrome, Edge o Firefox)
- Conexión a internet (Bootstrap, los íconos y las fuentes se cargan desde CDN)

## Instalación y ejecución

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/JesusPeralta0/Apex-Iron.git
   ```
2. **Entra a la carpeta del proyecto:**
   ```bash
   cd Apex-Iron
   ```
3. **Abre la carpeta en VS Code:**
   ```bash
   code .
   ```
4. **Instala Live Server** (solo la primera vez): en VS Code ve a *Extensiones* (`Ctrl+Shift+X`), busca **Live Server** e instálala.
5. **Ejecuta el proyecto:** clic derecho sobre `index.html` (el de la raíz) → **Open with Live Server**.
6. El sitio se abrirá en tu navegador en:
   ```
   http://127.0.0.1:5500/
   ```

> ⚠️ **Importante:** no abras `index.html` con doble clic. Las rutas del proyecto empiezan con `/` (por ejemplo `/css/navbar.css`), lo que significa "desde la raíz del servidor". Sin un servidor como Live Server, la página carga sin estilos ni imágenes.

## Estructura del proyecto

```
Apex-Iron/
├── index.html              → Página de Inicio
├── README.md
├── .gitignore              → Archivos que Git no debe subir
├── .github/workflows/
│   └── deploy.yml          → Publicación automática del sitio
├── css/                    → Estilos compartidos por todas las páginas
│   ├── variables.css       → Colores y valores de diseño reutilizables
│   ├── generales.css       → Estilos base del sitio
│   ├── navbar.css
│   ├── footer.css
│   └── inicio/             → Estilos de cada sección del Inicio
│       ├── hero.css
│       ├── categorias.css
│       ├── patrocinadores.css
│       ├── elegirnos.css
│       ├── aironcito.css
│       └── styles.css
├── index_js/
│   └── hero.js             → JavaScript del Inicio
├── catalogo/
│   ├── index.html
│   ├── css/
│   ├── js/                 → catalogo.js, categorias.js
│   └── utils/
│       └── productos.js    → Datos de los productos
├── contacto/
│   ├── index.html
│   ├── css/
│   └── js/
├── nosotros/
│   ├── index.html
│   ├── css/
│   └── js/
└── res/                    → Recursos gráficos
    ├── fondos/
    ├── iconos/
    ├── infografias/
    ├── logos/
    ├── miscelaneo/
    ├── patrocinadores/     → Logos de marcas
    ├── productos/          → Fotos del catálogo
    └── retratos/           → Fotos del equipo
```

## Arquitectura y convenciones

El proyecto está organizado **por página**, para que cada integrante pueda trabajar en sus archivos sin pisar el trabajo de los demás:

- **Una carpeta por página.** Cada sección del sitio (`catalogo/`, `contacto/`, `nosotros/`) tiene su propio `index.html`, su carpeta `css/` y su carpeta `js/`. La página de Inicio vive en la raíz.
- **Lo compartido va en la raíz.** La navbar, el footer, las variables de diseño y los estilos generales están en `css/` y se reutilizan en todas las páginas.
- **Recursos centralizados.** Todas las imágenes están en `res/`, separadas por tipo.
- **Datos separados de la vista.** La información de los productos está en `catalogo/utils/productos.js`, separada del código que los muestra.
- **Estilos por sección.** En el Inicio, cada sección tiene su propio archivo CSS dentro de `css/inicio/`.

## Flujo de trabajo con Git

- `master`: versión estable del proyecto.
- `develop`: rama de integración, donde se juntan los cambios del equipo.
- `feat-<nombre>`: una rama por tarea o integrante, creada a partir de `develop`.

**Proceso:**

1. Actualizar `develop`: `git checkout develop` y `git pull origin develop`
2. Crear rama de trabajo: `git checkout -b feat-<nombre>`
3. Hacer commits descriptivos (por ejemplo: `docs: agrega README`, `feat: agrega filtro de categorías`)
4. Subir la rama: `git push -u origin feat-<nombre>`
5. Abrir un **Pull Request** hacia `develop` para revisión del equipo

## Equipo

**BinaryMinds**

| Integrante |
|---|
| Alann |
| Carla |
| Carlos |
| César |
| Jesús |
| Laura |
| Raúl |
| Rodrigo |
| Yessica |

---

Proyecto académico — Generation México, Bootcamp Java Full Stack (CH73).