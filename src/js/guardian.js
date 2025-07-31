// Guardián de rutas para autenticación
export class RouteGuard {
  constructor() {
    this.publicRoutes = ['welcome', 'login', 'register'];
    this.init();
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) return false;
    
    try {
      const token = JSON.parse(sessionToken);
      const now = Date.now();
      const tokenAge = now - token.timestamp;
      
      // Token válido por 24 horas
      if (tokenAge > 24 * 60 * 60 * 1000) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Obtener la ruta actual
  getCurrentRoute() {
    return window.location.hash.replace('#', '') || 'welcome';
  }

  // Verificar si la ruta actual requiere autenticación
  requiresAuth(route) {
    return !this.publicRoutes.includes(route);
  }

  // Redirigir a login
  redirectToLogin() {
    window.location.hash = 'login';
  }

  // Verificar acceso a la ruta
  checkAccess() {
    const currentRoute = this.getCurrentRoute();
    
    if (this.requiresAuth(currentRoute) && !this.isAuthenticated()) {
      this.redirectToLogin();
      return false;
    }
    
    return true;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    window.location.hash = 'login';
  }

  // Inicializar el guardián
  init() {
    // Verificar acceso al cargar la página
    this.checkAccess();
    
    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => {
      this.checkAccess();
    });
  }
}

// Función helper para verificar autenticación
export function requireAuth() {
  const sessionToken = localStorage.getItem('sessionToken');
  if (!sessionToken) {
    window.location.hash = 'login';
    return false;
  }
  
  try {
    const token = JSON.parse(sessionToken);
    const now = Date.now();
    const tokenAge = now - token.timestamp;
    
    if (tokenAge > 24 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    logout();
    return false;
  }
}

// Función helper para verificar si es ruta pública
export function isPublicRoute(route) {
  const publicRoutes = ['welcome', 'login', 'register'];
  return publicRoutes.includes(route);
}

// Función helper para verificar si es ruta de autenticación pública
export function isPublicAuthRoute(route) {
  return route === 'login' || route === 'register';
}

// Función helper para obtener usuario actual
export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Función helper para cerrar sesión
export function logout() {
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('currentUser');
  window.location.hash = 'login';
}

// Hacer funciones disponibles globalmente
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;

// Función helper para verificar si está autenticado
export function isAuthenticated() {
  const sessionToken = localStorage.getItem('sessionToken');
  if (!sessionToken) return false;
  
  try {
    const token = JSON.parse(sessionToken);
    const now = Date.now();
    const tokenAge = now - token.timestamp;
    
    if (tokenAge > 24 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    logout();
    return false;
  }
} 