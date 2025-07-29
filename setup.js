#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando Veterilab Web...\n');

// Verificar si existe el archivo .env
if (!fs.existsSync('.env')) {
  console.log('📝 Creando archivo .env...');
  
  // Leer el archivo de ejemplo
  const envExample = fs.readFileSync('env.example', 'utf8');
  
  // Crear el archivo .env
  fs.writeFileSync('.env', envExample);
  
  console.log('✅ Archivo .env creado. Por favor, edita las credenciales de la base de datos.');
} else {
  console.log('✅ Archivo .env ya existe.');
}

// Verificar si node_modules existe
if (!fs.existsSync('node_modules')) {
  console.log('📦 Instalando dependencias...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas correctamente.');
  } catch (error) {
    console.error('❌ Error instalando dependencias:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencias ya instaladas.');
}

console.log('\n🎉 Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Edita el archivo .env con tus credenciales de MySQL');
console.log('2. Asegúrate de que MySQL esté ejecutándose');
console.log('3. Crea la base de datos "veterilab2"');
console.log('4. Importa el esquema desde docs/database/schema.sql');
console.log('5. Ejecuta: npm start');
console.log('\n🌐 La aplicación estará disponible en: http://localhost:3001'); 