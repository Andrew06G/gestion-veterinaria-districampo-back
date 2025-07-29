
const db = require('../config/db');

// Obtener todos los análisis
exports.getAllAnalysis = (req, res) => {
  const query = `
    SELECT 
      m.id_muestra,
      a.id_animal,
      a.nombre AS animal_nombre,
      t.nombre_analisis,
      m.fecha_toma,
      m.estado
    FROM muestra m
    JOIN animal a ON m.id_animal = a.id_animal
    JOIN tipo_analisis t ON m.id_tipo_analisis = t.id_tipo_analisis;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Crear un análisis (muestra)
exports.createAnalysis = (req, res) => {
  const { id_animal, id_tipo_analisis, fecha_toma, estado } = req.body;
  const query = `
    INSERT INTO muestra (id_animal, id_tipo_analisis, fecha_toma, estado) 
    VALUES (?, ?, ?, ?);
  `;
  db.query(query, [id_animal, id_tipo_analisis, fecha_toma, estado], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Analysis created successfully', id: result.insertId });
  });
};

// Actualizar un análisis
exports.updateAnalysis = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const query = `
    UPDATE muestra SET estado = ? WHERE id_muestra = ?;
  `;
  db.query(query, [estado, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Analysis updated successfully' });
  });
};

// Eliminar un análisis
exports.deleteAnalysis = (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM muestra WHERE id_muestra = ?;
  `;
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Analysis deleted successfully' });
  });
};

// Obtener análisis pendientes
exports.getPendingAnalysis = (req, res) => {
  const query = `
    SELECT 
      m.id_muestra,
      a.id_animal,
      a.nombre AS animal_nombre,
      t.nombre_analisis,
      m.fecha_toma,
      m.estado
    FROM muestra m
    JOIN animal a ON m.id_animal = a.id_animal
    JOIN tipo_analisis t ON m.id_tipo_analisis = t.id_tipo_analisis
    WHERE m.estado = 'Pendiente';
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Agregar resultado al análisis
exports.addAnalysisResult = (req, res) => {
  const { id_muestra, resultado, fecha_emision } = req.body;
  const query = `
    INSERT INTO resultado (id_muestra, resultado, fecha_emision)
    VALUES (?, ?, ?);
  `;
  db.query(query, [id_muestra, resultado, fecha_emision], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Result added successfully', id: result.insertId });
  });
};
