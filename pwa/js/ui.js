/**
 * EduSmart Asrama - UI Utilities
 * Alerts, modals, loading states, and common UI helpers
 */

const EduUI = (function() {
  'use strict';

  let alertContainer = null;
  let loadingOverlay = null;
  let modalBackdrop = null;

  /**
   * Initialize UI components
   */
  function init() {
    alertContainer = document.getElementById('alert-container');
    loadingOverlay = document.getElementById('loading-overlay');
    modalBackdrop = document.getElementById('modal-backdrop');
  }

  /**
   * Show an alert message
   * @param {string} message - Alert message
   * @param {string} type - Alert type: success, danger, warning, info
   * @param {number} duration - Auto-dismiss duration in ms (0 = manual)
   */
  function showAlert(message, type, duration) {
    type = type || 'info';
    duration = duration !== undefined ? duration : 4000;

    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = 'alert alert--' + type;
    alert.textContent = message;

    alertContainer.appendChild(alert);

    if (duration > 0) {
      setTimeout(function() {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(function() {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        }, 300);
      }, duration);
    }

    return alert;
  }

  /**
   * Show loading overlay
   */
  function showLoading() {
    if (loadingOverlay) {
      loadingOverlay.classList.add('loading-overlay--visible');
    }
  }

  /**
   * Hide loading overlay
   */
  function hideLoading() {
    if (loadingOverlay) {
      loadingOverlay.classList.remove('loading-overlay--visible');
    }
  }

  /**
   * Show modal dialog
   * @param {object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {string} options.body - Modal body text
   * @param {string} options.confirmText - Confirm button text
   * @param {string} options.cancelText - Cancel button text
   * @param {Function} options.onConfirm - Confirm callback
   * @param {Function} options.onCancel - Cancel callback
   */
  function showModal(options) {
    if (!modalBackdrop) return;

    const modalEl = modalBackdrop.querySelector('.modal');
    if (!modalEl) return;

    const titleEl = modalEl.querySelector('.modal__title');
    const bodyEl = modalEl.querySelector('.modal__body');
    const actionsEl = modalEl.querySelector('.modal__actions');

    if (titleEl) titleEl.textContent = options.title || 'Konfirmasi';
    if (bodyEl) bodyEl.textContent = options.body || '';

    if (actionsEl) {
      actionsEl.innerHTML = '';

      if (options.cancelText !== false) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn--ghost';
        cancelBtn.textContent = options.cancelText || 'Batal';
        cancelBtn.addEventListener('click', function() {
          hideModal();
          if (options.onCancel) options.onCancel();
        });
        actionsEl.appendChild(cancelBtn);
      }

      var confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn--primary';
      confirmBtn.textContent = options.confirmText || 'OK';
      confirmBtn.addEventListener('click', function() {
        hideModal();
        if (options.onConfirm) options.onConfirm();
      });
      actionsEl.appendChild(confirmBtn);
    }

    modalBackdrop.classList.add('modal-backdrop--visible');
  }

  /**
   * Hide modal
   */
  function hideModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('modal-backdrop--visible');
    }
  }

  /**
   * Set button loading state
   */
  function setButtonLoading(button, loading) {
    if (!button) return;
    if (loading) {
      button.classList.add('btn--loading');
      button.disabled = true;
    } else {
      button.classList.remove('btn--loading');
      button.disabled = false;
    }
  }

  /**
   * Format date to locale string
   */
  function formatDate(date) {
    date = date || new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  /**
   * Format time
   */
  function formatTime(date) {
    date = date || new Date();
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    init: init,
    showAlert: showAlert,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showModal: showModal,
    hideModal: hideModal,
    setButtonLoading: setButtonLoading,
    formatDate: formatDate,
    formatTime: formatTime,
    escapeHtml: escapeHtml
  };
})();
