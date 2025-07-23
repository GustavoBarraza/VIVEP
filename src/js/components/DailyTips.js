const CONSEJOS = [
  "Mantener la medicación todos los días reduce el riesgo de transmisión casi a cero.",
  "No suspendas tu tratamiento sin consultar a tu médico.",
  "El uso correcto del preservativo previene otras infecciones de transmisión sexual.",
  "Realiza tus controles médicos periódicamente.",
  "La alimentación balanceada ayuda a fortalecer tu sistema inmune.",
  "Habla abiertamente con tu equipo de salud sobre tus dudas o efectos secundarios.",
  "El apoyo emocional es parte fundamental del tratamiento."
];

export function DailyTips() {
  const dia = new Date().getDate();
  const consejo = CONSEJOS[dia % CONSEJOS.length];
  return `
    <div class="card daily-tip" style="margin-bottom:1em;">
      <div style="display:flex;align-items:center;gap:0.7em;">
        <span style="font-size:1.5em;">💡</span>
        <span style="font-weight:600;">Consejo del día:</span>
      </div>
      <p style="margin:0.7em 0 0 0;">${consejo}</p>
    </div>
  `;
} 