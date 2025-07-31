const AVATARS = [
  "🦸‍♂️", "🦸‍♀️", "🧑‍🎤", "🧑‍🦱", "🧑‍🦰", "🧑‍🦳", "🧑‍🦲", "🧑‍🎨", "🧑‍🚀", "🧑‍⚕️"
];

export function Personalize() {
  setTimeout(() => {
    const form = document.getElementById('personalizeForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const alias = form.querySelector('input[name="alias"]').value.trim();
        const proximaToma = form.querySelector('input[name="proximaToma"]').value;
        const avatar = form.querySelector('input[name="avatar"]:checked')?.value || AVATARS[0];
        if (alias) localStorage.setItem('alias', alias);
        if (proximaToma) localStorage.setItem('proximaToma', proximaToma);
        if (avatar) localStorage.setItem('avatar', avatar);
        window.location.hash = 'dashboard';
      };
    }
  }, 0);

  const alias = localStorage.getItem('alias') || '';
  const proximaToma = localStorage.getItem('proximaToma') || '21:00';
  const avatar = localStorage.getItem('avatar') || AVATARS[0];

  return `
    <section class="personalize" role="main" aria-label="Personalización de perfil">
      <h2>Personaliza tu perfil</h2>
      <form id="personalizeForm" autocomplete="off" aria-label="Formulario de personalización">
        <label for="alias">Alias:</label>
        <input type="text" id="alias" name="alias" value="${alias}" required />
        <label for="proximaToma">Hora de próxima toma:</label>
        <input type="time" id="proximaToma" name="proximaToma" value="${proximaToma}" required />
        <label>Avatar:</label>
        <div class="avatar-list" role="radiogroup" aria-label="Selecciona un avatar">
          ${AVATARS.map((a, i) => `
            <label class="avatar-option">
              <input type="radio" name="avatar" value="${a}" id="avatar${i}" ${a === avatar ? 'checked' : ''} aria-checked="${a === avatar}" aria-label="Avatar ${i+1}" />
              <span class="avatar-emoji" aria-hidden="true">${a}</span>
            </label>
          `).join('')}
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1em;">Volver</button>
    </section>
  `;
} 