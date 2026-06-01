/**
 * EduSmart Asrama - Authentication Module
 * Handles login, session management, and role-based access
 */

const EduAuth = (function() {
  'use strict';

  const SESSION_KEY = 'edusmart_session';

  const ROLES = {
    ADMIN_PUSAT: 'admin_pusat',
    ADMIN_SEKOLAH: 'admin_sekolah',
    MUSYRIF: 'musyrif',
    WALI_SANTRI: 'wali_santri'
  };

  /**
   * Login with credentials
   * @param {string} tenantCode - School/institution code
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<object>} Login result
   */
  async function login(tenantCode, username, password) {
    if (!tenantCode || !username || !password) {
      return { success: false, message: 'Semua field harus diisi' };
    }

    const result = await EduAPI.request('auth.login', {
      tenant_code: tenantCode,
      username: username,
      password: password
    }, { skipQueue: true });

    if (result.success && result.data) {
      const session = {
        token: result.data.token,
        user: result.data.user,
        tenant_code: tenantCode,
        logged_in_at: Date.now()
      };
      saveSession(session);
    }

    return result;
  }

  /**
   * Logout current user
   */
  async function logout() {
    try {
      await EduAPI.request('auth.logout', {}, { skipQueue: true });
    } catch (e) {
      // Ignore logout API errors
    }
    clearSession();
    window.location.hash = '#login';
  }

  /**
   * Save session to localStorage
   */
  function saveSession(session) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('[Auth] Failed to save session:', e);
    }
  }

  /**
   * Get current session
   */
  function getSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clear session
   */
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Check if user is authenticated
   */
  function isAuthenticated() {
    const session = getSession();
    return session !== null && session.token !== undefined;
  }

  /**
   * Get current user info
   */
  function getUser() {
    const session = getSession();
    return session ? session.user : null;
  }

  /**
   * Get current tenant code
   */
  function getTenantCode() {
    const session = getSession();
    return session ? session.tenant_code : null;
  }

  /**
   * Check if user has a specific role
   */
  function hasRole(role) {
    const user = getUser();
    if (!user) return false;
    return user.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  function hasAnyRole(roles) {
    const user = getUser();
    if (!user) return false;
    return roles.includes(user.role);
  }

  /**
   * Guard - redirect to login if not authenticated
   */
  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.hash = '#login';
      return false;
    }
    return true;
  }

  /**
   * Guard - check role access
   */
  function requireRole(roles) {
    if (!requireAuth()) return false;
    if (!hasAnyRole(roles)) {
      document.dispatchEvent(new CustomEvent('app:forbidden'));
      return false;
    }
    return true;
  }

  return {
    login: login,
    logout: logout,
    getSession: getSession,
    isAuthenticated: isAuthenticated,
    getUser: getUser,
    getTenantCode: getTenantCode,
    hasRole: hasRole,
    hasAnyRole: hasAnyRole,
    requireAuth: requireAuth,
    requireRole: requireRole,
    ROLES: ROLES
  };
})();
