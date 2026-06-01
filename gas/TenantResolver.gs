/**
 * EduSmart Asrama - Multi-Tenant Database Routing
 * Resolves tenant codes to spreadsheet IDs
 * Auto-creates monthly log spreadsheets (auto-sharding)
 */

var TenantResolver = (function() {

  var CACHE_DURATION = 3600; // 1 hour cache for tenant lookups

  /**
   * Get master spreadsheet ID for a tenant
   * @param {string} tenantCode - Tenant code
   * @returns {string|null} Spreadsheet ID or null
   */
  function getMasterSheetId(tenantCode) {
    if (!tenantCode) return null;

    // Check cache first
    var cache = CacheService.getScriptCache();
    var cacheKey = 'tenant_master_' + tenantCode;
    var cached = cache.get(cacheKey);
    if (cached) return cached;

    // Look up in global config
    var config = Config.getTenantConfig(tenantCode);
    if (!config || !config.master_sheet_id) return null;

    // Verify tenant is active
    if (config.status && config.status !== 'active') return null;

    // Cache the result
    cache.put(cacheKey, config.master_sheet_id, CACHE_DURATION);

    return config.master_sheet_id;
  }

  /**
   * Get log spreadsheet ID for a tenant and specific month
   * Creates a new spreadsheet if it does not exist
   * @param {string} tenantCode - Tenant code
   * @param {string} yearMonth - Format: "YYYY-MM"
   * @returns {string|null} Log spreadsheet ID
   */
  function getLogSheetId(tenantCode, yearMonth) {
    if (!tenantCode || !yearMonth) return null;

    // Validate yearMonth format
    if (!/^\d{4}-\d{2}$/.test(yearMonth)) return null;

    // Check cache
    var cache = CacheService.getScriptCache();
    var cacheKey = 'tenant_log_' + tenantCode + '_' + yearMonth;
    var cached = cache.get(cacheKey);
    if (cached) return cached;

    // Look up in master sheet's log_registry
    var masterSheetId = getMasterSheetId(tenantCode);
    if (!masterSheetId) return null;

    var ss = SpreadsheetApp.openById(masterSheetId);
    var registrySheet = ss.getSheetByName('log_registry');

    // Create log_registry sheet if it does not exist
    if (!registrySheet) {
      registrySheet = ss.insertSheet('log_registry');
      registrySheet.appendRow(['year_month', 'spreadsheet_id', 'created_at']);
    }

    // Search for existing log spreadsheet
    var data = registrySheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === yearMonth) {
        var logId = data[i][1];
        cache.put(cacheKey, logId, CACHE_DURATION);
        return logId;
      }
    }

    // Create new log spreadsheet (auto-shard)
    var logId = createLogSpreadsheet(tenantCode, yearMonth, registrySheet);
    if (logId) {
      cache.put(cacheKey, logId, CACHE_DURATION);
    }

    return logId;
  }

  /**
   * Create a new monthly log spreadsheet
   * @param {string} tenantCode - Tenant code
   * @param {string} yearMonth - Format: "YYYY-MM"
   * @param {Sheet} registrySheet - Registry sheet to record the new spreadsheet
   * @returns {string|null} New spreadsheet ID
   */
  function createLogSpreadsheet(tenantCode, yearMonth, registrySheet) {
    try {
      var title = 'EduSmart Log - ' + tenantCode.toUpperCase() + ' - ' + yearMonth;
      var newSS = SpreadsheetApp.create(title);

      // Set up sheets for the log
      var attendanceSheet = newSS.getActiveSheet();
      attendanceSheet.setName('attendance');
      attendanceSheet.appendRow([
        'timestamp', 'student_id', 'student_name', 'activity_id',
        'activity_name', 'status', 'score', 'scanned_by', 'notes'
      ]);

      var sarprasSheet = newSS.insertSheet('sarpras_reports');
      sarprasSheet.appendRow([
        'timestamp', 'item_id', 'item_name', 'condition',
        'reporter', 'notes', 'photo_url', 'resolved'
      ]);

      var scoresSheet = newSS.insertSheet('daily_scores');
      scoresSheet.appendRow([
        'date', 'student_id', 'student_name', 'total_score',
        'activities_count', 'hadir', 'terlambat', 'izin', 'sakit', 'alpha'
      ]);

      // Record in registry
      var logId = newSS.getId();
      registrySheet.appendRow([yearMonth, logId, new Date().toISOString()]);

      return logId;
    } catch (err) {
      Logger.log('Error creating log spreadsheet: ' + err.message);
      return null;
    }
  }

  /**
   * Get current year-month string
   * @returns {string} Format: "YYYY-MM"
   */
  function getCurrentYearMonth() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    return year + '-' + month;
  }

  return {
    getMasterSheetId: getMasterSheetId,
    getLogSheetId: getLogSheetId,
    getCurrentYearMonth: getCurrentYearMonth
  };
})();
