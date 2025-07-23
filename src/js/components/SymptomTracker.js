// Síntomas comunes (puedes agregar más)
const SINTOMAS = [
  "Náusea", "Fiebre", "Mareo", "Erupciones cutáneas", "Dolor de cabeza", "Fatiga", "Dolor muscular", "Diarrea"
];
const INTENSIDADES = ["Leve", "Moderado", "Severo"];

function guardarSintoma(registro) {
  const data = JSON.parse(localStorage.getItem('sintomasVivePlus') || '[]');
  data.push(registro);
  localStorage.setItem('sintomasVivePlus', JSON.stringify(data));
}

function obtenerSintomas() {
  return JSON.parse(localStorage.getItem('sintomasVivePlus') || '[]');
}

function sintomasPorDia(dias) {
  const hoy = new Date();
  const res = [];
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const fecha = d.toISOString().slice(0, 10);
    res.push({
      fecha,
      sintomas: obtenerSintomas().filter(s => s.fecha === fecha)
    });
  }
  return res;
}

function alertaSintomaPersistente() {
  const data = obtenerSintomas();
  const hoy = new Date();
  const ultimos3 = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    ultimos3.push(d.toISOString().slice(0, 10));
  }
  const sintomasRepetidos = {};
  data.forEach(s => {
    if (ultimos3.includes(s.fecha)) {
      sintomasRepetidos[s.sintoma] = (sintomasRepetidos[s.sintoma] || 0) + 1;
    }
  });
  return Object.keys(sintomasRepetidos).filter(s => sintomasRepetidos[s] >= 3);
}

function exportarPDF() {
  const data = obtenerSintomas();
  let texto = 'Fecha,Síntoma,Intensidad,Notas\n';
  data.forEach(s => {
    texto += `${s.fecha},${s.sintoma},${s.intensidad},${s.notas || ''}\n`;
  });
  const blob = new Blob([texto], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sintomas_viveplus.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function SymptomTracker() {
  setTimeout(() => {
    const form = document.getElementById('sintomaForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const sintoma = form.querySelector('select[name="sintoma"]').value;
        const intensidad = form.querySelector('select[name="intensidad"]').value;
        const notas = form.querySelector('textarea[name="notas"]').value;
        const fecha = new Date().toISOString().slice(0, 10);
        guardarSintoma({ fecha, sintoma, intensidad, notas });
        window.location.reload();
      };
    }
    const btnPDF = document.getElementById('exportarPDF');
    if (btnPDF) btnPDF.onclick = exportarPDF;
  }, 0);

  // Historial gráfico semanal
  const semana = sintomasPorDia(7);
  const mes = sintomasPorDia(30);
  const alerta = alertaSintomaPersistente();

  return `
    <section class="symptom-tracker">
      <h2>Seguimiento de Síntomas</h2>
      <form id="sintomaForm" autocomplete="off" class="card">
        <label>Síntoma:</label>
        <select name="sintoma" required>
          <option value="">Selecciona...</option>
          ${SINTOMAS.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <label>Intensidad:</label>
        <select name="intensidad" required>
          <option value="">Selecciona...</option>
          ${INTENSIDADES.map(i => `<option value="${i}">${i}</option>`).join('')}
        </select>
        <label>Notas (opcional):</label>
        <textarea name="notas" rows="2" style="border-radius:1em;padding:0.5em;"></textarea>
        <button type="submit">Registrar</button>
      </form>
      <div class="card" style="margin-top:1.2em;">
        <h3>Historial semanal</h3>
        <div class="historial-grafico">
          ${semana.map(d => `
            <div class="dia-historial">
              <span class="fecha-historial">${d.fecha.slice(5)}</span>
              <div class="barras-sintomas">
                ${d.sintomas.map(s => `<span class="barra barra-${s.intensidad.toLowerCase()}">${s.sintoma[0]}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <button id="exportarPDF" style="margin-top:1em;">Exportar reporte (.csv)</button>
      </div>
      <div class="card" style="margin-top:1.2em;">
        <h3>Historial mensual</h3>
        <div class="historial-grafico">
          ${mes.map(d => `
            <div class="dia-historial-mes">
              <span class="fecha-historial">${d.fecha.slice(5)}</span>
              <div class="barras-sintomas">
                ${d.sintomas.map(s => `<span class="barra barra-${s.intensidad.toLowerCase()}">${s.sintoma[0]}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ${alerta.length > 0 ? `<div class="alerta-sintoma">⚠️ Si este síntoma persiste más de 3 días, consulta a tu médico: <b>${alerta.join(', ')}</b></div>` : ''}
      <button onclick="window.location.hash='dashboard'" style="margin-top:1.5em;">Volver</button>
    </section>
  `;
} 