/**
 * EduSmart Asrama - Authentication & Session Management
 * Handles user login, session tokens, and validation
 */

var AuthService = (function() {

  var SESSION_DURATION = 86400; // 24 hours in seconds
  var CACHE_PREFIX = 'session_';

  /**
   * Login with tenant_code, username, and password
   * @param {string} tenantCode - Tenant/school code
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {object} Login result with token and user info
   */
  function login(tenantCode, username, password) {
    if (!tenantCode || !username || !password) {
      return { success: false, message: 'Semua field harus diisi' };
    }

    // Resolve tenant to get master spreadsheet
    var masterSheetId = TenantResolver.getMasterSheetId(tenantCode);
    if (!masterSheetId) {
      return { success: false, message: 'Kode sekolah tidak ditemukan' };
    }

    // Open master spreadsheet and find user
    var ss = SpreadsheetApp.openById(masterSheetId);
    var usersSheet = ss.getSheetByName('users');
    if (!usersSheet) {
      return { success: false, message: 'Konfigurasi tenant tidak valid' };
    }

    var data = usersSheet.getDataRange().getValues();
    var headers = data[0];
    var usernameCol = headers.indexOf('username');
    var passwordCol = headers.indexOf('password');
    var nameCol = headers.indexOf('name');
    var roleCol = headers.indexOf('role');
    var statusCol = headers.indexOf('status');

    if (usernameCol === -1 || passwordCol === -1) {
      return { success: false, message: 'Konfigurasi users sheet tidak valid' };
    }

    // Find matching user
    var user = null;
    for (var i = 1; i < data.length; i++) {
      if (data[i][usernameCol] === username && data[i][passwordCol] === password) {
        // Check if user is active
        if (statusCol !== -1 && data[i][statusCol] !== 'active') {
          return { success: false, message: 'Akun tidak aktif. Hubungi admin.' };
        }

        user = {
          username: data[i][usernameCol],
          name: nameCol !== -1 ? data[i][nameCol] : username,
          role: roleCol !== -1 ? data[i][roleCol] : 'musyrif'
        };
        break;
      }
    }

    if (!user) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Generate session token
    var token = generateToken();

    // Store session in cache
    var sessionData = {
      token: token,
      user: user,
      tenant_code: tenantCode,
      master_sheet_id: masterSheetId,
      created_at: new Date().toISOString()
    };

    var cache = CacheService.getScriptCache();
    cache.put(CACHE_PREFIX + token, JSON.stringify(sessionData), SESSION_DURATION);

    return {
      success: true,
      data: {
        token: token,
        user: user
      }
    };
  }

  /**
   * Logout - invalidate session token
   * @param {string} token - Session token
   * @returns {object} Result
   */
  function logout(token) {
    if (token) {
      var cache = CacheService.getScriptCache();
      cache.remove(CACHE_PREFIX + token);
    }
    return { success: true, message: 'Logged out' };
  }

  /**
   * Validate session token
   * @param {string} token - Session token to validate
   * @returns {object} Session data if valid
   */
  function validateSession(token) {
    if (!token) {
      return { success: false, error: 'unauthorized', message: 'No token provided' };
    }

    var cache = CacheService.getScriptCache();
    var sessionStr = cache.get(CACHE_PREFIX + token);

    if (!sessionStr) {
      return { success: false, error: 'unauthorized', message: 'Session expired or invalid' };
    }

    var session = JSON.parse(sessionStr);
    return {
      success: true,
      data: session
    };
  }

  /**
   * Generate a random session token
   * @returns {string} Random token
   */
  function generateToken() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for (var i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  return {
    login: login,
    logout: logout,
    validateSession: validateSession
  };
})();
