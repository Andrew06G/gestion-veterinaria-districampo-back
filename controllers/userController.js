const bcrypt = require('bcrypt');
const db = require('../config/db');

// Registrar usuario
exports.registerUser = async (req, res) => {
  try {
    const { nombres, apellidos, correo_electronico, contrasena, telefono, direccion } = req.body;
    
    // Verificar si el correo ya existe
    const [existingUsers] = await db.query('SELECT * FROM propietario WHERE correo_electronico = ?', [correo_electronico]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Obtener el siguiente ID disponible
    const [maxIdResult] = await db.query('SELECT MAX(id_propietario) as maxId FROM propietario');
    const nextId = (maxIdResult[0].maxId || 0) + 1;

    const query = `
      INSERT INTO propietario (id_propietario, nombres, apellidos, correo_electronico, contraseña, telefono, direccion)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await db.query(query, [nextId, nombres, apellidos, correo_electronico, contrasena, telefono, direccion]);
    res.json({ message: 'Usuario registrado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
  
    try {
      // Busca el usuario por correo electrónico
      const [rows] = await db.query('SELECT * FROM propietario WHERE correo_electronico = ?', [correo_electronico]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const user = rows[0];
  
      // Compara la contraseña directamente (sin hash)
      if (contrasena !== user.contraseña) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Usuario autenticado correctamente
      res.status(200).json({ 
        message: 'Inicio de sesión exitoso', 
        token: 'faketoken123',
        user: {
          id: user.id_propietario,
          nombres: user.nombres,
          apellidos: user.apellidos,
          correo_electronico: user.correo_electronico
        }
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
