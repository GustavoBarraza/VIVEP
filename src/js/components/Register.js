export function Register() {
  setTimeout(() => {
    const form = document.getElementById('registerForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const alias = form.querySelector('input[type="text"]').value.trim();
        const password = form.querySelector('input[type="password"]').value;
        const proximaToma = "21:00";
        localStorage.setItem('alias', alias);
        localStorage.setItem('proximaToma', proximaToma);
        localStorage.setItem('adherencia', JSON.stringify([]));
        window.location.hash = 'dashboard';
      };
    }
  }, 0);

  return `
    <section class="register">
      <div class="illustration">
        <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="90" fill="#ff61a6" opacity="0.12"/>
          <ellipse cx="90" cy="110" rx="60" ry="40" fill="#a259c6" opacity="0.15"/>
          <circle cx="90" cy="80" r="40" fill="#f7b42c" opacity="0.5"/>
          <text x="50%" y="55%" text-anchor="middle" fill="#fff" font-size="2.2em" font-family="Poppins" dy=".3em">🦸‍♂️</text>
        </svg>
      </div>
      <h2>Registro anónimo</h2>
      <form id="registerForm" autocomplete="off">
        <input type="text" placeholder="Alias" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
    </section>
  `;
} 