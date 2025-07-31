const PALABRAS_PROHIBIDAS = ["malo", "ofensivo", "insulto"];
function contienePalabraProhibida(texto) {
  return PALABRAS_PROHIBIDAS.some(palabra =>
    texto.toLowerCase().includes(palabra)
  );
}

export function Chat() {
  setTimeout(() => {
    const form = document.getElementById('chatForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const input = form.querySelector('input[name="mensaje"]');
        const mensaje = input.value.trim();
        const MIN_INTERVALO_MS = 5000;
        const lastMsg = parseInt(localStorage.getItem('lastMsgTime') || '0', 10);
        const now = Date.now();
        if (now - lastMsg < MIN_INTERVALO_MS) {
          alert("Por favor, espera unos segundos antes de enviar otro mensaje.");
          return;
        }
        if (mensaje.length > 120) {
          alert("El mensaje es demasiado largo.");
          return;
        }
        if (contienePalabraProhibida(mensaje)) {
          alert("Tu mensaje contiene palabras no permitidas. Por favor, modifícalo.");
          return;
        }
        const lastMsgText = localStorage.getItem('lastMsgText') || '';
        if (mensaje === lastMsgText) {
          alert("No envíes el mismo mensaje repetido.");
          return;
        }
        localStorage.setItem('lastMsgTime', now);
        localStorage.setItem('lastMsgText', mensaje);
        const alias = localStorage.getItem('alias') || 'Anónimo';
        const avatar = localStorage.getItem('avatar') || "🦸‍♂️";
        // Mensaje guardado localmente:
        // db.ref('mensajes').push({ alias, avatar, mensaje, fecha: new Date().toISOString() });
        // Para demo local:
        const mensajes = JSON.parse(localStorage.getItem('mensajesChat') || '[]');
        mensajes.push({ alias, avatar, mensaje, fecha: new Date().toISOString() });
        localStorage.setItem('mensajesChat', JSON.stringify(mensajes));
        input.value = '';
        window.location.reload();
      };
    }
    document.querySelectorAll('.btn-reportar').forEach(btn => {
      btn.onclick = () => {
        alert("¡Gracias por reportar! El mensaje será revisado.");
      };
    });
  }, 0);

  const mensajes = JSON.parse(localStorage.getItem('mensajesChat') || '[]').slice(-30);

  return `
    <section class="chat" role="main" aria-label="Chat comunitario">
      <h2>Chat comunitario</h2>
      <div class="chat-mensajes" style="max-height:300px;overflow-y:auto;" role="log" aria-live="polite">
        ${mensajes.map((m, i) => `
          <div class="chat-mensaje" tabindex="0" aria-label="Mensaje de ${m.alias}">
            <span class="chat-avatar" aria-hidden="true">${m.avatar}</span>
            <span class="chat-alias">${m.alias}</span>
            <span class="chat-texto">${m.mensaje}</span>
            <button class="btn-reportar" data-idx="${i}" title="Reportar mensaje" aria-label="Reportar mensaje de ${m.alias}">🚩</button>
          </div>
        `).join('')}
      </div>
      <form id="chatForm" autocomplete="off" style="margin-top:1em;display:flex;gap:0.5em;" aria-label="Formulario de chat">
        <input type="text" name="mensaje" placeholder="Escribe tu mensaje..." required style="flex:1;" maxlength="120" aria-label="Mensaje"/>
        <button type="submit">Enviar</button>
      </form>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1em;">Volver</button>
    </section>
  `;
} 