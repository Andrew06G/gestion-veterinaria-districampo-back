const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const animalRoutes = require('./routes/animalRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/pdf', pdfRoutes);

// Ruta específica para tipo_analisis (para compatibilidad con el frontend)
app.get('/api/tipo_analisis', async (req, res) => {
  try {
    const db = require('./config/db');
    const [rows] = await db.query('SELECT id_tipo_analisis, nombre_analisis, precio FROM tipo_analisis');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de análisis:', error);
    res.status(500).json({ message: 'Error al obtener tipos de análisis' });
  }
});

// Ruta específica para generar PDF de análisis (para compatibilidad con el frontend)
app.get('/api/analyses/:id/pdf', async (req, res) => {
  try {
    const db = require('./config/db');
    const { id } = req.params;
    
    // Obtener información completa del análisis
    const [rows] = await db.query(`
      SELECT 
        m.id_muestra,
        a.nombre_animal,
        a.edad,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos,
        p.telefono as propietario_telefono,
        p.direccion as propietario_direccion,
        ta.nombre_analisis,
        ta.precio,
        r.resultado,
        r.fecha_emision,
        te.nombre_estado,
        m.fecha_toma
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN propietario p ON a.id_propietario = p.id_propietario
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_estado te ON m.id_estado = te.id_tipo_estado
      WHERE m.id_muestra = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener datos del análisis para PDF:', error);
    res.status(500).json({ message: 'Error al obtener los datos del análisis' });
  }
});

// Rutas para servir las páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'animals.html'));
});

app.get('/solicitar-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'solicitar_analisis.html'));
});

app.get('/gestion-analisis', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'gestion_analisis.html'));
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: '¡Servidor y base de datos funcionando correctamente!' });
});

const PORT = 3001; // Cambiado a 3001 para evitar conflictos
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Rutas disponibles:');
  console.log('- /login - Página de inicio de sesión');
  console.log('- /register - Página de registro');
  console.log('- /dashboard - Dashboard principal');
  console.log('- /animals - Gestión de animales');
  console.log('- /solicitar-analisis - Solicitar análisis');
  console.log('- /gestion-analisis - Gestión de análisis');
});