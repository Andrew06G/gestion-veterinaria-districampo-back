
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Conexión a la base de datos
const userController = require('../controllers/userController'); // Controlador adicional

// Registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena } = req.body;

    if (!nombres || !apellidos || !correo_electronico || !telefono || !direccion || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya existe
    const [existingUsers] = await db.query('SELECT * FROM propietario WHERE correo_electronico = ?', [correo_electronico]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Obtener el siguiente ID disponible
    const [maxIdResult] = await db.query('SELECT MAX(id_propietario) as maxId FROM propietario');
    const nextId = (maxIdResult[0].maxId || 0) + 1;

    const [result] = await db.query(
      'INSERT INTO propietario (id_propietario, nombres, apellidos, correo_electronico, telefono, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nextId, nombres, apellidos, correo_electronico, telefono, direccion, contrasena]
    );
    res.status(201).json({ message: 'Usuario registrado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Inicio de sesión
router.post('/login', userController.loginUser);

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM propietario');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.message);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM propietario WHERE id_propietario = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error.message);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, correo_electronico, telefono, direccion, contrasena } = req.body;

    const [result] = await db.query(
      'UPDATE propietario SET correo_electronico = ?, telefono = ?, nombres = ?, apellidos = ?, direccion = ?, contraseña = ? WHERE id_propietario = ?',
      [correo_electronico, telefono, nombres, apellidos, direccion, contrasena, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.message);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM propietario WHERE id_propietario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.message);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
