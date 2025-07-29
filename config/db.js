const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'veterilab2',
  port: process.env.DB_PORT || 3310,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const db = mysql.createPool(dbConfig);

// Probar la conexión
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Conexión exitosa a la base de datos MySQL');
    connection.release();
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
}

// Ejecutar prueba de conexión
testConnection();

module.exports = db;