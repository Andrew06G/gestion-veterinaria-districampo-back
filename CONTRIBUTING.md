# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto de Laboratorio Veterinario Integral Web!

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio

1. Ve al repositorio principal: [gestion-veterinaria-districampo](https://github.com/Andrew06G/gestion-veterinaria-districampo)
2. Haz clic en "Fork" en la esquina superior derecha
3. Clona tu fork localmente:
   ```bash
   git clone https://github.com/tu-usuario/gestion-veterinaria-districampo.git
   cd gestion-veterinaria-districampo
   ```

### 2. Configuración del Entorno

1. Ejecuta el script de configuración:
   ```bash
   npm run setup
   ```

2. Configura las variables de entorno:
   ```bash
   cp env.example .env
   # Edita el archivo .env con tus credenciales
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

### 3. Crear una Rama

Crea una nueva rama para tu contribución:
```bash
git checkout -b feature/nombre-de-tu-feature
```

### 4. Desarrollar

- Escribe código limpio y bien documentado
- Sigue las convenciones de nomenclatura del proyecto
- Asegúrate de que tu código funcione correctamente
- Prueba todas las funcionalidades

### 5. Commit y Push

```bash
git add .
git commit -m "feat: descripción de tu contribución"
git push origin feature/nombre-de-tu-feature
```

### 6. Crear Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Describe detalladamente tu contribución
4. Envía el PR

## 📋 Estándares de Código

### JavaScript/Node.js
- Usa ES6+ cuando sea posible
- Usa `const` y `let` en lugar de `var`
- Usa arrow functions cuando sea apropiado
- Documenta funciones complejas con JSDoc

### Base de Datos
- Usa consultas preparadas para evitar SQL injection
- Mantén la consistencia en el nombramiento de tablas y columnas
- Documenta cambios en el esquema de la base de datos

### Frontend
- Usa Bootstrap para el diseño responsivo
- Mantén el código JavaScript modular
- Usa nombres descriptivos para variables y funciones

## 🐛 Reportar Bugs

Si encuentras un bug:

1. Verifica que no haya sido reportado ya
2. Crea un issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Información del sistema (OS, versión de Node.js, etc.)

## 💡 Solicitar Features

Para solicitar nuevas funcionalidades:

1. Verifica que no haya sido solicitada ya
2. Crea un issue con:
   - Descripción detallada de la funcionalidad
   - Casos de uso
   - Beneficios esperados

## 📝 Documentación

- Actualiza el README.md si es necesario
- Documenta nuevas APIs
- Incluye ejemplos de uso
- Actualiza la documentación de la base de datos

## 🔒 Seguridad

- Nunca incluyas credenciales en el código
- Usa variables de entorno para configuraciones sensibles
- Reporta vulnerabilidades de seguridad de forma privada

## 📞 Contacto

Si tienes preguntas o necesitas ayuda:

- Crea un issue en GitHub
- Contacta a los mantenedores del proyecto

¡Gracias por contribuir! 🎉 