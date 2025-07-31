export function Register() {
  setTimeout(() => {
    const form = document.getElementById('registerForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const nombre = form.querySelector('#nombre').value.trim();
        const apellido = form.querySelector('#apellido').value.trim();
        const alias = form.querySelector('#alias').value.trim();
        const edad = form.querySelector('#edad').value.trim();
        const sexo = form.querySelector('#sexo').value;
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;

        // Validaciones básicas
        if (!nombre || !apellido || !alias || !edad || !sexo || !email || !password) {
          alert('Todos los campos son obligatorios.');
          return;
        }
        
        if (!/^\d+$/.test(edad) || parseInt(edad) < 0) {
          alert('La edad debe ser un número válido.');
          return;
        }
        
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
          alert('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
          return;
        }

        // Verificar si el email ya está registrado
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const emailExiste = usuarios.some(user => user.email === email);
        
        if (emailExiste) {
          alert('Este correo electrónico ya está registrado.');
          return;
        }

        // Verificar si el alias ya está en uso
        const aliasExiste = usuarios.some(user => user.alias === alias);
        
        if (aliasExiste) {
          alert('Este alias ya está en uso. Elige otro.');
          return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
          id: Date.now().toString(),
          nombre,
          apellido,
          alias,
          edad: parseInt(edad),
          sexo,
          email,
          password, // En producción debería estar hasheada
          fechaRegistro: new Date().toISOString()
        };

        // Guardar en localStorage
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.hash = 'login';
      };
    }
  }, 0);

  return `
    <section class="register" role="main" aria-label="Registro de usuario">
      <h2>Registro</h2>
      <form id="registerForm" aria-label="Formulario de registro">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" autocomplete="given-name" required />
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" autocomplete="family-name" required />
        <label for="alias">Alias:</label>
        <input type="text" id="alias" name="alias" autocomplete="nickname" required />
        <div class="register-row">
          <div>
            <label for="edad">Edad:</label>
            <input type="number" id="edad" name="edad" min="0" autocomplete="bday-year" required />
          </div>
          <div>
            <label for="sexo">Sexo:</label>
            <select id="sexo" name="sexo" autocomplete="sex" required>
              <option value="">Selecciona...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>
        </div>
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" autocomplete="email" required />
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" autocomplete="new-password" required />
        <small>La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.</small>
        <button type="submit">Registrarse</button>
      </form>
      <button onclick="window.location.hash='welcome'">Volver</button>
    </section>
  `;
} 