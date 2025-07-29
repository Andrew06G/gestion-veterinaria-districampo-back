
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Genera un archivo PDF con los datos proporcionados.
 * @param {Object} data - Información para generar el PDF.
 * @param {string} outputPath - Ruta de salida del archivo PDF generado.
 */
const generatePDF = (data, outputPath) => {
    const doc = new PDFDocument();

    // Manejar errores al crear el archivo
    const stream = fs.createWriteStream(outputPath);
    stream.on('error', (err) => {
        console.error('Error al escribir el archivo PDF:', err);
    });

    // Guardar el PDF en el archivo especificado
    doc.pipe(stream);

    // Encabezado del PDF con logo
    doc.image('./public/images/VETERILAB.png', 50, 15, { width: 50 }) // Asegúrate de que la ruta sea correcta
        .fontSize(20)
        .text('Veterilab - Análisis de Resultados', 120, 30, {
            align: 'center',
        });
    doc.moveDown(2);

    // Información general
    doc.fontSize(12).text(`Nombre del cliente: ${data.cliente}`, { align: 'left' });
    doc.text(`Fecha de emisión: ${data.fecha}`, { align: 'left' });
    doc.text(`ID de la factura: ${data.facturaID}`, { align: 'left' });
    doc.moveDown(1.5);

    // Tabla de análisis
    doc.fontSize(14).text('Detalles del análisis:', { underline: true });
    doc.moveDown(0.5);

    data.analisis.forEach((item, index) => {
        doc.fontSize(12).text(
            `${index + 1}. Tipo de análisis: ${item.tipo}, Precio: ${item.precio}, Estado: ${item.estado}`
        );
    });

    // Pie de página
    doc.moveDown(2);
    doc.fontSize(10).text(
        'Gracias por confiar en Veterilab. Recibirá los resultados por correo electrónico.',
        { align: 'center' }
    );

    // Finalizar el documento
    doc.end();

    // Confirmar que el archivo fue creado exitosamente
    stream.on('finish', () => {
        console.log('Archivo PDF generado exitosamente:', outputPath);
    });
};

module.exports = generatePDF;
