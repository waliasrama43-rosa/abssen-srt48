/**
 * EduSmart Asrama - Main Application Controller
 * Router, state management, and app initialization
 */

const EduApp = (function() {
  'use strict';

  // Route definitions
  const routes = {
    'login': { page: LoginPage, auth: false },
    'dashboard': { page: DashboardPage, auth: true }
  };

  const DEFAULT_ROUTE = 'dashboard';
  const LOGIN_ROUTE = 'login';

  let currentRoute = null;
  let offlineBadge = null;
  let deferredInstallPrompt = null;

  /**
   * Initialize the application
   */
  async function init() {
    // Initialize IndexedDB
    try {
      await EduDB.init();
    } catch (err) {
      console.error('[App] Failed to init IndexedDB:', err);
    }

    // Initialize API client
    EduAPI.init('');

    // Initialize UI
    EduUI.init();

    // Get offline badge reference
    offlineBadge = document.getElementById('offline-badge');

    // Set up event listeners
    setupEventListeners();

    // Register service worker
    registerServiceWorker();

    // Handle PWA install prompt
    handleInstallPrompt();

    // Set initial online/offline state
    updateOnlineStatus();

    // Start router
    handleRoute();
  }

  /**
   * Set up global event listeners
   */
  function setupEventListeners() {
    // Hash change (routing)
    window.addEventListener('hashchange', handleRoute);

    // Online/offline
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // App events
    document.addEventListener('app:unauthorized', function() {
      EduAuth.logout();
    });

    document.addEventListener('app:syncing', function(e) {
      var count = e.detail ? e.detail.count : 0;
      EduUI.showAlert('Menyinkronkan ' + count + ' data...', 'info', 2000);
    });

    document.addEventListener('app:synced', function(e) {
      var count = e.detail ? e.detail.count : 0;
      if (count > 0) {
        EduUI.showAlert(count + ' data berhasil disinkronkan', 'success', 3000);
      }
    });
  }

  /**
   * Handle hash-based routing
   */
  function handleRoute() {
    var hash = window.location.hash.replace('#', '') || DEFAULT_ROUTE;
    var route = routes[hash];

    // Unknown route - redirect to default
    if (!route) {
      window.location.hash = '#' + DEFAULT_ROUTE;
      return;
    }

    // Auth check
    if (route.auth && !EduAuth.isAuthenticated()) {
      window.location.hash = '#' + LOGIN_ROUTE;
      return;
    }

    // If authenticated and on login page, redirect to dashboard
    if (hash === LOGIN_ROUTE && EduAuth.isAuthenticated()) {
      window.location.hash = '#' + DEFAULT_ROUTE;
      return;
    }

    // Render page
    renderPage(hash, route);
  }

  /**
   * Render a page into the content area
   */
  function renderPage(hash, route) {
    currentRoute = hash;

    var content = document.getElementById('app-content');
    var header = document.getElementById('app-header');
    var nav = document.getElementById('app-nav');

    if (!content) return;

    // Hide/show header and nav based on route
    if (hash === LOGIN_ROUTE) {
      if (header) header.classList.add('hidden');
      if (nav) nav.classList.add('hidden');
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    } else {
      if (header) header.classList.remove('hidden');
      if (nav) nav.classList.remove('hidden');
      content.style.paddingTop = '';
      content.style.paddingBottom = '';
    }

    // Render page content
    content.innerHTML = route.page.render();

    // Initialize page
    if (route.page.init) {
      route.page.init();
    }
  }

  /**
   * Update online/offline status UI
   */
  function updateOnlineStatus() {
    var online = navigator.onLine;

    if (offlineBadge) {
      if (online) {
        offlineBadge.classList.remove('offline-badge--visible');
      } else {
        offlineBadge.classList.add('offline-badge--visible');
      }
    }
  }

  /**
   * Register service worker
   */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/pwa/sw.js')
        .then(function(registration) {
          console.log('[App] Service Worker registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', function() {
            var newWorker = registration.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                EduUI.showAlert('Versi baru tersedia. Refresh untuk memperbarui.', 'info', 0);
              }
            });
          });
        })
        .catch(function(err) {
          console.warn('[App] Service Worker registration failed:', err);
        });
    }
  }

  /**
   * Handle PWA install prompt
   */
  function handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      deferredInstallPrompt = e;

      // Show install button/prompt after a delay
      setTimeout(function() {
        if (deferredInstallPrompt && EduAuth.isAuthenticated()) {
          showInstallPrompt();
        }
      }, 30000); // Show after 30 seconds
    });
  }

  /**
   * Show PWA install prompt
   */
  function showInstallPrompt() {
    if (!deferredInstallPrompt) return;

    EduUI.showModal({
      title: 'Install Aplikasi',
      body: 'Install EduSmart Asrama untuk akses lebih cepat dan penggunaan offline.',
      confirmText: 'Install',
      cancelText: 'Nanti',
      onConfirm: function() {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(result) {
          deferredInstallPrompt = null;
        });
      }
    });
  }

  return {
    init: init,
    handleRoute: handleRoute
  };
})();

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  EduApp.init();
});
