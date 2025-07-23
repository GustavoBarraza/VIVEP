import { ThemeToggle } from './ThemeToggle.js';

function getAlias() {
  return localStorage.getItem('alias') || 'Amigx';
}
function getAvatar() {
  return localStorage.getItem('avatar') || "🦸‍♂️";
}
function getProximaToma() {
  return localStorage.getItem('proximaToma') || '21:00';
}
function getAdherenciaDias() {
  const data = JSON.parse(localStorage.getItem('adherencia') || '[]');
  const hoy = new Date();
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const fecha = d.toISOString().slice(0, 10);
    dias.push({
      fecha,
      tomada: data.includes(fecha),
      nombre: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')
    });
  }
  return dias;
}

// Nuevo: obtener mensaje motivacional desde JSON
function getMotivacionalDelDiaAsync(cb) {
  fetch('src/data/messages.json')
    .then(res => res.json())
    .then(frases => {
      const dia = new Date().getDay();
      cb(frases[dia % frases.length]);
    })
    .catch(() => {
      cb("¡Hoy es un gran día para cuidarte!");
    });
}

export function Dashboard() {
  const alias = getAlias();
  const avatar = getAvatar();
  const proximaToma = getProximaToma();
  const dias = getAdherenciaDias();
  const adherencia = Math.round((dias.filter(d => d.tomada).length / 7) * 100);

  setTimeout(() => {
    const btn = document.querySelector('.btn-tomar');
    if (btn) {
      btn.onclick = () => {
        const data = JSON.parse(localStorage.getItem('adherencia') || '[]');
        const hoy = new Date().toISOString().slice(0, 10);
        if (!data.includes(hoy)) {
          data.push(hoy);
          localStorage.setItem('adherencia', JSON.stringify(data));
          window.location.reload();
        }
      };
    }
    // Mostrar mensaje motivacional desde JSON
    const motivacionalP = document.querySelector('.card.motivacional p');
    if (motivacionalP) {
      getMotivacionalDelDiaAsync(msg => {
        motivacionalP.textContent = msg;
      });
    }
  }, 0);

  // Mensaje motivacional se rellena por JS tras render
  return `
    ${ThemeToggle()}
    <section class="dashboard">
      <div style="display:flex;align-items:center;justify-content:center;gap:0.5em;">
        <span style="font-size:2em;">${avatar}</span>
        <h2>Hola <span class="alias">${alias}</span> 👋</h2>
      </div>
      <p class="mensaje-apoyo">Recuerda que no estás solo, tu comunidad está contigo.</p>
      <div class="card recordatorio">
        <h3>💊 Próxima medicación</h3>
        <p>Hora: <strong>${proximaToma}</strong></p>
        <button class="btn-tomar">¡Ya la tomé!</button>
      </div>
      <div class="card motivacional">
        <h3>✨ Mensaje del día</h3>
        <p>Cargando mensaje...</p>
      </div>
      <div class="card adherencia">
        <h3>📈 Adherencia semanal</h3>
        <div class="dias-adherencia">
          ${dias.map(d => `
            <div class="dia${d.tomada ? ' tomada' : ''}">
              <span>${d.nombre[0].toUpperCase()}</span>
              <div class="circulo"></div>
            </div>
          `).join('')}
        </div>
        <p>${adherencia}% de tomas registradas</p>
      </div>
      <div class="acciones">
        <button class="btn-chat" onclick="window.location.hash='chat'">Ir al chat comunitario</button>
        <button class="btn-personalizar" onclick="window.location.hash='personalize'">Personalizar</button>
        <button class="btn-medic-safety" onclick="window.location.hash='medic-safety'">Seguridad de Medicamentos</button>
        <button class="btn-symptoms" onclick="window.location.hash='symptoms'">Seguimiento de Síntomas</button>
        <button class="btn-appointments" onclick="window.location.hash='appointments'">Agenda de Citas</button>
        <button class="btn-privacy" onclick="window.location.hash='privacy'">Modo Privacidad</button>
      </div>
    </section>
  `;
} 