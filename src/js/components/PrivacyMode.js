function getPinPrivacidad() {
  return localStorage.getItem('pinPrivacidadVivePlus') || '';
}
function setPinPrivacidad(pin) {
  localStorage.setItem('pinPrivacidadVivePlus', pin);
}

export function PrivacyMode() {
  setTimeout(() => {
    const form = document.getElementById('pinPrivacidadForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const pin = form.querySelector('input[name="pin"]').value;
        setPinPrivacidad(pin);
        alert('PIN guardado');
        window.location.hash = 'dashboard';
      };
    }
    const formUnlock = document.getElementById('pinUnlockForm');
    if (formUnlock) {
      formUnlock.onsubmit = (e) => {
        e.preventDefault();
        const pin = formUnlock.querySelector('input[name="pin"]').value;
        if (pin === getPinPrivacidad()) {
          localStorage.setItem('privacidadActivaVivePlus', '0');
          window.location.hash = 'dashboard';
        } else {
          alert('PIN incorrecto');
        }
      };
    }
  }, 0);

  const pin = getPinPrivacidad();
  const privacidadActiva = localStorage.getItem('privacidadActivaVivePlus') === '1';

  if (privacidadActiva) {
    // Pantalla genérica (ejemplo: notas)
    return `
      <section class="privacy-mode" style="animation:fadeIn 0.5s;">
        <h2>Notas</h2>
        <textarea style="width:100%;height:200px;border-radius:1em;padding:1em;"></textarea>
        <form id="pinUnlockForm" style="margin-top:2em;">
          <label>Ingresa tu PIN para volver:</label>
          <input type="password" name="pin" required style="border-radius:1em;padding:0.7em;" />
          <button type="submit">Desbloquear</button>
        </form>
      </section>
    `;
  }

  // Configuración de PIN
  return `
    <section class="privacy-mode" role="main" aria-label="Modo Privacidad">
      <h2>Modo Privacidad</h2>
      <form id="pinPrivacidadForm" aria-label="Configurar PIN de privacidad">
        <label for="pin">PIN:</label>
        <input type="password" id="pin" name="pin" required />
        <button type="submit">Guardar PIN</button>
      </form>
      <form id="pinUnlockForm" aria-label="Desbloquear privacidad">
        <label for="pinUnlock">PIN:</label>
        <input type="password" id="pinUnlock" name="pinUnlock" required />
        <button type="submit">Desbloquear</button>
      </form>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1em;">Volver</button>
    </section>
  `;
}

export function PrivacyButton() {
  // Solo mostrar si no está en welcome/register
  if (["#welcome", "#register"].includes(window.location.hash)) return '';
  return `<button class="privacy-fab" onclick="activarPrivacidad()" title="Modo Privacidad">🕶️</button>
  <script>function activarPrivacidad(){localStorage.setItem('privacidadActivaVivePlus','1');window.location.hash='privacy';}</script>`;
} 