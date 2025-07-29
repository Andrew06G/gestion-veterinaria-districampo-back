
const express = require('express');
const generatePDF = require('../utils/pdf'); // Importa la función para generar PDFs
const path = require('path');
const fs = require('fs'); // Para manejar la eliminación del archivo temporal
const pdfController = require('../controllers/pdfController'); // Controlador adicional para generación de PDF

const router = express.Router();

// Ruta para generar un PDF desde datos enviados en el cuerpo de la solicitud
router.post('/generate-pdf', async (req, res) => {
  const data = req.body;

  // Ruta donde se almacenará temporalmente el PDF
  const outputPath = path.join(__dirname, '../pdfs', 'resultado.pdf');

  try {
    // Generar el PDF
    await generatePDF(data, outputPath);

    // Esperar a que el archivo se cree y enviarlo como respuesta
    res.download(outputPath, 'resultado.pdf', (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        return res.status(500).send('Error al enviar el PDF.');
      }

      console.log('Archivo enviado exitosamente.');

      // Eliminar el archivo después de enviarlo
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error al eliminar el archivo temporal:', unlinkErr);
        } else {
          console.log('Archivo temporal eliminado.');
        }
      });
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF.');
  }
});

// Ruta para generar un PDF de resultados de análisis basado en un ID
router.get('/analysis/:id', pdfController.generateAnalysisPDF);

module.exports = router;
