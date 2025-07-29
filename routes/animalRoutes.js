
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Conexión a la base de datos

// Registrar un animal
router.post('/register', async (req, res) => {
  try {
    const { id_propietario, nombre_animal, edad, id_raza, id_especie } = req.body;

    if (!id_propietario || !nombre_animal || !edad || !id_raza || !id_especie) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO animal (nombre_animal, edad, id_raza, id_especie, id_propietario) VALUES (?, ?, ?, ?, ?)',
      [nombre_animal, edad, id_raza, id_especie, id_propietario]
    );
    res.status(201).json({ message: 'Animal registrado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el animal:', error.message);
    res.status(500).json({ message: 'Error al registrar el animal' });
  }
});

// Obtener todos los animales con información completa
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        r.nombre_raza,
        e.nombre_especie,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos
      FROM animal a
      JOIN raza r ON a.id_raza = r.id_raza
      JOIN especie e ON a.id_especie = e.id_especie
      JOIN propietario p ON a.id_propietario = p.id_propietario
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los animales:', error.message);
    res.status(500).json({ message: 'Error al obtener los animales' });
  }
});

// Obtener un animal por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        r.nombre_raza,
        e.nombre_especie,
        p.nombres as propietario_nombres,
        p.apellidos as propietario_apellidos
      FROM animal a
      JOIN raza r ON a.id_raza = r.id_raza
      JOIN especie e ON a.id_especie = e.id_especie
      JOIN propietario p ON a.id_propietario = p.id_propietario
      WHERE a.id_animal = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el animal:', error.message);
    res.status(500).json({ message: 'Error al obtener el animal' });
  }
});

// Actualizar un animal por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_animal, edad, id_raza, id_especie } = req.body;

    const [result] = await db.query(
      'UPDATE animal SET nombre_animal = ?, edad = ?, id_raza = ?, id_especie = ? WHERE id_animal = ?',
      [nombre_animal, edad, id_raza, id_especie, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json({ message: 'Animal actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el animal:', error.message);
    res.status(500).json({ message: 'Error al actualizar el animal' });
  }
});

// Eliminar un animal por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM animal WHERE id_animal = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json({ message: 'Animal eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el animal:', error.message);
    res.status(500).json({ message: 'Error al eliminar el animal' });
  }
});

// Obtener razas disponibles
router.get('/razas/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM raza');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las razas:', error.message);
    res.status(500).json({ message: 'Error al obtener las razas' });
  }
});

// Obtener especies disponibles
router.get('/especies/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM especie');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las especies:', error.message);
    res.status(500).json({ message: 'Error al obtener las especies' });
  }
});

module.exports = router;
