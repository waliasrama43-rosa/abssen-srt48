/**
 * EduSmart Asrama - API Client
 * Handles communication with GAS backend
 * Auto-queues requests when offline, syncs when back online
 */

const EduAPI = (function() {
  'use strict';

  // Configurable API endpoint (Google Apps Script Web App URL)
  let API_URL = '';

  // Online status
  let isOnline = navigator.onLine;

  /**
   * Initialize API client
   */
  function init(endpoint) {
    API_URL = endpoint || '';

    // Listen for online/offline events
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  }

  /**
   * Handle coming back online
   */
  function onOnline() {
    isOnline = true;
    document.dispatchEvent(new CustomEvent('app:online'));
    syncPendingRequests();
  }

  /**
   * Handle going offline
   */
  function onOffline() {
    isOnline = false;
    document.dispatchEvent(new CustomEvent('app:offline'));
  }

  /**
   * Make an API request
   * @param {string} action - The action to perform (e.g., 'auth.login')
   * @param {object} data - Request payload
   * @param {object} options - Additional options
   * @returns {Promise<object>} Response data
   */
  async function request(action, data, options) {
    options = options || {};

    const payload = {
      action: action,
      data: data || {},
      timestamp: Date.now()
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      payload.token = token;
    }

    // If offline and request is queueable, save to pending
    if (!isOnline && !options.skipQueue) {
      await queueRequest(payload);
      return { success: true, queued: true, message: 'Request disimpan, akan dikirim saat online' };
    }

    // If no API URL configured, return error
    if (!API_URL) {
      return { success: false, error: 'no_endpoint', message: 'API endpoint belum dikonfigurasi' };
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'  // GAS requires text/plain to avoid CORS preflight
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Handle auth errors
      if (result.error === 'unauthorized') {
        document.dispatchEvent(new CustomEvent('app:unauthorized'));
        return result;
      }

      return result;
    } catch (err) {
      // Network error - queue the request
      if (!options.skipQueue) {
        await queueRequest(payload);
        return { success: true, queued: true, message: 'Request disimpan, akan dikirim saat online' };
      }
      return { success: false, error: 'network', message: 'Gagal terhubung ke server' };
    }
  }

  /**
   * Queue a request for later sync
   */
  async function queueRequest(payload) {
    try {
      await EduDB.save(EduDB.STORES.PENDING_SCANS, {
        payload: payload,
        created_at: Date.now(),
        attempts: 0
      });
    } catch (err) {
      console.error('[API] Failed to queue request:', err);
    }
  }

  /**
   * Sync all pending requests
   */
  async function syncPendingRequests() {
    if (!isOnline || !API_URL) return;

    try {
      const pending = await EduDB.getAll(EduDB.STORES.PENDING_SCANS);
      if (!pending || pending.length === 0) return;

      document.dispatchEvent(new CustomEvent('app:syncing', { detail: { count: pending.length } }));

      let synced = 0;
      for (const item of pending) {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(item.payload)
          });

          if (response.ok) {
            await EduDB.remove(EduDB.STORES.PENDING_SCANS, item.id);
            synced++;
          } else {
            // Increment attempts, remove if too many
            item.attempts = (item.attempts || 0) + 1;
            if (item.attempts >= 5) {
              await EduDB.remove(EduDB.STORES.PENDING_SCANS, item.id);
            } else {
              await EduDB.save(EduDB.STORES.PENDING_SCANS, item);
            }
          }
        } catch (err) {
          // Still offline, stop syncing
          break;
        }
      }

      document.dispatchEvent(new CustomEvent('app:synced', { detail: { count: synced } }));
    } catch (err) {
      console.error('[API] Sync failed:', err);
    }
  }

  /**
   * Get auth token from localStorage
   */
  function getAuthToken() {
    try {
      const session = JSON.parse(localStorage.getItem('edusmart_session') || 'null');
      return session ? session.token : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Get pending request count
   */
  async function getPendingCount() {
    try {
      return await EduDB.count(EduDB.STORES.PENDING_SCANS);
    } catch (e) {
      return 0;
    }
  }

  /**
   * Check online status
   */
  function getOnlineStatus() {
    return isOnline;
  }

  /**
   * Set API endpoint
   */
  function setEndpoint(url) {
    API_URL = url;
  }

  return {
    init: init,
    request: request,
    syncPendingRequests: syncPendingRequests,
    getPendingCount: getPendingCount,
    getOnlineStatus: getOnlineStatus,
    setEndpoint: setEndpoint
  };
})();
