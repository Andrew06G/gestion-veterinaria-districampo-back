
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const animalForm = document.getElementById('animalForm');
  const loginForm = document.getElementById('loginForm');

  // Funciones de Validación
  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  function isValidPhoneNumber(phone) {
    const phonePattern = /^[0-9]{7,10}$/;
    return phonePattern.test(phone);
  }

  function isValidText(input) {
    const textPattern = /^[a-zA-Z\s]+$/;
    return textPattern.test(input);
  }

  function showAlert(message) {
    alert(message);
  }

  // Registro de Usuario
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nombres = document.getElementById('nombres').value;
      const apellidos = document.getElementById('apellidos').value;
      const correo_electronico = document.getElementById('correo_electronico').value;
      const telefono = document.getElementById('telefono').value;
      const direccion = document.getElementById('direccion').value;
      const contrasena = document.getElementById('contrasena').value;

      if (!isValidText(nombres) || !isValidText(apellidos)) {
        showAlert('Los nombres y apellidos solo deben contener letras y espacios.');
        return;
      }

      if (!isValidEmail(correo_electronico)) {
        showAlert('Ingrese un correo electrónico válido.');
        return;
      }

      if (!isValidPhoneNumber(telefono)) {
        showAlert('Ingrese un número de teléfono válido (7 a 10 dígitos).');
        return;
      }

      if (contrasena.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombres, apellidos, correo_electronico, telefono, direccion, contrasena })
        });

        if (response.ok) {
          alert('Usuario registrado exitosamente');
          registerForm.reset();
        } else {
          const errorText = await response.text();
          alert('Error: ' + errorText);
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar el usuario');
      }
    });
  }

  // Inicio de Sesión
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const correo_electronico = document.getElementById('correoElectronico').value;
      const contrasena = document.getElementById('contrasena').value;

      if (!isValidEmail(correo_electronico)) {
        showAlert('Ingrese un correo electrónico válido.');
        return;
      }

      if (contrasena.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo_electronico, contrasena })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          alert('Inicio de sesión exitoso');
          window.location.href = 'animals.html';
        } else {
          const errorText = await response.text();
          alert('Error: ' + errorText);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión');
      }
    });
  }

  // Registro de Animal
  if (animalForm) {
    animalForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const d_propietario = document.getElementById('d_propietario').value;
      const nombre = document.getElementById('nombre').value;
      const edad = document.getElementById('edad').value;
      const raza = document.getElementById('raza').value;

      if (!isValidText(nombre) || !isValidText(raza)) {
        showAlert('El nombre del animal y la raza solo deben contener letras y espacios.');
        return;
      }

      if (isNaN(edad) || edad <= 0) {
        showAlert('La edad debe ser un número positivo.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3002/api/animals/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dPropietario: d_propietario, nombre, edad, raza })
        });

        if (response.ok) {
          alert('Animal registrado exitosamente');
          animalForm.reset();
          listAnimals();
        } else {
          const errorText = await response.text();
          alert('Error: ' + errorText);
        }
      } catch (error) {
        console.error('Error al registrar animal:', error);
        alert('Error al registrar el animal');
      }
    });
  }

  // Listar Animales
  async function listAnimals() {
    try {
      const response = await fetch('http://localhost:3002/api/animals');
      if (response.ok) {
        const animals = await response.json();
        const animalListDiv = document.getElementById('animalList');
        animalListDiv.innerHTML = '';

        animals.forEach(animal => {
          animalListDiv.innerHTML += `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">${animal.nombre}</h5>
                <p class="card-text">Edad: ${animal.edad}</p>
                <p class="card-text">Raza: ${animal.raza}</p>
                <p class="card-text">ID del Propietario: ${animal.d_propietario}</p>
                <button onclick="editAnimal(${animal.id_animal})" class="btn btn-warning">Editar</button>
                <button onclick="deleteAnimal(${animal.id_animal})" class="btn btn-danger">Eliminar</button>
              </div>
            </div>
          `;
        });
      } else {
        console.error('Error al obtener los animales');
      }
    } catch (error) {
      console.error('Error al obtener los animales:', error);
    }
  }

  // Verificar Autenticación
  if (document.getElementById('animalList')) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe iniciar sesión para acceder a esta página');
      window.location.href = 'login.html';
    } else {
      listAnimals();
    }
  }

  // Generar PDF
  const generatePDFButton = document.createElement('button');
  generatePDFButton.className = 'generate-pdf-btn';
  generatePDFButton.textContent = 'Generar PDF';
  document.body.appendChild(generatePDFButton);

  generatePDFButton.addEventListener('click', () => {
    fetch('http://localhost:3002/api/pdf/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Generando un reporte PDF' })
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Reporte_Veterilab.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error al generar el PDF:', error);
      });
  });
});
