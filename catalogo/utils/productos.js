
//ojo, aqui como no podemos añadir fotos ni productos directamente sin el backend, las voy guardar de manera provisional en el localstorage
const STORAGE_KEY = 'apex_iron_productos';


//productos
const productosBase = [
    {
        id: "com-001",
        nombre: "Procesador AMD Ryzen 5 7600",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Procesador de 6 núcleos y 12 hilos con arquitectura Zen 4 (3.8 GHz a 5.1 GHz), TDP de 65 W, caché L3 de 32 MB y gráficos Radeon integrados.",
        imagenes: [
            "/res/productos/Procesador AMD Ryzen 5 7600 [AMD] VF.png",
            "/res/productos/Procesador AMD Ryzen 5 7600 [AMD] VL.png",
            "/res/productos/Procesador AMD Ryzen 5 7600 [AMD] VP.png"
        ],
        marca: "AMD",
        modelo: "Ryzen 5 7600 (100-100001015BOX)",
        precio: 3999,
        calificacion: 4.8
    },
    {
        id: "com-002",
        nombre: "Tarjeta de video ASUS Dual GeForce RTX 4060 8GB",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Tarjeta gráfica con 8 GB GDDR6, 3,072 núcleos CUDA y compatibilidad con DLSS 3. Sistema de ventilación Axial-tech y modo 0dB.",
        imagenes: [
            "/res/productos/Tarjeta de video ASUS Dual GeForce RTX 4060 8GB [ASUS] VF.png",
            "/res/productos/Tarjeta de video ASUS Dual GeForce RTX 4060 8GB [ASUS] VL.png",
            "/res/productos/Tarjeta de video ASUS Dual GeForce RTX 4060 8GB [ASUS] VP.png"
        ],
        marca: "ASUS",
        modelo: "Dual GeForce RTX 4060 8GB (DUAL-RTX4060-8G)",
        precio: 6499,
        calificacion: 4.7
    },
    {
        id: "com-003",
        nombre: "Memoria RAM Kingston FURY Beast 16GB DDR5",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Módulo DDR5 a 5,200 MT/s con disipador térmico de perfil bajo. Soporta perfiles de overclocking Intel XMP 3.0 y AMD EXPO.",
        imagenes: [
            "/res/productos/Memoria RAM Kingston FURY Beast 16GB DDR5 [Kingston] VF.png",
            "/res/productos/Memoria RAM Kingston FURY Beast 16GB DDR5 [Kingston] VL.png",
            "/res/productos/Memoria RAM Kingston FURY Beast 16GB DDR5 [Kingston] VP.png"
        ],
        marca: "Kingston",
        modelo: "FURY Beast 16GB DDR5 (KF552C40BB-16)",
        precio: 1299,
        calificacion: 4.7
    },
    {
        id: "com-004",
        nombre: "Ventilador Corsair AF120 RGB Elite",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Ventilador PWM de 120 mm con velocidad de 550 a 2,100 rpm, iluminación RGB de 8 LEDs y modo Zero RPM para operación silenciosa.",
        imagenes: [
            "/res/productos/Corsair_AF120_vista_frontal.png",
            "/res/productos/Corsair_AF120_vista_lateral.png",
            "/res/productos/Corsair_AF120_vista_90 (1).png"
        ],
        marca: "Corsair",
        modelo: "AF120 RGB Elite (CO-9050153-WW)",
        precio: 499,
        calificacion: 4.4
    },
    {
        id: "com-005",
        nombre: "SSD ADATA LEGEND 800 1TB",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Unidad NVMe PCIe Gen4 x4 con velocidades de hasta 3,500 MB/s de lectura y 2,200 MB/s de escritura. Incluye disipador de calor.",
        imagenes: [
            "/res/productos/SSD ADATA LEGEND 800 1TB [ADATA] VF.png",
            "/res/productos/SSD ADATA LEGEND 800 1TB [ADATA] VL.png",
            "/res/productos/SSD ADATA LEGEND 800 1TB [ADATA] VP.png"
        ],
        marca: "ADATA",
        modelo: "LEGEND 800 1TB (ALEG-800-1000GCS)",
        precio: 1199,
        calificacion: 4.7
    },
    {
        id: "com-006",
        nombre: "Tarjeta inalámbrica Intel Wi-Fi 6E AX210",
        categoriaPadre: "componentes-alto-rendimiento",
        categoria: "componentes",
        descripcion: "Módulo interno M.2 2230 con Wi-Fi 6E (banda de 6 GHz), velocidad de hasta 2.4 Gbps y Bluetooth integrado.",
        imagenes: [
            "/res/productos/Intel AX210 Wireless Module (1).png",
            "/res/productos/Intel AX210 M.2 Card Side Profile (1).png",
            "/res/productos/Intel AX210 Wireless Card Product Shot (1).png"
        ],
        marca: "Intel",
        modelo: "Wi-Fi 6E AX210 (AX210.NGWG.NV)",
        precio: 499,
        calificacion: 4.6
    },
    {
        id: "acc-001",
        nombre: "Mouse Logitech Pebble Mouse 2 M350s",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Mouse Bluetooth ambidiestro ultra delgado con clics silenciosos, switch para 3 dispositivos y batería de hasta 24 meses de duración.",
        imagenes: [
            "/res/productos/Centered Graphite Wireless Mouse.png",
            "/res/productos/Graphite Wireless Mouse Profile.png",
            "/res/productos/Matte Graphite Logitech Wireless Mouse.png"
        ],
        marca: "Logitech",
        modelo: "Pebble Mouse 2 M350s",
        precio: 399,
        calificacion: 4.5
    },
    {
        id: "acc-002",
        nombre: "Teclado Logitech MX Keys Mini",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Teclado compacto inalámbrico con retroiluminación inteligente de proximidad, teclas esféricas PerfectStroke y carga por USB-C.",
        imagenes: [
            "/res/productos/Compact Spanish Layout Keyboard.png",
            "/res/productos/Low-Profile Mechanical Keyboard Side Profile.png",
            "/res/productos/Graphite Spanish Layout Wireless Keyboard.png"
        ],
        marca: "Logitech",
        modelo: "MX Keys Mini (920-010499)",
        precio: 2199,
        calificacion: 4.7
    },
    {
        id: "acc-003",
        nombre: "Monitor portátil ASUS ZenScreen MB16ACV 15.6\"",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Pantalla secundaria portátil Full HD IPS con tratamiento antibacterial, filtro de luz azul y conexión híbrida USB-C/USB-A.",
        imagenes: [
            "/res/productos/ASUS ZenScreen Portable Monitor Mockup (2).png",
            "/res/productos/Portable Monitor with Origami Stand.png",
            "/res/productos/ASUS ZenScreen Portable Monitor Studio Shot (2).png"
        ],
        marca: "ASUS",
        modelo: "ZenScreen MB16ACV",
        precio: 3999,
        calificacion: 4.6
    },
    {
        id: "acc-004",
        nombre: "Adaptador WiFi ASUS USB-AX56",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Adaptador USB dual band WiFi 6 que ofrece hasta 1,800 Mbps de velocidad general con soporte para Beamforming y cifrado WPA3.",
        imagenes: [
            "/res/productos/ASUS Dual-Antenna Wi‑Fi Adapter.png",
            "/res/productos/Vertical Black USB Wi‑Fi Adapter with Antenna.png",
            "/res/productos/ASUS Dual-Antenna Wi‑Fi Adapter (1).png"
        ],
        marca: "ASUS",
        modelo: "USB-AX56 (AX1800)",
        precio: 899,
        calificacion: 4.5
    },
    {
        id: "acc-005",
        nombre: "Disco duro externo ADATA HD710 Pro 2TB",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Disco portátil ultra resistente con protección contra agua y polvo IP68, carcasa de triple capa a prueba de golpes y sensor de impacto.",
        imagenes: [
            "/res/productos/Disco duro externo ADATA HD710 Pro 2TB [ADATA] VF.png",
            "/res/productos/Disco duro externo ADATA HD710 Pro 2TB [ADATA] VL.png",
            "/res/productos/Disco duro externo ADATA HD710 Pro 2TB [ADATA] VP.png"
        ],
        marca: "ADATA",
        modelo: "HD710 Pro 2TB",
        precio: 1399,
        calificacion: 4.5
    },
    {
        id: "acc-006",
        nombre: "Memoria USB Kingston DataTraveler Exodia 128GB",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Memoria USB 3.2 Gen 1 liviana con capuchón protector y argolla grande para llavero. Ideal para transferencia rápida de datos.",
        imagenes: [
            "/res/productos/Memoria USB Kingston DataTraveler Exodia 128GB [Kingston] Vf.png",
            "/res/productos/Memoria USB Kingston DataTraveler Exodia 128GB [Kingston] VL.png",
            "/res/productos/Memoria USB Kingston DataTraveler Exodia 128GB [Kingston] VP.png"
        ],
        marca: "Kingston",
        modelo: "DataTraveler Exodia 128GB (DTX/128GB)",
        precio: 249,
        calificacion: 4.6
    },
    {
        id: "acc-007",
        nombre: "Router ASUS RT-AX55 WiFi 6",
        categoriaPadre: "laptops-equipos-armados",
        categoria: "accesorios-laptop",
        descripcion: "Router WiFi 6 doble banda AX1800 con tecnologías OFDMA y MU-MIMO, protección AiProtection de Trend Micro y soporte ASUS AiMesh.",
        imagenes: [
            "/res/productos/ASUS Black Router with Four Antennas (1).png",
            "/res/productos/Modern Black Wi‑Fi Router with Antenna.png",
            "/res/productos/ASUS_router_2 (1).png"
        ],
        marca: "ASUS",
        modelo: "RT-AX55 (AX1800)",
        precio: 1599,
        calificacion: 4.6
    },
    {
        id: "per-001",
        nombre: "Teclado mecánico Logitech G413 SE",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Teclado de tamaño completo con interruptores mecánicos táctiles, teclas de PBT y prevención de efecto fantasma en 6 teclas.",
        imagenes: [
            "/res/productos/Teclado mecánico Logitech G413 SE  VF.png",
            "/res/productos/Teclado mecánico Logitech G413 SE  VL.png",
            "/res/productos/Teclado mecánico Logitech G413 SE  VP.png"
        ],
        marca: "Logitech",
        modelo: "G413 SE (920-010433)",
        precio: 1299,
        calificacion: 4.7
    },
    {
        id: "per-002",
        nombre: "Mouse gamer Logitech G502 HERO",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Mouse gamer con sensor HERO 25K (200-25,600 DPI), iluminación RGB y 11 botones programables. Incluye 5 pesas ajustables de 3.6 g.",
        imagenes: [
            "/res/productos/Mouse gamer Logitech G502 HERO [Logitech G] VF.png",
            "/res/productos/Mouse gamer Logitech G502 HERO [Logitech G] VL.png",
            "/res/productos/Mouse gamer Logitech G502 HERO [Logitech G] VP.png"
        ],
        marca: "Logitech",
        modelo: "G502 HERO (910-005469)",
        precio: 999,
        calificacion: 4.8
    },
    {
        id: "per-003",
        nombre: "Monitor ASUS TUF Gaming VG249Q1A 23.8\"",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Monitor gamer Full HD con frecuencia de 165 Hz (overclock), Extreme Low Motion Blur, FreeSync Premium y 1 ms de respuesta.",
        imagenes: [
            "/res/productos/Monitor ASUS TUF Gaming VG249Q1A 23.8  [ASUS] VF.png",
            "/res/productos/Monitor ASUS TUF Gaming VG249Q1A 23.8  [ASUS] VL.png",
            "/res/productos/Monitor ASUS TUF Gaming VG249Q1A 23.8  [ASUS] VP.png"
        ],
        marca: "ASUS",
        modelo: "TUF Gaming VG249Q1A",
        precio: 2999,
        calificacion: 4.6
    },
    {
        id: "per-004",
        nombre: "Webcam Logitech C920 HD Pro",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Cámara Full HD 1080p a 30 fps con lente de vidrio de 5 elementos, campo de visión de 78°, enfoque automático y sonido estéreo.",
        imagenes: [
            "/res/productos/Webcam Logitech C920 HD Pro [Logitech] VF.png",
            "/res/productos/Webcam Logitech C920 HD Pro [Logitech] VL.png",
            "/res/productos/Webcam Logitech C920 HD Pro [Logitech] VP.png"
        ],
        marca: "Logitech",
        modelo: "C920 HD Pro (960-001055)",
        precio: 1299,
        calificacion: 4.6
    },
    {
        id: "per-005",
        nombre: "Audífonos gamer Corsair HS55 Stereo",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Audífonos livianos (273 g) con transductores de 50 mm, almohadillas de memoria y micrófono abatible omnidireccional certificado por Discord.",
        imagenes: [
            "/res/productos/Black Gaming Headset Product Shot.png",
            "/res/productos/Black Corsair Gaming Headset Profile.png",
            "/res/productos/Corsair Black Gaming Headset Product Shot.png"
        ],
        marca: "Corsair",
        modelo: "HS55 Stereo (CA-9011260)",
        precio: 1099,
        calificacion: 4.5
    },
    {
        id: "per-006",
        nombre: "Bocinas Logitech Z313 2.1",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Sistema de altavoces 2.1 de 25 W RMS con subwoofer compacto y sección de control cableada para ajustar el volumen y conectar audífonos.",
        imagenes: [
            "/res/productos/Logitech Speaker System Product Shot.png",
            "/res/productos/Minimalist Black 2.1 Speaker System.png",
            "/res/productos/Logitech 2.1 Speaker System Studio Shot.png"
        ],
        marca: "Logitech",
        modelo: "Z313 (980-000413)",
        precio: 999,
        calificacion: 4.6
    },
    {
        id: "aud-007",
        nombre: "Micrófono Logitech G Yeti GX",
        categoriaPadre: "perifericos-accesorios",
        categoria: "perifericos",
        descripcion: "Micrófono dinámico USB con patrón supercardioide, tecnología Smart Audio Lock contra saturaciones e iluminación RGB LIGHTSYNC.",
        imagenes: [
            "/res/productos/Centered Black USB Microphone with RGB Glow.png",
            "/res/productos/Modern Black Microphone with RGB Glow.png",
            "/res/productos/RGB G-Series Microphone Studio Render.png"
        ],
        marca: "Logitech G",
        modelo: "Yeti GX (988-000569)",
        precio: 2499,
        calificacion: 4.7
    }
];

//funcion para inicializar productos guardados en el localstorage
function inicializarProductos() {
    if (typeof localStorage === 'undefined') {
        return [...productosBase];
    }

    //consultarlos
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }

    //guardarlos
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productosBase));
    return [...productosBase];
}

export const productos = inicializarProductos();

//añadimos producto a la lista y añadimos validaciones
export function addProduct(item) {
    productos.push(item);
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
        } catch (error) {
            console.error('Error al guardar en localStorage (posible límite de almacenamiento excedido):', error);
        }
    }
}