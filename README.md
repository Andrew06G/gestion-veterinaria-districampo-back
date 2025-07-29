# Veterilab Web - Sistema de Gestión de Laboratorio Veterinario

Sistema web completo para la gestión integral de servicios de laboratorio veterinario, desarrollado con Node.js, Express.js y MySQL.

## 🚀 Características Principales

- **Gestión de Usuarios**: Registro y autenticación de propietarios de animales
- **Administración de Mascotas**: Creación y gestión de perfiles de animales
- **Solicitud de Análisis**: Sistema completo para solicitar servicios de laboratorio
- **Seguimiento de Análisis**: Control del estado de muestras y resultados
- **Generación de PDF**: Reportes digitales de resultados
- **Dashboard Administrativo**: Panel de control integral

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MySQL
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Generación de PDF**: PDFKit
- **Variables de Entorno**: dotenv

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Andrew06G/gestion-veterinaria-districampo.git
cd gestion-veterinaria-districampo
```

### 2. Configurar la Base de Datos

1. **Crear la base de datos**:
   ```sql
   CREATE DATABASE veterilab2;
   ```

2. **Importar el esquema**:
   - Ubica el archivo `docs/database/schema.sql` en el repositorio
   - Ejecuta el script en tu gestor de MySQL:
   ```bash
   mysql -u tu_usuario -p veterilab2 < docs/database/schema.sql
   ```

### 3. Configurar Variables de Entorno

1. **Copiar el archivo de ejemplo**:
   ```bash
   cp env.example .env
   ```

2. **Editar el archivo `.env`** con tus credenciales:
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=veterilab2
   DB_PORT=3306
   PORT=3001
   NODE_ENV=development
   ```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Ejecutar la Aplicación

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3001`

## 📁 Estructura del Proyecto

```
veterilab_web/
├── config/
│   └── db.js                 # Configuración de la base de datos
├── controllers/
│   ├── analysisController.js # Controlador de análisis
│   ├── pdfController.js      # Controlador de PDF
│   └── userController.js     # Controlador de usuarios
├── models/                   # Modelos de datos
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── pages/               # Páginas HTML
├── routes/
│   ├── analysisRoutes.js    # Rutas de análisis
│   ├── animalRoutes.js      # Rutas de animales
│   ├── pdfRoutes.js         # Rutas de PDF
│   └── userRoutes.js        # Rutas de usuarios
├── utils/
│   └── pdf.js              # Utilidades para PDF
├── .env                     # Variables de entorno (NO incluir en git)
├── .gitignore              # Archivos a ignorar
├── env.example             # Plantilla de variables de entorno
├── package.json
├── README.md
└── server.js               # Archivo principal del servidor
```

## 🔌 API Endpoints

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### Animales
- `GET /api/animals` - Obtener todos los animales
- `POST /api/animals/register` - Registrar animal
- `GET /api/animals/:id` - Obtener animal específico
- `PUT /api/animals/:id` - Actualizar animal

### Análisis
- `GET /api/analyses` - Obtener todos los análisis
- `POST /api/analyses` - Solicitar análisis
- `GET /api/analyses/animal/:id` - Análisis por animal
- `GET /api/analyses/:id/pdf` - Generar PDF de análisis

### Tipos de Análisis
- `GET /api/tipo_analisis` - Obtener tipos de análisis

## 🚀 Páginas Disponibles

- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/dashboard` - Dashboard principal
- `/animals` - Gestión de animales
- `/solicitar-analisis` - Solicitar análisis
- `/gestion-analisis` - Gestión de análisis

## 🔒 Seguridad

- Las credenciales de la base de datos están protegidas en el archivo `.env`
- El archivo `.env` está incluido en `.gitignore` para evitar subir credenciales
- Se recomienda cambiar las credenciales por defecto en producción

## 🐛 Solución de Problemas

### Error de Conexión a la Base de Datos
- Verificar que MySQL esté ejecutándose
- Confirmar las credenciales en el archivo `.env`
- Verificar que la base de datos `veterilab2` exista

### Error de Puerto en Uso
- Cambiar el puerto en el archivo `.env`
- O terminar procesos que usen el puerto 3001

### Error de Dependencias
- Ejecutar `npm install` para instalar dependencias faltantes
- Verificar la versión de Node.js

## 📝 Notas de Desarrollo

- El proyecto usa `mysql2/promise` para consultas asíncronas
- Las rutas están organizadas por funcionalidad
- El frontend usa Bootstrap para el diseño responsivo
- Los PDF se generan usando PDFKit

## 👥 Contribuidores

- **DAVID RICARDO RIVERA ARBELAEZ**
- **DANIEL FELIPE COLORADO AMAYA**
- **ANDREW LOAIZA GUZMAN**

## 📄 Licencia

Todos los derechos reservados. Este proyecto es para fines académicos y no se permite su uso o distribución comercial sin autorización expresa.

## 🔗 Enlaces Útiles

- [Repositorio Principal](https://github.com/Andrew06G/gestion-veterinaria-districampo)
- [Documentación de la Base de Datos](docs/database/)
- [Diagramas de Arquitectura](docs/architecture/) 