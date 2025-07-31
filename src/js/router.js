import { Welcome } from './components/Welcome.js';
import { Register } from './components/Register.js';
import { Dashboard } from './components/Dashboard.js';
import { Personalize } from './components/Personalize.js';
import { Chat } from './components/Chat.js';
import { MedicSafety } from './components/MedicSafety.js';
import { SymptomTracker } from './components/SymptomTracker.js';
import { EmergencyMode } from './components/EmergencyMode.js';
import { Appointments } from './components/Appointments.js';
import { PrivacyMode } from './components/PrivacyMode.js';
import { DailyTips } from './components/DailyTips.js';
import { Login } from './components/Login.js';
import { requireAuth, isPublicRoute, isPublicAuthRoute, isAuthenticated, logout } from './guardian.js';

export function router() {
  const app = document.getElementById('app');
  const route = window.location.hash.replace('#', '') || '';
  const authenticated = isAuthenticated();

  // Verificar autenticación para rutas protegidas
  if (!isPublicRoute(route) && !requireAuth()) {
    return; // El guardián ya redirigió a login
  }

  // Si está autenticado y va a rutas públicas de auth, redirigir a dashboard
  if (authenticated && isPublicAuthRoute(route)) {
    app.innerHTML = DailyTips() + Dashboard();
    return;
  }

  // Si está autenticado y va a welcome, redirigir a dashboard
  if (authenticated && route === 'welcome') {
    app.innerHTML = DailyTips() + Dashboard();
    return;
  }

  switch (route) {
    case 'welcome':
      app.innerHTML = Welcome();
      break;
    case 'register':
      app.innerHTML = Register();
      break;
    case 'login':
      app.innerHTML = Login();
      break;
    case 'dashboard':
      if (requireAuth()) {
        app.innerHTML = DailyTips() + Dashboard();
      }
      break;
    case 'personalize':
      if (requireAuth()) {
        app.innerHTML = Personalize();
      }
      break;
    case 'chat':
      if (requireAuth()) {
        app.innerHTML = Chat();
      }
      break;
    case 'medic-safety':
      if (requireAuth()) {
        app.innerHTML = MedicSafety();
      }
      break;
    case 'symptoms':
      if (requireAuth()) {
        app.innerHTML = SymptomTracker();
      }
      break;
    case 'emergency':
      if (requireAuth()) {
        app.innerHTML = EmergencyMode();
      }
      break;
    case 'appointments':
      if (requireAuth()) {
        app.innerHTML = Appointments();
      }
      break;
    case 'privacy':
      if (requireAuth()) {
        app.innerHTML = PrivacyMode();
      }
      break;
    case 'logout':
      logout();
      break;
    default:
      if (authenticated) {
        app.innerHTML = DailyTips() + Dashboard();
      } else {
        app.innerHTML = Login();
      }
  }
} 