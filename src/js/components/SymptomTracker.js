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
    <section class="symptom-tracker" role="main" aria-label="Seguimiento de Síntomas">
      <h2>Seguimiento de Síntomas</h2>
      <form id="sintomaForm" aria-label="Formulario de nuevo síntoma">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" name="fecha" required />
        <label for="tipo">Tipo de síntoma:</label>
        <input type="text" id="tipo" name="tipo" required />
        <label for="intensidad">Intensidad:</label>
        <select id="intensidad" name="intensidad" required aria-label="Intensidad del síntoma">
          <option value="">-- Selecciona --</option>
          <option value="leve">Leve</option>
          <option value="moderado">Moderado</option>
          <option value="severo">Severo</option>
        </select>
        <button type="submit">Agregar síntoma</button>
      </form>
      <div class="historial-sintomas" aria-label="Historial de síntomas">
        <!-- Aquí se renderiza el historial -->
      </div>
      <button id="exportarPDF" aria-label="Exportar historial a PDF">Exportar a PDF</button>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1em;">Volver</button>
    </section>
  `;
} 