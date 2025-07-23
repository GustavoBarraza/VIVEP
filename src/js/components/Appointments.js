const TIPOS_CITA = ["Médico", "Examen", "Farmacia", "Otro"];

function guardarCita(cita) {
  const data = JSON.parse(localStorage.getItem('citasVivePlus') || '[]');
  data.push(cita);
  localStorage.setItem('citasVivePlus', JSON.stringify(data));
}
function obtenerCitas() {
  return JSON.parse(localStorage.getItem('citasVivePlus') || '[]');
}
function eliminarCita(idx) {
  const data = obtenerCitas();
  data.splice(idx, 1);
  localStorage.setItem('citasVivePlus', JSON.stringify(data));
}
function editarCita(idx, cita) {
  const data = obtenerCitas();
  data[idx] = cita;
  localStorage.setItem('citasVivePlus', JSON.stringify(data));
}

function programarNotificacionesCitas() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const citas = obtenerCitas();
  const ahora = Date.now();
  citas.forEach(cita => {
    const fecha = new Date(cita.fecha + 'T' + cita.hora);
    const ms24h = fecha - ahora - 24 * 60 * 60 * 1000;
    const ms1h = fecha - ahora - 1 * 60 * 60 * 1000;
    if (ms24h > 0) setTimeout(() => {
      new Notification('Recordatorio de cita', { body: `Tienes una cita (${cita.tipo}) mañana a las ${cita.hora}` });
    }, ms24h);
    if (ms1h > 0) setTimeout(() => {
      new Notification('Recordatorio de cita', { body: `Tienes una cita (${cita.tipo}) en 1 hora a las ${cita.hora}` });
    }, ms1h);
  });
}

export function Appointments() {
  setTimeout(() => {
    const form = document.getElementById('citaForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const fecha = form.querySelector('input[name="fecha"]').value;
        const hora = form.querySelector('input[name="hora"]').value;
        const tipo = form.querySelector('select[name="tipo"]').value;
        if (!fecha || !hora || !tipo) return;
        guardarCita({ fecha, hora, tipo });
        form.reset();
        window.location.reload();
      };
    }
    document.querySelectorAll('.btn-del-cita').forEach(btn => {
      btn.onclick = () => {
        eliminarCita(Number(btn.getAttribute('data-idx')));
        window.location.reload();
      };
    });
    document.querySelectorAll('.btn-edit-cita').forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.getAttribute('data-idx'));
        const data = obtenerCitas()[idx];
        const nuevaFecha = prompt('Editar fecha (YYYY-MM-DD):', data.fecha);
        const nuevaHora = prompt('Editar hora (HH:MM):', data.hora);
        const nuevoTipo = prompt('Editar tipo:', data.tipo);
        if (nuevaFecha && nuevaHora && nuevoTipo) {
          editarCita(idx, { fecha: nuevaFecha, hora: nuevaHora, tipo: nuevoTipo });
          window.location.reload();
        }
      };
    });
    programarNotificacionesCitas();
  }, 0);

  const citas = obtenerCitas().sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const ahora = new Date();
  const futuras = citas.filter(c => new Date(c.fecha + 'T' + c.hora) >= ahora);
  const pasadas = citas.filter(c => new Date(c.fecha + 'T' + c.hora) < ahora);

  return `
    <section class="appointments">
      <h2>Agenda de Citas</h2>
      <form id="citaForm" class="card" style="margin-bottom:1em;">
        <label>Fecha:</label>
        <input type="date" name="fecha" required />
        <label>Hora:</label>
        <input type="time" name="hora" required />
        <label>Tipo:</label>
        <select name="tipo" required>
          <option value="">Selecciona...</option>
          ${TIPOS_CITA.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
        <button type="submit">Agregar cita</button>
      </form>
      <div class="card">
        <h3>Próximas citas</h3>
        ${futuras.length === 0 ? '<p>No hay citas próximas.</p>' : futuras.map((c, i) => `
          <div class="cita-item">
            <span>📅 ${c.fecha} ⏰ ${c.hora} (${c.tipo})</span>
            <button class="btn-edit-cita" data-idx="${citas.indexOf(c)}" title="Editar">✏️</button>
            <button class="btn-del-cita" data-idx="${citas.indexOf(c)}" title="Eliminar">🗑️</button>
          </div>
        `).join('')}
      </div>
      <div class="card" style="margin-top:1em;">
        <h3>Citas pasadas</h3>
        ${pasadas.length === 0 ? '<p>No hay citas pasadas.</p>' : pasadas.map((c, i) => `
          <div class="cita-item">
            <span>📅 ${c.fecha} ⏰ ${c.hora} (${c.tipo})</span>
          </div>
        `).join('')}
      </div>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1.5em;">Volver</button>
    </section>
  `;
} 