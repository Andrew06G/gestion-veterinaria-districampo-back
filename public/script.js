
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const numeroIdentificacion = document.getElementById('numeroIdentificacion').value.trim();
    const correoElectronico = document.getElementById('correoElectronico').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    if (!nombre || !apellidos || !numeroIdentificacion || !correoElectronico || !telefono || !direccion || !contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    if (contrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.submit();
});