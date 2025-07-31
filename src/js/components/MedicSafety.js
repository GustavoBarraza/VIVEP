// Datos iniciales de medicamentos conocidos
const MEDICAMENTOS_BASE = [
  {
    nombre: "Efavirenz",
    interacciones: [
      "Hierba de San Juan",
      "Anticonvulsivos como Fenitoína o Carbamazepina"
    ],
    conservacion: "Conservar a temperatura ambiente."
  },
  {
    nombre: "Dolutegravir",
    interacciones: [
      "Antiácidos de aluminio/magnesio (no combinar)",
      "Separar suplementos de hierro y calcio 2 horas antes o después"
    ],
    conservacion: "Conservar a temperatura ambiente."
  },
  {
    nombre: "Tenofovir",
    interacciones: [
      "AINEs en dosis altas (evitar uso simultáneo)",
      "Didanosina"
    ],
    conservacion: "Mantener en lugar fresco y seco."
  },
  {
    nombre: "Lopinavir/Ritonavir",
    interacciones: [
      "Anticonceptivos orales con etinilestradiol (puede reducir eficacia)",
      "Rifampicina"
    ],
    conservacion: "Conservar refrigerado antes de abrir y 2 semanas a temperatura ambiente después de abierto."
  }
];

function getMedicamento(nombre) {
  return MEDICAMENTOS_BASE.find(m => m.nombre.toLowerCase() === nombre.toLowerCase());
}

function getMisMedicamentos() {
  return JSON.parse(localStorage.getItem('misMedicamentosVivePlus') || '[]');
}
function setMisMedicamentos(arr) {
  localStorage.setItem('misMedicamentosVivePlus', JSON.stringify(arr));
}

function analizarInteracciones(misMeds) {
  // Agrupa advertencias cruzadas y externas
  let advertencias = [];
  let advertenciasExternas = [];
  let advertenciasEntreMeds = [];
  // Interacciones cruzadas simples (ejemplo)
  const cruzadas = [
    ["Efavirenz", "Lopinavir/Ritonavir", "Aumenta riesgo de efectos secundarios"],
    ["Dolutegravir", "Tenofovir", "Puede alterar niveles plasmáticos"],
    // Puedes agregar más reglas cruzadas aquí
  ];
  // Analiza interacciones cruzadas
  for (let i = 0; i < misMeds.length; i++) {
    for (let j = i + 1; j < misMeds.length; j++) {
      cruzadas.forEach(([a, b, msg]) => {
        if ((misMeds[i].nombre === a && misMeds[j].nombre === b) || (misMeds[i].nombre === b && misMeds[j].nombre === a)) {
          advertenciasEntreMeds.push(`Entre ${a} y ${b}: ${msg}`);
        }
      });
    }
  }
  // Interacciones externas
  misMeds.forEach(med => {
    const base = getMedicamento(med.nombre);
    if (base && base.interacciones) {
      base.interacciones.forEach(i => advertenciasExternas.push(`${med.nombre}: ${i}`));
    }
  });
  advertencias = advertenciasEntreMeds.concat(advertenciasExternas);
  return advertencias;
}

function resumenConservacion(misMeds) {
  let refrigeracion = 0, ambiente = 0, seco = 0;
  misMeds.forEach(med => {
    const base = getMedicamento(med.nombre);
    if (base) {
      if (base.conservacion.toLowerCase().includes('refriger')) refrigeracion++;
      if (base.conservacion.toLowerCase().includes('seco')) seco++;
      if (base.conservacion.toLowerCase().includes('ambiente')) ambiente++;
    }
  });
  return { refrigeracion, ambiente, seco };
}

export function MedicSafety() {
  setTimeout(() => {
    // Agregar medicamento
    const form = document.getElementById('medicamentoFormMulti');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const select = form.querySelector('select');
        const input = form.querySelector('input[type="text"]');
        const nombre = (input.value || select.value).trim();
        if (!nombre) return;
        let misMeds = getMisMedicamentos();
        if (!misMeds.find(m => m.nombre.toLowerCase() === nombre.toLowerCase())) {
          misMeds.push({ nombre });
          setMisMedicamentos(misMeds);
          form.reset();
          window.location.reload();
        }
      };
    }
    // Eliminar medicamento
    document.querySelectorAll('.btn-del-med').forEach(btn => {
      btn.onclick = () => {
        const nombre = btn.getAttribute('data-nombre');
        let misMeds = getMisMedicamentos();
        misMeds = misMeds.filter(m => m.nombre !== nombre);
        setMisMedicamentos(misMeds);
        window.location.reload();
      };
    });
    // Editar medicamento (solo nombre, para demo)
    document.querySelectorAll('.btn-edit-med').forEach(btn => {
      btn.onclick = () => {
        const nombre = btn.getAttribute('data-nombre');
        const nuevo = prompt('Editar nombre del medicamento:', nombre);
        if (nuevo && nuevo !== nombre) {
          let misMeds = getMisMedicamentos();
          const idx = misMeds.findIndex(m => m.nombre === nombre);
          if (idx !== -1) {
            misMeds[idx].nombre = nuevo;
            setMisMedicamentos(misMeds);
            window.location.reload();
          }
        }
      };
    });
  }, 0);

  const misMeds = getMisMedicamentos();
  const advertencias = analizarInteracciones(misMeds);
  const resumen = resumenConservacion(misMeds);

  return `
    <section class="medic-safety" role="main" aria-label="Seguridad de Medicamentos">
      <h2>Seguridad de Medicamentos</h2>
      <form id="medicamentoFormMulti" autocomplete="off" style="margin-bottom:1em;" aria-label="Agregar medicamentos">
        <label>Agrega tus medicamentos:</label>
        <div style="display:flex;gap:0.5em;align-items:center;">
          <select style="flex:1;padding:0.7em;border-radius:1em;border:1.5px solid var(--color-primary);font-size:1em;" aria-label="Selecciona medicamento">
            <option value="">-- Selecciona --</option>
            ${MEDICAMENTOS_BASE.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('')}
          </select>
          <input type="text" placeholder="O escribe el nombre..." style="flex:1;padding:0.7em;border-radius:1em;border:1.5px solid var(--color-primary);font-size:1em;" aria-label="Nombre de medicamento" />
          <button type="submit">Agregar</button>
        </div>
      </form>
      <div class="lista-mis-meds" aria-label="Lista de medicamentos">
        ${misMeds.length === 0 ? '<p style="text-align:center;">No has registrado medicamentos.</p>' : misMeds.map(med => {
          const base = getMedicamento(med.nombre);
          return `<div class='card card-med' style='margin-bottom:1em;position:relative;' role='region' aria-label='Medicamento ${med.nombre}'>
            <div style='position:absolute;top:0.7em;right:0.7em;display:flex;gap:0.3em;'>
              <button class='btn-edit-med' data-nombre="${med.nombre}" title="Editar" aria-label="Editar ${med.nombre}">✏️</button>
              <button class='btn-del-med' data-nombre="${med.nombre}" title="Eliminar" aria-label="Eliminar ${med.nombre}">🗑️</button>
            </div>
            <h3 style="margin-bottom:0.5em;">${med.nombre}</h3>
            <div><span style="font-size:1.2em;">⚠️</span> <b>Advertencias:</b></div>
            <ul style="text-align:left;">
              ${(base && base.interacciones.length > 0) ? base.interacciones.map(i => `<li>${i}</li>`).join('') : '<li>Sin datos específicos</li>'}
            </ul>
            <div style="margin-top:0.7em;"><span style="font-size:1.2em;">🧊</span> <b>Conservación:</b> ${base ? base.conservacion : 'Consultar empaque'}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="card" style="margin-top:1.2em;" role="region" aria-label="Advertencias cruzadas">
        <h3>Advertencias cruzadas</h3>
        ${advertencias.length === 0 ? '<p>Sin advertencias cruzadas detectadas.</p>' : `<ul style="text-align:left;">${advertencias.map(a => `<li>${a}</li>`).join('')}</ul>`}
      </div>
      <div class="card" style="margin-top:1.2em;" role="region" aria-label="Resumen de conservación">
        <h3>Resumen de conservación</h3>
        <ul style="text-align:left;">
          <li>${resumen.refrigeracion} medicamento(s) requieren <b>refrigeración</b></li>
          <li>${resumen.ambiente} medicamento(s) requieren <b>temperatura ambiente</b></li>
          <li>${resumen.seco} medicamento(s) requieren <b>lugar seco</b></li>
        </ul>
      </div>
      <button onclick="window.location.hash='dashboard'" style="margin-top:1.5em;">Volver</button>
    </section>
  `;
} 