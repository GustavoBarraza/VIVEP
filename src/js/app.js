// import '../css/styles.css';
import { router } from './router.js';
import { EmergencyButton } from './components/EmergencyMode.js';
import { RouteGuard } from './guardian.js';

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}

export function solicitarPermisoNotificaciones() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

// Al cargar la página, aplica el tema guardado y notificaciones
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  solicitarPermisoNotificaciones();
  
  // Inicializar guardián de rutas
  new RouteGuard();
  
  router();
  window.addEventListener('hashchange', () => {
    router();
    mostrarBotonEmergencia();
  });
  mostrarBotonEmergencia();
});

// Delegación para el botón de toggle de tema
window.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'themeToggle') {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  }
});

function mostrarBotonEmergencia() {
  let fab = document.getElementById('emergency-fab-container');
  if (!fab) {
    fab = document.createElement('div');
    fab.id = 'emergency-fab-container';
    document.body.appendChild(fab);
  }
  fab.innerHTML = EmergencyButton();
} 