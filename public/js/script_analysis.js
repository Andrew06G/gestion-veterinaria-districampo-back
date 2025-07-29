
// Evento para manejar el envío del formulario de análisis
document.querySelector('#analysisForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const animalId = document.querySelector('#id_animal').value;
    const analysisType = document.querySelector('#id_tipo_analisis').value;
    const date = document.querySelector('#fecha_toma').value;
  
    // Validación de campos vacíos
    if (!animalId || !analysisType || !date) {
      alert('Please complete all the fields before submitting.');
      return; // Evitar continuar si algún campo está vacío
    }
  
    // Construir datos para enviar
    const data = {
      id_animal: animalId,
      id_tipo_analisis: analysisType,
      fecha_toma: date,
      estado: 'Pendiente' // Estado inicial por defecto
    };
  
    // Enviar los datos al servidor
    fetch('/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(errorText);
          });
        }
        return response.json();
      })
      .then((result) => {
        alert('Analysis submitted successfully!');
        console.log(result);
        // Limpiar el formulario después de un envío exitoso
        document.querySelector('#analysisForm').reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the analysis. Please try again.');
      });
  });
  