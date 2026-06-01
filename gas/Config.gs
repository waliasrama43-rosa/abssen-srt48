/**
 * EduSmart Asrama - Configuration & Constants
 * Global settings and tenant configuration reader
 */

var Config = (function() {

  // ============================================================
  // GLOBAL CONSTANTS
  // ============================================================

  // Global config spreadsheet ID (contains tenant registry)
  var GLOBAL_CONFIG_SHEET_ID = 'YOUR_GLOBAL_CONFIG_SHEET_ID_HERE';

  // Sheet names in global config
  var SHEETS = {
    TENANT_REGISTRY: 'tenant_registry',
    PLANS: 'plans'
  };

  // Default activity scores
  var SCORE_DEFAULTS = {
    HADIR: 10,
    TERLAMBAT: 5,
    IZIN: 3,
    SAKIT: 3,
    ALPHA: 0
  };

  // Attendance status codes
  var STATUS = {
    HADIR: 'hadir',
    TERLAMBAT: 'terlambat',
    IZIN: 'izin',
    SAKIT: 'sakit',
    ALPHA: 'alpha'
  };

  // Session duration in seconds (24 hours)
  var SESSION_DURATION = 86400;

  // Max retry attempts for failed operations
  var MAX_RETRIES = 3;

  // ============================================================
  // CONFIGURATION READER
  // ============================================================

  /**
   * Get tenant configuration from global config sheet
   * @param {string} tenantCode - Tenant code to look up
   * @returns {object|null} Tenant config or null if not found
   */
  function getTenantConfig(tenantCode) {
    try {
      var ss = SpreadsheetApp.openById(GLOBAL_CONFIG_SHEET_ID);
      var sheet = ss.getSheetByName(SHEETS.TENANT_REGISTRY);
      if (!sheet) return null;

      var data = sheet.getDataRange().getValues();
      var headers = data[0];

      var codeCol = headers.indexOf('tenant_code');
      if (codeCol === -1) return null;

      for (var i = 1; i < data.length; i++) {
        if (data[i][codeCol] === tenantCode) {
          var config = {};
          for (var j = 0; j < headers.length; j++) {
            config[headers[j]] = data[i][j];
          }
          return config;
        }
      }

      return null;
    } catch (err) {
      Logger.log('Error reading tenant config: ' + err.message);
      return null;
    }
  }

  /**
   * Get score value for a given status
   * @param {string} status - Attendance status
   * @returns {number} Score value
   */
  function getScoreForStatus(status) {
    var key = status.toUpperCase();
    return SCORE_DEFAULTS[key] !== undefined ? SCORE_DEFAULTS[key] : 0;
  }

  /**
   * Get all score defaults
   * @returns {object} Score defaults map
   */
  function getScoreDefaults() {
    return SCORE_DEFAULTS;
  }

  return {
    GLOBAL_CONFIG_SHEET_ID: GLOBAL_CONFIG_SHEET_ID,
    SHEETS: SHEETS,
    SCORE_DEFAULTS: SCORE_DEFAULTS,
    STATUS: STATUS,
    SESSION_DURATION: SESSION_DURATION,
    MAX_RETRIES: MAX_RETRIES,
    getTenantConfig: getTenantConfig,
    getScoreForStatus: getScoreForStatus,
    getScoreDefaults: getScoreDefaults
  };
})();
