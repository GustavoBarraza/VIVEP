# Vive+

Vive+ es una SPA (Single Page Application) pensada para personas que viven con VIH, brindando apoyo emocional, recordatorios de medicación, chat comunitario anónimo y estadísticas de adherencia.

## Características principales
- Registro anónimo (alias y contraseña, sin datos sensibles)
- Dashboard con recordatorio de medicación, mensaje motivacional y adherencia
- Chat comunitario anónimo con moderación básica
- Personalización de alias, avatar y colores (modo claro/oscuro)
- Diseño positivo, colorido y accesible

## Instalación y uso
1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. (Opcional) Configura Firebase en `src/js/utils/firebase.js` para chat en tiempo real

## Estructura del proyecto
- `index.html`: Entrada principal
- `src/css/styles.css`: Estilos globales
- `src/js/`: Lógica JS y componentes
- `src/assets/`: Imágenes e íconos
- `src/data/messages.json`: Mensajes motivacionales

## Despliegue
Puedes subir la carpeta a Vercel, Netlify o GitHub Pages. Usa rutas con hash (`#`) para navegación SPA.

## Créditos
- Ilustraciones: [unDraw](https://undraw.co/), [Open Peeps](https://www.openpeeps.com/)
- Iconos: [Phosphor Icons](https://phosphoricons.com/)
- Tipografía: Poppins, Nunito (Google Fonts) 