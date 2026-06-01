/**
 * EduSmart Asrama - Dashboard Page Component
 */

const DashboardPage = (function() {
  'use strict';

  /**
   * Render dashboard page
   */
  function render() {
    var user = EduAuth.getUser();
    var userName = user ? EduUI.escapeHtml(user.name || user.username || 'User') : 'User';
    var userRole = user ? formatRole(user.role) : '';
    var dateStr = EduUI.formatDate(new Date());
    var timeStr = EduUI.formatTime(new Date());

    return '' +
      '<div class="page">' +
        '<div class="dashboard__welcome">' +
          '<div class="dashboard__greeting">Halo, ' + userName + '!</div>' +
          '<div class="dashboard__date">' + dateStr + ' - ' + timeStr + '</div>' +
          '<div class="dashboard__date text-secondary" style="margin-top:4px">' +
            'Role: ' + userRole +
          '</div>' +
        '</div>' +
        '<div id="dashboard-offline-status"></div>' +
        '<div class="dashboard__grid">' +
          '<div class="dashboard__card" data-nav="kegiatan">' +
            '<div class="dashboard__card-icon">&#9997;</div>' +
            '<div class="dashboard__card-title">Mulai Kegiatan</div>' +
          '</div>' +
          '<div class="dashboard__card" data-nav="sarpras">' +
            '<div class="dashboard__card-icon">&#127970;</div>' +
            '<div class="dashboard__card-title">Sarpras</div>' +
          '</div>' +
          '<div class="dashboard__card" data-nav="laporan">' +
            '<div class="dashboard__card-icon">&#128202;</div>' +
            '<div class="dashboard__card-title">Laporan</div>' +
          '</div>' +
          '<div class="dashboard__card" data-nav="pengaturan">' +
            '<div class="dashboard__card-icon">&#9881;</div>' +
            '<div class="dashboard__card-title">Pengaturan</div>' +
          '</div>' +
        '</div>' +
        '<div class="mt-24">' +
          '<button class="btn btn--ghost btn--full" id="logout-btn">Keluar</button>' +
        '</div>' +
      '</div>';
  }

  /**
   * Initialize dashboard event handlers
   */
  function init() {
    // Logout button
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        EduUI.showModal({
          title: 'Konfirmasi Keluar',
          body: 'Apakah Anda yakin ingin keluar dari aplikasi?',
          confirmText: 'Keluar',
          cancelText: 'Batal',
          onConfirm: function() {
            EduAuth.logout();
          }
        });
      });
    }

    // Card navigation
    var cards = document.querySelectorAll('.dashboard__card');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var target = card.getAttribute('data-nav');
        if (target) {
          EduUI.showAlert('Fitur "' + target + '" akan segera tersedia', 'info');
        }
      });
    });

    // Update offline status
    updateOfflineStatus();

    // Update time every minute
    setInterval(updateTime, 60000);
  }

  /**
   * Update offline status indicator
   */
  function updateOfflineStatus() {
    var container = document.getElementById('dashboard-offline-status');
    if (!container) return;

    if (!EduAPI.getOnlineStatus()) {
      container.innerHTML = '<div class="alert alert--warning">Anda sedang offline. Data akan disinkronkan saat terhubung kembali.</div>';
    } else {
      container.innerHTML = '';
    }
  }

  /**
   * Update time display
   */
  function updateTime() {
    var dateEl = document.querySelector('.dashboard__date');
    if (dateEl) {
      dateEl.textContent = EduUI.formatDate(new Date()) + ' - ' + EduUI.formatTime(new Date());
    }
  }

  /**
   * Format role name to display label
   */
  function formatRole(role) {
    var roles = {
      'admin_pusat': 'Admin Pusat',
      'admin_sekolah': 'Admin Sekolah',
      'musyrif': 'Musyrif/ah',
      'wali_santri': 'Wali Santri'
    };
    return roles[role] || role || '-';
  }

  return {
    render: render,
    init: init
  };
})();
