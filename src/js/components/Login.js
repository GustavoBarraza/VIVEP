export function Login() {
  setTimeout(() => {
    const form = document.getElementById('loginForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        
        const email = form.querySelector('#email').value.trim();
        const password = form.querySelector('#password').value;
        
        if (!email || !password) {
          alert('Por favor, completa todos los campos.');
          return;
        }

        // Buscar usuario en localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(user => user.email === email && user.password === password);
        
        if (usuario) {
          // Crear token de sesión
          const sessionToken = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            alias: usuario.alias,
            timestamp: Date.now()
          };
          
          // Guardar token de sesión
          localStorage.setItem('sessionToken', JSON.stringify(sessionToken));
          localStorage.setItem('currentUser', JSON.stringify(usuario));
          
          // Redirigir al dashboard
          window.location.hash = 'dashboard';
        } else {
          alert('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
      };
    }
  }, 0);

  return `
    <section class="login" role="main" aria-label="Inicio de sesión">
      <h2>Iniciar sesión</h2>
      <form id="loginForm" aria-label="Formulario de inicio de sesión">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" autocomplete="email" required />
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" autocomplete="current-password" required />
        <button type="submit">Entrar</button>
      </form>
      <button onclick="window.location.hash='register'" style="margin-top:1em;">¿No tienes cuenta? Regístrate</button>
    </section>
  `;
} 