function getContactoEmergencia() {
  return JSON.parse(localStorage.getItem('contactoEmergenciaVivePlus') || '{"nombre":"","telefono":"","mensaje":"Necesito ayuda, por favor contáctame"}');
}
function setContactoEmergencia(data) {
  localStorage.setItem('contactoEmergenciaVivePlus', JSON.stringify(data));
}

export function EmergencyMode() {
  setTimeout(() => {
    // Configuración de contacto
    const form = document.getElementById('emergenciaConfigForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const nombre = form.querySelector('input[name="nombre"]').value;
        const telefono = form.querySelector('input[name="telefono"]').value;
        const mensaje = form.querySelector('textarea[name="mensaje"]').value;
        setContactoEmergencia({ nombre, telefono, mensaje });
        alert('Contacto guardado');
        window.location.hash = 'dashboard';
      };
    }
    // Enviar mensaje (simulado)
    const btnSend = document.getElementById('enviarMensajeEmergencia');
    if (btnSend) {
      btnSend.onclick = () => {
        alert('Mensaje de emergencia enviado a tu contacto de confianza.');
      };
    }
  }, 0);

  const contacto = getContactoEmergencia();
  return `
    <section class="emergency-mode" role="main" aria-label="Modo Emergencia">
      <h2>🚨 Modo Emergencia</h2>
      
      <div class="emergency-content">
        <div class="card emergency-quick-actions">
          <h3>⚡ Opciones rápidas</h3>
          <div class="emergency-buttons">
            <button onclick="window.open('tel:8002322342')" class="btn-emergency-call">
              📞 Llamar a Línea VIH Nacional
            </button>
            <button id="enviarMensajeEmergencia" class="btn-emergency-message" aria-label="Enviar mensaje de emergencia">
              💬 Enviar mensaje a contacto de confianza
            </button>
          </div>
        </div>
        
        <div class="card emergency-config">
          <h3>⚙️ Configura tu contacto de confianza</h3>
          <form id="emergenciaConfigForm" autocomplete="off" aria-label="Configuración de emergencia">
            <div class="form-group">
              <label>Nombre:</label>
              <input type="text" name="nombre" value="${contacto.nombre}" required />
            </div>
            <div class="form-group">
              <label>Teléfono:</label>
              <input type="tel" name="telefono" value="${contacto.telefono}" required />
            </div>
            <div class="form-group">
              <label>Mensaje:</label>
              <textarea name="mensaje" rows="3" required>${contacto.mensaje}</textarea>
            </div>
            <button type="submit" class="btn-save-contact">💾 Guardar contacto</button>
          </form>
        </div>
      </div>
      
      <button onclick="window.location.hash='dashboard'" class="btn-back">← Volver al Dashboard</button>
    </section>
  `;
}

// Botón flotante global
export function EmergencyButton() {
  // Solo mostrar si no está en welcome/register
  if (["#welcome", "#register"].includes(window.location.hash)) return '';
  return `<button class="emergency-fab" onclick="window.location.hash='emergency'" title="Modo Emergencia">🚨</button>`;
} 