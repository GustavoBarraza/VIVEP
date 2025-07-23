import { ThemeToggle } from './ThemeToggle.js';

export function Welcome() {
  return `
    ${ThemeToggle()}
    <section class="welcome">
      <div class="illustration">
        <svg width="100%" height="100%" viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="90" fill="#a259c6" opacity="0.15"/>
          <ellipse cx="90" cy="110" rx="60" ry="40" fill="#ff61a6" opacity="0.18"/>
          <circle cx="90" cy="80" r="40" fill="#f7b42c" opacity="0.7"/>
          <text x="50%" y="55%" text-anchor="middle" fill="#fff" font-size="2.2em" font-family="Poppins" dy=".3em">🤗</text>
        </svg>
      </div>
      <h1>¡Bienvenido a Vive+!</h1>
      <p>Recuerda que no estás solo, tu comunidad está contigo.</p>
      <button onclick="window.location.hash='register'">Comenzar</button>
    </section>
  `;
} 