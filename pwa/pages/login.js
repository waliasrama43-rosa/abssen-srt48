/**
 * EduSmart Asrama - Login Page Component
 */

const LoginPage = (function() {
  'use strict';

  /**
   * Render login page
   */
  function render() {
    return '' +
      '<div class="login-page">' +
        '<div class="login-page__logo">' +
          '<div class="login-page__logo-text">EduSmart</div>' +
          '<div class="login-page__logo-sub">Sistem Manajemen Asrama</div>' +
        '</div>' +
        '<div class="login-page__form">' +
          '<div id="login-alert"></div>' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="login-tenant">Kode Sekolah</label>' +
            '<input class="form-group__input" type="text" id="login-tenant" placeholder="Masukkan kode sekolah" autocomplete="organization" />' +
            '<div class="form-group__error">Kode sekolah wajib diisi</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="login-username">Username</label>' +
            '<input class="form-group__input" type="text" id="login-username" placeholder="Masukkan username" autocomplete="username" />' +
            '<div class="form-group__error">Username wajib diisi</div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-group__label" for="login-password">Password</label>' +
            '<input class="form-group__input" type="password" id="login-password" placeholder="Masukkan password" autocomplete="current-password" />' +
            '<div class="form-group__error">Password wajib diisi</div>' +
          '</div>' +
          '<button class="btn btn--primary btn--full" id="login-btn" type="button">Masuk</button>' +
        '</div>' +
        '<div class="login-page__footer">' +
          'EduSmart Asrama v1.0 &copy; 2024' +
        '</div>' +
      '</div>';
  }

  /**
   * Initialize login page event handlers
   */
  function init() {
    var loginBtn = document.getElementById('login-btn');
    var tenantInput = document.getElementById('login-tenant');
    var usernameInput = document.getElementById('login-username');
    var passwordInput = document.getElementById('login-password');

    if (loginBtn) {
      loginBtn.addEventListener('click', handleLogin);
    }

    // Enter key handler
    var inputs = [tenantInput, usernameInput, passwordInput];
    inputs.forEach(function(input) {
      if (input) {
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            handleLogin();
          }
          // Clear error state on typing
          input.parentElement.classList.remove('form-group--error');
        });
      }
    });
  }

  /**
   * Handle login form submission
   */
  async function handleLogin() {
    var tenantInput = document.getElementById('login-tenant');
    var usernameInput = document.getElementById('login-username');
    var passwordInput = document.getElementById('login-password');
    var loginBtn = document.getElementById('login-btn');
    var alertContainer = document.getElementById('login-alert');

    // Clear previous errors
    clearErrors();

    // Validate
    var valid = true;

    if (!tenantInput.value.trim()) {
      tenantInput.parentElement.classList.add('form-group--error');
      valid = false;
    }

    if (!usernameInput.value.trim()) {
      usernameInput.parentElement.classList.add('form-group--error');
      valid = false;
    }

    if (!passwordInput.value.trim()) {
      passwordInput.parentElement.classList.add('form-group--error');
      valid = false;
    }

    if (!valid) return;

    // Set loading state
    EduUI.setButtonLoading(loginBtn, true);

    try {
      var result = await EduAuth.login(
        tenantInput.value.trim(),
        usernameInput.value.trim(),
        passwordInput.value.trim()
      );

      if (result.success && !result.queued) {
        // Successful login
        window.location.hash = '#dashboard';
      } else if (result.success && result.queued) {
        showLoginAlert('Tidak ada koneksi. Login memerlukan internet.', 'warning');
      } else {
        showLoginAlert(result.message || 'Login gagal. Periksa kembali data Anda.', 'danger');
      }
    } catch (err) {
      showLoginAlert('Terjadi kesalahan. Silakan coba lagi.', 'danger');
    } finally {
      EduUI.setButtonLoading(loginBtn, false);
    }
  }

  /**
   * Show alert on login page
   */
  function showLoginAlert(message, type) {
    var alertContainer = document.getElementById('login-alert');
    if (!alertContainer) return;

    alertContainer.innerHTML = '<div class="alert alert--' + type + '">' + EduUI.escapeHtml(message) + '</div>';

    // Auto clear after 5 seconds
    setTimeout(function() {
      if (alertContainer) alertContainer.innerHTML = '';
    }, 5000);
  }

  /**
   * Clear form errors
   */
  function clearErrors() {
    var groups = document.querySelectorAll('.form-group--error');
    groups.forEach(function(group) {
      group.classList.remove('form-group--error');
    });
  }

  return {
    render: render,
    init: init
  };
})();
