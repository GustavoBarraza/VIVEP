import { ThemeToggle } from './ThemeToggle.js';

export function Welcome() {
  return `
    ${ThemeToggle()}
    <section class="welcome" role="main" aria-label="Pantalla de bienvenida">
      <h1>Bienvenido a Vive+</h1>
      <p>Tu app de apoyo, comunidad y salud.</p>
      <button onclick="window.location.hash='register'" aria-label="Comenzar registro">Comenzar</button>
    </section>
  `;
} 