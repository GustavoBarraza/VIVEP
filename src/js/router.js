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

export function router() {
  const app = document.getElementById('app');
  const route = window.location.hash.replace('#', '') || 'welcome';

  switch (route) {
    case 'welcome':
      app.innerHTML = Welcome();
      break;
    case 'register':
      app.innerHTML = Register();
      break;
    case 'dashboard':
      app.innerHTML = DailyTips() + Dashboard();
      break;
    case 'personalize':
      app.innerHTML = Personalize();
      break;
    case 'chat':
      app.innerHTML = Chat();
      break;
    case 'medic-safety':
      app.innerHTML = MedicSafety();
      break;
    case 'symptoms':
      app.innerHTML = SymptomTracker();
      break;
    case 'emergency':
      app.innerHTML = EmergencyMode();
      break;
    case 'appointments':
      app.innerHTML = Appointments();
      break;
    case 'privacy':
      app.innerHTML = PrivacyMode();
      break;
    default:
      app.innerHTML = Welcome();
  }
} 