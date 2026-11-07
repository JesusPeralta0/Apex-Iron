export const productos = [];

// Función para agregar elementos al listado segun como pide el canvas y hacen en el ejemplo
function addProduct(item) {
    productos.push(item);
}


//periféricos y accesorios
const product1 = {
    id: "per-001",
    name: "Teclado mecánico Logitech G413 SE",
    description: "Teclado de tamaño completo con interruptores mecánicos táctiles, teclas de PBT y prevención de efecto fantasma en 6 teclas.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "perifericos",
    titulo: "Teclado mecánico Logitech G413 SE",
    descripcion: "Teclado de tamaño completo con interruptores mecánicos táctiles, teclas de PBT y prevención de efecto fantasma en 6 teclas.",
    imagenes: [
        "/res/productos/Teclado mecánico Logitech G413 SE  VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech",
    modelo: "G413 SE (920-010433)",
    precio: 1299,
    calificacion: 4.7
};

const product2 = {
    id: "per-002",
    name: "Mouse gamer Logitech G502 HERO",
    description: "Mouse gamer con sensor HERO 25K (200-25,600 DPI), iluminación RGB y 11 botones programables. Incluye 5 pesas ajustables de 3.6 g.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "perifericos",
    titulo: "Mouse gamer Logitech G502 HERO",
    descripcion: "Mouse gamer con sensor HERO 25K (200-25,600 DPI), iluminación RGB y 11 botones programables. Incluye 5 pesas ajustables de 3.6 g.",
    imagenes: [
        "/res/productos/Mouse gamer Logitech G502 HERO [Logitech G] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech",
    modelo: "G502 HERO (910-005469)",
    precio: 999,
    calificacion: 4.8
};

const product3 = {
    id: "per-003",
    name: "Monitor ASUS TUF Gaming VG249Q1A 23.8\"",
    description: "Monitor gamer Full HD con frecuencia de 165 Hz (overclock), Extreme Low Motion Blur, FreeSync Premium y 1 ms de respuesta.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "perifericos",
    titulo: "Monitor ASUS TUF Gaming VG249Q1A 23.8\"",
    descripcion: "Monitor gamer Full HD con frecuencia de 165 Hz (overclock), Extreme Low Motion Blur, FreeSync Premium y 1 ms de respuesta.",
    imagenes: [
        "/res/productos/Monitor ASUS TUF Gaming VG249Q1A 23.8  [ASUS] VF.png",
        "/res/productos/",
        "/res/productos/",
    ],
    marca: "ASUS",
    modelo: "TUF Gaming VG249Q1A",
    precio: 2999,
    calificacion: 4.6
};

const product4 = {
    id: "per-004",
    name: "Webcam Logitech C920 HD Pro",
    description: "Cámara Full HD 1080p a 30 fps con lente de vidrio de 5 elementos, campo de visión de 78°, enfoque automático y sonido estéreo.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "perifericos",
    titulo: "Webcam Logitech C920 HD Pro",
    descripcion: "Cámara Full HD 1080p a 30 fps con lente de vidrio de 5 elementos, campo de visión de 78°, enfoque automático y sonido estéreo.",
    imagenes: [
        "/res/productos/Webcam Logitech C920 HD Pro [Logitech] VF.png",
        "/res/productos/",
        "/res/productos/",
    ],
    marca: "Logitech",
    modelo: "C920 HD Pro (960-001055)",
    precio: 1299,
    calificacion: 4.6
};

//componentes de alto rendimiento (almacenamiento)
const product5 = {
    id: "alm-001",
    name: "SSD ADATA LEGEND 800 1TB",
    description: "Unidad NVMe PCIe Gen4 x4 con velocidades de hasta 3,500 MB/s de lectura y 2,200 MB/s de escritura. Incluye disipador de calor.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "almacenamiento",
    titulo: "SSD ADATA LEGEND 800 1TB",
    descripcion: "Unidad NVMe PCIe Gen4 x4 con velocidades de hasta 3,500 MB/s de lectura y 2,200 MB/s de escritura. Incluye disipador de calor.",
    imagenes: [
        "/res/productos/SSD ADATA LEGEND 800 1TB [ADATA] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ADATA",
    modelo: "LEGEND 800 1TB (ALEG-800-1000GCS)",
    precio: 1199,
    calificacion: 4.7
};

const product6 = {
    id: "alm-002",
    name: "Disco duro externo ADATA HD710 Pro 2TB",
    description: "Disco portátil ultra resistente con protección contra agua y polvo IP68, carcasa de triple capa a prueba de golpes y sensor de impacto.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "almacenamiento",
    titulo: "Disco duro externo ADATA HD710 Pro 2TB",
    descripcion: "Disco portátil ultra resistente con protección contra agua y polvo IP68, carcasa de triple capa a prueba de golpes y sensor de impacto.",
    imagenes: [
        "/res/productos/Disco duro externo ADATA HD710 Pro 2TB [ADATA] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ADATA",
    modelo: "HD710 Pro 2TB",
    precio: 1399,
    calificacion: 4.5
};

const product7 = {
    id: "alm-003",
    name: "Memoria USB Kingston DataTraveler Exodia 128GB",
    description: "Memoria USB 3.2 Gen 1 liviana con capuchón protector y argolla grande para llavero. Ideal para transferencia rápida de datos.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "almacenamiento",
    titulo: "Memoria USB Kingston DataTraveler Exodia 128GB",
    descripcion: "Memoria USB 3.2 Gen 1 liviana con capuchón protector y argolla grande para llavero. Ideal para transferencia rápida de datos.",
    imagenes: [
        "/res/productos/Memoria USB Kingston DataTraveler Exodia 128GB [Kingston] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Kingston",
    modelo: "DataTraveler Exodia 128GB (DTX/128GB)",
    precio: 249,
    calificacion: 4.6
};

//componentes de alto rendimiento
const product8 = {
    id: "com-001",
    name: "Procesador AMD Ryzen 5 7600",
    description: "Procesador de 6 núcleos y 12 hilos con arquitectura Zen 4 (3.8 GHz a 5.1 GHz), TDP de 65 W, caché L3 de 32 MB y gráficos Radeon integrados.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "componentes",
    titulo: "Procesador AMD Ryzen 5 7600",
    descripcion: "Procesador de 6 núcleos y 12 hilos con arquitectura Zen 4 (3.8 GHz a 5.1 GHz), TDP de 65 W, caché L3 de 32 MB y gráficos Radeon integrados.",
    imagenes: [
        "/res/productos/Procesador AMD Ryzen 5 7600 [AMD] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "AMD",
    modelo: "Ryzen 5 7600 (100-100001015BOX)",
    precio: 3999,
    calificacion: 4.8
};

const product9 = {
    id: "com-002",
    name: "Tarjeta de video ASUS Dual GeForce RTX 4060 8GB",
    description: "Tarjeta gráfica con 8 GB GDDR6, 3,072 núcleos CUDA y compatibilidad con DLSS 3. Sistema de ventilación Axial-tech y modo 0dB.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "componentes",
    titulo: "Tarjeta de video ASUS Dual GeForce RTX 4060 8GB",
    descripcion: "Tarjeta gráfica con 8 GB GDDR6, 3,072 núcleos CUDA y compatibilidad con DLSS 3. Sistema de ventilación Axial-tech y modo 0dB.",
    imagenes: [
        "/res/productos/Tarjeta de video ASUS Dual GeForce RTX 4060 8GB [ASUS] VF.png",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ASUS",
    modelo: "Dual GeForce RTX 4060 8GB (DUAL-RTX4060-8G)",
    precio: 6499,
    calificacion: 4.7
};

const product10 = {
    id: "com-003",
    name: "Memoria RAM Kingston FURY Beast 16GB DDR5",
    description: "Módulo DDR5 a 5,200 MT/s con disipador térmico de perfil bajo. Soporta perfiles de overclocking Intel XMP 3.0 y AMD EXPO.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "componentes",
    titulo: "Memoria RAM Kingston FURY Beast 16GB DDR5",
    descripcion: "Módulo DDR5 a 5,200 MT/s con disipador térmico de perfil bajo. Soporta perfiles de overclocking Intel XMP 3.0 y AMD EXPO.",
    imagenes: [
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Kingston",
    modelo: "FURY Beast 16GB DDR5 (KF552C40BB-16)",
    precio: 1299,
    calificacion: 4.7
};

const product11 = {
    id: "com-004",
    name: "Ventilador Corsair AF120 RGB Elite",
    description: "Ventilador PWM de 120 mm con velocidad de 550 a 2,100 rpm, iluminación RGB de 8 LEDs y modo Zero RPM para operación silenciosa.",
    categoriaPadre: "componentes-alto-rendimiento",
    categoria: "componentes",
    titulo: "Ventilador Corsair AF120 RGB Elite",
    descripcion: "Ventilador PWM de 120 mm con velocidad de 550 a 2,100 rpm, iluminación RGB de 8 LEDs y modo Zero RPM para operación silenciosa.",
    imagenes: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Corsair",
    modelo: "AF120 RGB Elite (CO-9050153-WW)",
    precio: 499,
    calificacion: 4.4
};

//periféricos y accesorios (conectividad)
const product12 = {
    id: "con-001",
    name: "Router ASUS RT-AX55 WiFi 6",
    description: "Router WiFi 6 doble banda AX1800 con tecnologías OFDMA y MU-MIMO, protección AiProtection de Trend Micro y soporte ASUS AiMesh.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "conectividad",
    titulo: "Router ASUS RT-AX55 WiFi 6",
    descripcion: "Router WiFi 6 doble banda AX1800 con tecnologías OFDMA y MU-MIMO, protección AiProtection de Trend Micro y soporte ASUS AiMesh.",
    imagenes: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ASUS",
    modelo: "RT-AX55 (AX1800)",
    precio: 1599,
    calificacion: 4.6
};

const product13 = {
    id: "con-002",
    name: "Adaptador WiFi ASUS USB-AX56",
    description: "Adaptador USB dual band WiFi 6 que ofrece hasta 1,800 Mbps de velocidad general con soporte para Beamforming y cifrado WPA3.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "conectividad",
    titulo: "Adaptador WiFi ASUS USB-AX56",
    descripcion: "Adaptador USB dual band WiFi 6 que ofrece hasta 1,800 Mbps de velocidad general con soporte para Beamforming y cifrado WPA3.",
    imagenes: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ASUS",
    modelo: "USB-AX56 (AX1800)",
    precio: 899,
    calificacion: 4.5
};

const product14 = {
    id: "con-003",
    name: "Tarjeta inalámbrica Intel Wi-Fi 6E AX210",
    description: "Módulo interno M.2 2230 con Wi-Fi 6E (banda de 6 GHz), velocidad de hasta 2.4 Gbps y Bluetooth integrado.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "conectividad",
    titulo: "Tarjeta inalámbrica Intel Wi-Fi 6E AX210",
    descripcion: "Módulo interno M.2 2230 con Wi-Fi 6E (banda de 6 GHz), velocidad de hasta 2.4 Gbps y Bluetooth integrado.",
    imagenes: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Intel",
    modelo: "Wi-Fi 6E AX210 (AX210.NGWG.NV)",
    precio: 499,
    calificacion: 4.6
};

//laptops y equipos armados
const product15 = {
    id: "acc-001",
    name: "Mouse Logitech Pebble Mouse 2 M350s",
    description: "Mouse Bluetooth ambidiestro ultra delgado con clics silenciosos, switch para 3 dispositivos y batería de hasta 24 meses de duración.",
    categoriaPadre: "laptops-equipos-armados",
    categoria: "accesorios-laptop",
    titulo: "Mouse Logitech Pebble Mouse 2 M350s",
    descripcion: "Mouse Bluetooth ambidiestro ultra delgado con clics silenciosos, switch para 3 dispositivos y batería de hasta 24 meses de duración.",
    imagenes: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech",
    modelo: "Pebble Mouse 2 M350s",
    precio: 399,
    calificacion: 4.5
};

const product16 = {
    id: "acc-002",
    name: "Teclado Logitech MX Keys Mini",
    description: "Teclado compacto inalámbrico con retroiluminación inteligente de proximidad, teclas esféricas PerfectStroke y carga por USB-C.",
    categoriaPadre: "laptops-equipos-armados",
    categoria: "accesorios-laptop",
    titulo: "Teclado Logitech MX Keys Mini",
    descripcion: "Teclado compacto inalámbrico con retroiluminación inteligente de proximidad, teclas esféricas PerfectStroke y carga por USB-C.",
    imagenes: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech",
    modelo: "MX Keys Mini (920-010499)",
    precio: 2199,
    calificacion: 4.7
};

const product17 = {
    id: "acc-003",
    name: "Monitor portátil ASUS ZenScreen MB16ACV 15.6\"",
    description: "Pantalla secundaria portátil Full HD IPS con tratamiento antibacterial, filtro de luz azul y conexión híbrida USB-C/USB-A.",
    categoriaPadre: "laptops-equipos-armados",
    categoria: "accesorios-laptop",
    titulo: "Monitor portátil ASUS ZenScreen MB16ACV 15.6\"",
    descripcion: "Pantalla secundaria portátil Full HD IPS con tratamiento antibacterial, filtro de luz azul y conexión híbrida USB-C/USB-A.",
    imagenes: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "ASUS",
    modelo: "ZenScreen MB16ACV",
    precio: 3999,
    calificacion: 4.6
};

//perifericos y accesorios
const product18 = {
    id: "aud-001",
    name: "Audífonos gamer Corsair HS55 Stereo",
    description: "Audífonos livianos (273 g) con transductores de 50 mm, almohadillas de memoria y micrófono abatible omnidireccional certificado por Discord.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "audio-video",
    titulo: "Audífonos gamer Corsair HS55 Stereo",
    descripcion: "Audífonos livianos (273 g) con transductores de 50 mm, almohadillas de memoria y micrófono abatible omnidireccional certificado por Discord.",
    imagenes: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Corsair",
    modelo: "HS55 Stereo (CA-9011260)",
    precio: 1099,
    calificacion: 4.5
};

const product19 = {
    id: "aud-002",
    name: "Bocinas Logitech Z313 2.1",
    description: "Sistema de altavoces 2.1 de 25 W RMS con subwoofer compacto y sección de control cableada para ajustar el volumen y conectar audífonos.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "audio-video",
    titulo: "Bocinas Logitech Z313 2.1",
    descripcion: "Sistema de altavoces 2.1 de 25 W RMS con subwoofer compacto y sección de control cableada para ajustar el volumen y conectar audífonos.",
    imagenes: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech",
    modelo: "Z313 (980-000413)",
    precio: 999,
    calificacion: 4.6
};

const product20 = {
    id: "aud-003",
    name: "Micrófono Logitech G Yeti GX",
    description: "Micrófono dinámico USB con patrón supercardioide, tecnología Smart Audio Lock contra saturaciones e iluminación RGB LIGHTSYNC.",
    categoriaPadre: "perifericos-accesorios",
    categoria: "audio-video",
    titulo: "Micrófono Logitech G Yeti GX",
    descripcion: "Micrófono dinámico USB con patrón supercardioide, tecnología Smart Audio Lock contra saturaciones e iluminación RGB LIGHTSYNC.",
    imagenes: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
        "/res/productos/",
        "/res/productos/"
    ],
    marca: "Logitech G",
    modelo: "Yeti GX (988-000569)",
    precio: 2499,
    calificacion: 4.7
};

//cargo los productos al array
addProduct(product1);
addProduct(product2);
addProduct(product3);
addProduct(product4);
addProduct(product5);
addProduct(product6);
addProduct(product7);
addProduct(product8);
addProduct(product9);
addProduct(product10);
addProduct(product11);
addProduct(product12);
addProduct(product13);
addProduct(product14);
addProduct(product15);
addProduct(product16);
addProduct(product17);
addProduct(product18);
addProduct(product19);
addProduct(product20);