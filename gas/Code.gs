/**
 * EduSmart Asrama - Main Router (Google Apps Script)
 * Handles doGet/doPost and routes to appropriate handlers
 */

/**
 * Handle GET requests - returns app info
 */
function doGet(e) {
  var response = {
    success: true,
    app: 'EduSmart Asrama',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'running'
  };

  return createJsonResponse(response);
}

/**
 * Handle POST requests - main API router
 */
function doPost(e) {
  try {
    // Parse request body
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var data = body.data || {};
    var token = body.token || null;

    // Route by action
    switch (action) {
      case 'auth.login':
        return handleAction(function() {
          return AuthService.login(data.tenant_code, data.username, data.password);
        });

      case 'auth.logout':
        return handleAction(function() {
          return AuthService.logout(token);
        });

      case 'auth.validate':
        return handleAction(function() {
          return AuthService.validateSession(token);
        });

      case 'system.ping':
        return handleAction(function() {
          return { success: true, message: 'pong', timestamp: new Date().toISOString() };
        });

      default:
        // Validate session for all other actions
        if (!token) {
          return createJsonResponse({ success: false, error: 'unauthorized', message: 'Token required' });
        }

        var session = AuthService.validateSession(token);
        if (!session.success) {
          return createJsonResponse({ success: false, error: 'unauthorized', message: 'Invalid session' });
        }

        return createJsonResponse({ success: false, error: 'unknown_action', message: 'Action not found: ' + action });
    }
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: 'server_error',
      message: 'Internal server error: ' + err.message
    });
  }
}

/**
 * Execute an action handler with error handling
 */
function handleAction(handler) {
  try {
    var result = handler();
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: 'handler_error',
      message: err.message
    });
  }
}

/**
 * Create a JSON response with proper CORS headers
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
