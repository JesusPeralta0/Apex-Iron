-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(80) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Componentes de alto rendimiento','Procesadores y Tarjetas Madre','Procesadores de ultima generacion y placas base para maxima velocidad.'),(2,'Componentes de alto rendimiento','Tarjetas de Video (GPU)','Tarjetas graficas dedicadas para gaming extremo, renderizado y edicion.'),(3,'Componentes de alto rendimiento','Memorias RAM','Modulos de memoria DDR4 y DDR5 de alta frecuencia para multitarea fluida.'),(4,'Componentes de alto rendimiento','Almacenamiento SSD y NVMe','Unidades de estado solido ultrarrapidas para arranque y carga instantanea.'),(5,'Componentes de alto rendimiento','Fuentes de Poder y Enfriamiento','Fuentes certificadas y sistemas de enfriamiento liquido o por aire.'),(6,'Laptops y Equipos Armados','Laptops Gamer','Poder portatil con graficos dedicados y pantallas de alta tasa de refresco.'),(7,'Laptops y Equipos Armados','Laptops de Trabajo y Estudio','Equipos ligeros y eficientes disenados para productividad y movilidad.'),(8,'Laptops y Equipos Armados','PC Gamer Armadas','Computadoras listas para jugar ensambladas con componentes de alto nivel.'),(9,'Laptops y Equipos Armados','Workstations Profesionales','Equipos de escritorio optimizados para arquitectura, diseno 3D y calculo.'),(10,'Laptops y Equipos Armados','PC de Oficina y Hogar','Computadoras confiables y compactas para tareas administrativas diarias.'),(11,'Perifericos y Accesorios','Teclados Mecanicos','Teclados mecanicos y de membrana con switches precisos e iluminacion RGB.'),(12,'Perifericos y Accesorios','Mouses de Alta Precision','Ratones opticos e inalambricos ergonomicos con sensores de alto DPI.'),(13,'Perifericos y Accesorios','Monitores de Alta Definicion','Pantallas Full HD, 2K y 4K con paneles IPS y tiempos de respuesta rapidos.'),(14,'Perifericos y Accesorios','Audifonos y Microfonos','Headsets con sonido envolvente y microfonos para streaming o llamadas.'),(15,'Perifericos y Accesorios','Webcams y Accesorios de Escritorio','Camaras web HD, mousepads XL, soportes para monitor y concentradores USB.');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle`
--

DROP TABLE IF EXISTS `detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle` (
  `pedido_id_pedido` int NOT NULL,
  `producto_id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`pedido_id_pedido`,`producto_id_producto`),
  KEY `fk_pedido_has_producto_producto1_idx` (`producto_id_producto`),
  KEY `fk_pedido_has_producto_pedido1_idx` (`pedido_id_pedido`),
  CONSTRAINT `fk_pedido_has_producto_pedido1` FOREIGN KEY (`pedido_id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `fk_pedido_has_producto_producto1` FOREIGN KEY (`producto_id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle`
--

LOCK TABLES `detalle` WRITE;
/*!40000 ALTER TABLE `detalle` DISABLE KEYS */;
INSERT INTO `detalle` VALUES (1,1,1,3999.00),(2,3,2,2598.00),(3,7,1,399.00),(4,2,1,6499.00),(5,5,2,2398.00),(6,8,1,2199.00),(7,4,3,1497.00),(8,9,1,3999.00),(9,12,4,996.00),(10,11,1,1399.00),(11,14,1,1299.00),(12,15,1,2499.00),(13,10,2,1798.00),(14,13,1,1599.00),(15,6,2,998.00);
/*!40000 ALTER TABLE `detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `fecha_pedido` date NOT NULL,
  `estado` varchar(45) NOT NULL,
  `usuario_id_usuario` int NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedido_usuario_idx` (`usuario_id_usuario`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,'2026-11-01','Pendiente',1),(2,'2026-11-02','Enviado',2),(3,'2026-11-03','Entregado',3),(4,'2026-11-04','Pendiente',4),(5,'2026-11-05','Enviado',5),(6,'2026-11-06','Cancelado',6),(7,'2026-11-07','Entregado',7),(8,'2026-11-08','Pendiente',8),(9,'2026-11-09','Enviado',9),(10,'2026-11-10','Entregado',10),(11,'2026-11-11','Pendiente',11),(12,'2026-11-12','Enviado',12),(13,'2026-11-13','Entregado',13),(14,'2026-11-14','Pendiente',14),(15,'2026-11-15','Cancelado',15);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `detalle_id_detalle` int NOT NULL,
  `categoria_id_categoria` int NOT NULL,
  PRIMARY KEY (`id_producto`,`detalle_id_detalle`,`categoria_id_categoria`),
  KEY `fk_producto_categoria1_idx` (`categoria_id_categoria`),
  CONSTRAINT `fk_producto_categoria1` FOREIGN KEY (`categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Procesador AMD Ryzen 5 7600','Procesador de 6 nucleos y 12 hilos con arquitectura Zen 4 (3.8 GHz a 5.1 GHz), TDP de 65 W, cache L3 de 32 MB.',3999.00,18,1,1),(2,'Tarjeta video ASUS Dual GeForce RTX 4060 8GB','Tarjeta grafica con 8 GB GDDR6, 3,072 nucleos CUDA y compatibilidad con DLSS 3. Sistema de ventilacion Axial-tech.',6499.00,12,2,2),(3,'Memoria RAM Kingston FURY Beast 16GB DDR5','Modulo DDR5 a 5,200 MT/s con disipador termico de perfil bajo. Soporta perfiles de overclocking Intel XMP 3.0.',1299.00,35,3,3),(4,'Ventilador Corsair AF120 RGB Elite','Ventilador PWM de 120 mm con velocidad de 550 a 2,100 rpm, iluminacion RGB de 8 LEDs y modo Zero RPM.',499.00,40,4,5),(5,'SSD ADATA LEGEND 800 1TB','Unidad NVMe PCIe Gen4 x4 con velocidades de hasta 3,500 MB/s de lectura y 2,200 MB/s de escritura.',1199.00,28,5,4),(6,'Tarjeta inalambrica Intel Wi-Fi 6E AX210','Modulo interno M.2 2230 con Wi-Fi 6E (banda de 6 GHz), velocidad de hasta 2.4 Gbps y Bluetooth integrado.',499.00,25,6,1),(7,'Mouse Logitech Pebble Mouse 2 M350s','Mouse Bluetooth ambidiestro ultra delgado con clics silenciosos, switch para 3 dispositivos y bateria de larga duracion.',399.00,50,7,12),(8,'Teclado Logitech MX Keys Mini','Teclado compacto inalambrico con retroiluminacion inteligente de proximidad y teclas esfericas concavas.',2199.00,20,8,11),(9,'Monitor portatil ASUS ZenScreen MB16ACV 15.6','Pantalla secundaria portatil Full HD IPS con tratamiento antibacterial, filtro de luz azul y conexion hibrida USB-C/USB-A.',3999.00,14,9,13),(10,'Adaptador WiFi ASUS USB-AX56','Adaptador USB dual band WiFi 6 que ofrece hasta 1,800 Mbps de velocidad general con soporte para Beamforming.',899.00,22,10,15),(11,'Disco duro externo ADATA HD710 Pro 2TB','Disco portatil ultra resistente con proteccion contra agua y polvo IP68, carcasa de triple capa a prueba de golpes.',1399.00,30,11,4),(12,'Memoria USB Kingston DataTraveler Exodia 128','Memoria USB 3.2 Gen 1 liviana con capuchon protector y argolla grande para llavero. Ideal para transferencia rapida.',249.00,65,12,15),(13,'Router ASUS RT-AX55 WiFi 6','Router WiFi 6 doble banda AX1800 con tecnologias OFDMA y MU-MIMO, proteccion AiProtection de Trend Micro.',1599.00,16,13,15),(14,'Teclado mecanico Logitech G413 SE','Teclado de tamano completo con interruptores mecanicos tactiles, teclas de PBT y prevencion de efecto fantasma.',1299.00,24,14,11),(15,'Microfono Logitech G Yeti GX','Microfono dinamico USB con patron supercardioide, tecnologia Smart Audio Lock contra saturaciones e iluminacion RGB.',2499.00,15,15,14);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `apellido` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Perez','Juan Carlos','jc.perez.87@gmail.com','JCPerez87#','5541928374','Av. Division del Norte 2415, Portales Norte',0),(2,'Mendoza','Sofia','sofia.mendoza94@gmail.com','SofiM94*','5538492014','Av. Insurgentes Sur 1420, Col. Del Valle',0),(3,'Hernandez','Carlos','carlos.hdz.mtz@hotmail.com','Carlos2026!','3319482750','Calle Morelos 415, Col. Centro',0),(4,'Ramirez','Valeria','val.ramirez88@gmail.com','ValeRam88#','8120938471','Av. Eugenio Garza Sada 2501, Tecnologico',0),(5,'Castillo','Alejandro','alejandro.castillo@outlook.com','AlexCast_25','5548291038','Calz. de Tlalpan 3020, Coapa',0),(6,'Morales','Fernanda','fer.morales.g@gmail.com','FerMorales1$','2224918273','Blvd. Atlixco 1804, Col. Belisario Dominguez',0),(7,'Ortiz','Diego','diego_ortiz_91@yahoo.com.mx','DiegoO91#','5561029384','Calle Durango 205, Roma Norte',0),(8,'Vargas','Mariana','mariana.vargas.c@gmail.com','MariVar2026*','4423910482','Av. Constituyentes 104, Col. Carretas',0),(9,'Jimenez','Roberto','rjimenez.arq@gmail.com','RobJim79!','5529384710','Av. Revolucion 1267, Col. Los Alpes',0),(10,'Cruz','Daniela','dani.cruz.lopez@hotmail.com','DaniCruz95#','9992837465','Calle 60 #482, Col. Centro, Merida',0),(11,'Flores','Luis Fernando','luisfer.flores@gmail.com','LuisF2026$','3328491023','Av. Vallarta 3233, Vallarta Poniente',0),(12,'Reyes','Paula','paula.reyes.m@outlook.com','PauReyes98*','5573920184','Calle Newton 156, Polanco',0),(13,'Gutierrez','Jorge','jorge.gtz.85@gmail.com','JorgeG85#','8183920192','Av. Vasconcelos 310, San Pedro Garza Garcia',0),(14,'Navarro','Camila','camila.navarro.r@gmail.com','CamiNav01!','5540192837','Av. Universidad 1900, Copilco',0),(15,'Sanchez','Eduardo','eduardo.sanchez.v@yahoo.com','EduSan90$','6642938172','Blvd. Agua Caliente 4558, Aviacion',0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-17 18:04:48
