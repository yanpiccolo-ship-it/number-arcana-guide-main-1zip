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
      esencia: { price: 0, type: 'free' },
      accion: { price: 29, type: 'subscription' },
      maestria: { price: 99, type: 'subscription' },
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
