
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Conexión a la base de datos
const analysisController = require('../controllers/analysisController'); // Controlador adicional

// Obtener todos los tipos de análisis
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_tipo_analisis, nombre_analisis, precio FROM tipo_analisis');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener todos los análisis:', error.message);
    res.status(500).json({ message: 'Error al obtener todos los análisis' });
  }
});

// Ruta POST directa para solicitar análisis (compatibilidad con frontend)
router.post('/', async (req, res) => {
  try {
    const { id_animal, id_tipo_analisis, fecha_solicitud } = req.body;

    if (!id_animal || !id_tipo_analisis || !fecha_solicitud) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar que el animal existe
    const [animalExists] = await db.query('SELECT * FROM animal WHERE id_animal = ?', [id_animal]);
    if (animalExists.length === 0) {
      return res.status(400).json({ message: 'El animal especificado no existe' });
    }

    // Verificar que el tipo de análisis existe
    const [analisisExists] = await db.query('SELECT * FROM tipo_analisis WHERE id_tipo_analisis = ?', [id_tipo_analisis]);
    if (analisisExists.length === 0) {
      return res.status(400).json({ message: 'El tipo de análisis especificado no existe' });
    }

    // Obtener el id_tipo_muestra del análisis
    const id_tipo_muestra = analisisExists[0].id_tipo_muestra;

    // Insertar muestra
    const [muestraResult] = await db.query(
      'INSERT INTO muestra (id_animal, id_tipo_muestra, fecha_toma, id_estado) VALUES (?, ?, ?, 3)',
      [id_animal, id_tipo_muestra, fecha_solicitud]
    );

    const id_muestra = muestraResult.insertId;

    // Insertar resultado
    const [resultadoResult] = await db.query(
      'INSERT INTO resultado (id_tipo_analisis, id_muestra, id_animal, resultado, fecha_emision) VALUES (?, ?, ?, ?, ?)',
      [id_tipo_analisis, id_muestra, id_animal, 'Pendiente', fecha_solicitud]
    );

    res.status(201).json({ 
      message: 'Análisis solicitado exitosamente', 
      id_muestra: id_muestra,
      id_resultado: resultadoResult.insertId 
    });
  } catch (error) {
    console.error('Error al registrar el análisis:', error.message);
    res.status(500).json({ message: 'Error al registrar el análisis' });
  }
});

// Obtener un análisis por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM tipo_analisis WHERE id_tipo_analisis = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el análisis:', error.message);
    res.status(500).json({ message: 'Error al obtener el análisis' });
  }
});

// Solicitar un análisis (crear muestra y resultado)
router.post('/solicitar', async (req, res) => {
  try {
    const { id_animal, id_tipo_analisis, fecha_solicitud } = req.body;

    if (!id_animal || !id_tipo_analisis || !fecha_solicitud) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar que el animal existe
    const [animalExists] = await db.query('SELECT * FROM animal WHERE id_animal = ?', [id_animal]);
    if (animalExists.length === 0) {
      return res.status(400).json({ message: 'El animal especificado no existe' });
    }

    // Verificar que el tipo de análisis existe
    const [analisisExists] = await db.query('SELECT * FROM tipo_analisis WHERE id_tipo_analisis = ?', [id_tipo_analisis]);
    if (analisisExists.length === 0) {
      return res.status(400).json({ message: 'El tipo de análisis especificado no existe' });
    }

    // Obtener el id_tipo_muestra del análisis
    const id_tipo_muestra = analisisExists[0].id_tipo_muestra;

    // Insertar muestra
    const [muestraResult] = await db.query(
      'INSERT INTO muestra (id_animal, id_tipo_muestra, fecha_toma, id_estado) VALUES (?, ?, ?, 3)',
      [id_animal, id_tipo_muestra, fecha_solicitud]
    );

    const id_muestra = muestraResult.insertId;

    // Insertar resultado
    const [resultadoResult] = await db.query(
      'INSERT INTO resultado (id_tipo_analisis, id_muestra, id_animal, resultado, fecha_emision) VALUES (?, ?, ?, ?, ?)',
      [id_tipo_analisis, id_muestra, id_animal, 'Pendiente', fecha_solicitud]
    );

    res.status(201).json({ 
      message: 'Análisis solicitado exitosamente', 
      id_muestra: id_muestra,
      id_resultado: resultadoResult.insertId 
    });
  } catch (error) {
    console.error('Error al registrar el análisis:', error.message);
    res.status(500).json({ message: 'Error al registrar el análisis' });
  }
});

// Obtener análisis de un animal específico
router.get('/animal/:id_animal', async (req, res) => {
  try {
    const { id_animal } = req.params;
    const [rows] = await db.query(`
      SELECT 
        m.id_muestra,
        a.nombre_animal,
        ta.nombre_analisis,
        r.resultado,
        r.fecha_emision,
        te.nombre_estado
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      JOIN tipo_estado te ON m.id_estado = te.id_tipo_estado
      WHERE a.id_animal = ?
    `, [id_animal]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener análisis del animal:', error.message);
    res.status(500).json({ message: 'Error al obtener análisis del animal' });
  }
});

// Actualizar un análisis por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_tipo_muestra, nombre_analisis, precio } = req.body;

    if (!id_tipo_muestra || !nombre_analisis || !precio) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios para actualizar' });
    }

    const [result] = await db.query(
      'UPDATE tipo_analisis SET id_tipo_muestra = ?, nombre_analisis = ?, precio = ? WHERE id_tipo_analisis = ?',
      [id_tipo_muestra, nombre_analisis, precio, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    res.json({ message: 'Análisis actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el análisis:', error.message);
    res.status(500).json({ message: 'Error al actualizar el análisis' });
  }
});

// Eliminar un análisis por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tipo_analisis WHERE id_tipo_analisis = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Análisis no encontrado' });
    }
    res.json({ message: 'Análisis eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el análisis:', error.message);
    res.status(500).json({ message: 'Error al eliminar el análisis' });
  }
});

// Obtener análisis por tipo de muestra
router.get('/muestra/:id_tipo_muestra', async (req, res) => {
  try {
    const { id_tipo_muestra } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM tipo_analisis WHERE id_tipo_muestra = ?',
      [id_tipo_muestra]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron análisis para este tipo de muestra' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener análisis por tipo de muestra:', error.message);
    res.status(500).json({ message: 'Error al obtener análisis por tipo de muestra' });
  }
});

// Obtener análisis por rango de fechas
router.get('/rango-fechas', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: 'Se deben proporcionar las fechas de inicio y fin' });
    }

    const [rows] = await db.query(`
      SELECT 
        m.id_muestra,
        a.nombre_animal,
        ta.nombre_analisis,
        r.resultado,
        r.fecha_emision
      FROM muestra m
      JOIN animal a ON m.id_animal = a.id_animal
      JOIN resultado r ON m.id_muestra = r.id_muestra
      JOIN tipo_analisis ta ON r.id_tipo_analisis = ta.id_tipo_analisis
      WHERE r.fecha_emision BETWEEN ? AND ?
    `, [fecha_inicio, fecha_fin]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron análisis en el rango de fechas especificado' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener análisis por rango de fechas:', error.message);
    res.status(500).json({ message: 'Error al obtener análisis por rango de fechas' });
  }
});

// Obtener tipos de muestra disponibles
router.get('/tipos-muestra/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tipo_muestra');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de muestra:', error.message);
    res.status(500).json({ message: 'Error al obtener tipos de muestra' });
  }
});

// Obtener estados disponibles
router.get('/estados/list', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tipo_estado');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estados:', error.message);
    res.status(500).json({ message: 'Error al obtener estados' });
  }
});

module.exports = router;
