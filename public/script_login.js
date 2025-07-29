
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Extraer los valores del formulario
    const correoElectronico = document.getElementById('correoElectronico').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
  
    // Validar si los campos están completos
    if (!correoElectronico || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // Crear objeto para enviar como JSON
    const data = {
      correoElectronico: correoElectronico,
      contrasena: contrasena,
    };
  
    // Realizar la solicitud de login al servidor usando fetch
    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Credenciales incorrectas');
        }
      })
      .then(data => {
        alert(data); // Mostrar mensaje de éxito
      })
      .catch(error => {
        alert(error.message); // Mostrar mensaje de error
      });
  });
  