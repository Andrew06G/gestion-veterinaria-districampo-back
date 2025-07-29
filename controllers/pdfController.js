
const db = require('../config/db');
const PDFDocument = require('pdfkit');

// Generar PDF para un análisis específico
exports.generateAnalysisPDF = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      r.id_resultado, 
      a.nombre AS animal_nombre, 
      t.nombre_analisis, 
      r.resultado, 
      r.fecha_emision 
    FROM resultado r
    JOIN muestra m ON r.id_muestra = m.id_muestra
    JOIN animal a ON m.id_animal = a.id_animal
    JOIN tipo_analisis t ON m.id_tipo_analisis = t.id_tipo_analisis
    WHERE r.id_resultado = ?;
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'No analysis found' });

    const analysis = results[0];
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=analysis_${id}.pdf`);

    doc.pipe(res);

    // Crear contenido del PDF
    doc.fontSize(20).text('Analysis Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Animal Name: ${analysis.animal_nombre}`);
    doc.text(`Analysis Type: ${analysis.nombre_analisis}`);
    doc.text(`Result: ${analysis.resultado}`);
    doc.text(`Date of Emission: ${analysis.fecha_emision}`);
    doc.end();
  });
};
