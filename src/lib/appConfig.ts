/**
 * App Configuration File
 * 
 * This file contains all external configuration settings.
 * Modify these values to customize the app for your installation.
 */

export const appConfig = {
  // ============================================
  // MAILCHIMP CONFIGURATION
  // ============================================
  mailchimp: {
    apiKey: '',      // Your Mailchimp API key (e.g., 'abc123def456-us1')
    listId: '',      // Your Mailchimp Audience/List ID (e.g., 'a1b2c3d4e5')
    server: '',      // Your Mailchimp server prefix (e.g., 'us1', 'us2', 'eu1')
  },

  // ============================================
  // MEMBERSHIP CONFIGURATION
  // ============================================
  membership: {
    enabled: true,
    currency: 'EUR',
    plans: {
      informe_completo: {
        price: 59.99,
        type: 'one-time',
        features: [
          'Camino de Vida y Propósito',
          'Alma y Personalidad',
          'Ciclos, Pináculos y Desafíos',
          'Compatibilidad y Finanzas',
          'PDF 40-60 páginas'
        ]
      },
      personal: { 
        price: 29, 
        type: 'subscription',
        features: ['Plan estratégico PDF', 'Calendario semanal', 'Ejercicios prácticos', 'Activador mental', 'Informe evolutivo']
      },
      accion: { 
        price: 49, 
        type: 'subscription',
        features: ['Todo lo del Plan Personal', 'Foco semanal', 'Plan de acción 5 pasos', 'Desbloqueo mental', 'Mini-reporte', 'Hoja de implementación']
      },
      profesional: { 
        price: 149, 
        type: 'subscription',
        features: ['Plan mensual estratégico', 'Seguimiento semanal', 'Lecturas personalizadas', 'Cursos y material extra', 'Sistema de Booking', 'Panel profesional']
      }
    }
  },

  // ============================================
  // BRANDING
  // ============================================
  branding: {
    appName: 'Numerology Reporter',
    copyrightHolder: 'Your Company Name',
  },

  // ============================================
  // UI CONFIGURATION
  // ============================================
  ui: {
    embedHeight: 750, // Target height for embed in pixels
    showFooter: false, // Set to true to show footer
  },
};

export type AppConfig = typeof appConfig;
