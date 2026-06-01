/**
 * EduSmart Asrama - IndexedDB Wrapper
 * Local cache and offline queue management
 */

const EduDB = (function() {
  'use strict';

  const DB_NAME = 'edusmart_asrama';
  const DB_VERSION = 1;

  const STORES = {
    PENDING_SCANS: 'pending_scans',
    STUDENTS_CACHE: 'students_cache',
    SESSIONS_CACHE: 'sessions_cache',
    AUTH_CACHE: 'auth_cache'
  };

  let db = null;

  /**
   * Open/initialize the database
   */
  function init() {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;

        // Create object stores
        if (!database.objectStoreNames.contains(STORES.PENDING_SCANS)) {
          database.createObjectStore(STORES.PENDING_SCANS, { keyPath: 'id', autoIncrement: true });
        }

        if (!database.objectStoreNames.contains(STORES.STUDENTS_CACHE)) {
          const studentsStore = database.createObjectStore(STORES.STUDENTS_CACHE, { keyPath: 'student_id' });
          studentsStore.createIndex('name', 'name', { unique: false });
        }

        if (!database.objectStoreNames.contains(STORES.SESSIONS_CACHE)) {
          database.createObjectStore(STORES.SESSIONS_CACHE, { keyPath: 'key' });
        }

        if (!database.objectStoreNames.contains(STORES.AUTH_CACHE)) {
          database.createObjectStore(STORES.AUTH_CACHE, { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Save a record to a store
   */
  function save(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to save record'));
    });
  }

  /**
   * Get all records from a store
   */
  function getAll(storeName) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get records'));
    });
  }

  /**
   * Get a single record by key
   */
  function get(storeName, key) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get record'));
    });
  }

  /**
   * Delete a record by key
   */
  function remove(storeName, key) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete record'));
    });
  }

  /**
   * Clear all records from a store
   */
  function clear(storeName) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to clear store'));
    });
  }

  /**
   * Count records in a store
   */
  function count(storeName) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to count records'));
    });
  }

  return {
    init: init,
    save: save,
    getAll: getAll,
    get: get,
    remove: remove,
    clear: clear,
    count: count,
    STORES: STORES
  };
})();
