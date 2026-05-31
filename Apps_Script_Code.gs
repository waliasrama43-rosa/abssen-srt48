/**
 * ================================================================
 * SISTEM MANAJEMEN ABSENSI SRT48
 * Google Apps Script Backend untuk Admin Panel
 * ================================================================
 * 
 * INSTRUKSI SETUP:
 * 1. Buka Google Apps Script di https://script.google.com
 * 2. Buat project baru
 * 3. Copy-paste seluruh kode ini ke editor
 * 4. Buat Google Sheet dengan nama "absen_settings"
 *    - Sheet 1: "Tendik" (kolom A untuk nama tendik)
 *    - Sheet 2: "Kegiatan" (kolom A untuk nama kegiatan)
 * 5. Jalankan "setupSheets()" untuk inisialisasi
 * 6. Deploy sebagai Web App
 * 7. Copy Deploy URL ke index.html (ganti URL_GAS)
 * ================================================================
 */

// ================================================================
// KONFIGURASI GLOBAL
// ================================================================

// ID Google Sheet (ganti dengan ID Sheets Anda)
// Cara mendapatkan: Buka Sheet di browser, lihat URL
// Contoh: https://docs.google.com/spreadsheets/d/SHEET_ID_INI/edit
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

// Nama sheet untuk setiap data
const SHEET_NAMES = {
  TENDIK: "Tendik",
  KEGIATAN: "Kegiatan"
};

// ================================================================
// MAIN HANDLER - Dipanggil saat request GET atau POST
// ================================================================

/**
 * Fungsi utama yang menangani semua request dari frontend
 * Gunakan sebagai Web App endpoint
 */
function doGet(e) {
  try {
    return handleRequest('GET', e);
  } catch (error) {
    return returnError(error.message);
  }
}

function doPost(e) {
  try {
    return handleRequest('POST', e);
  } catch (error) {
    return returnError(error.message);
  }
}

/**
 * Router utama untuk semua request
 */
function handleRequest(method, e) {
  // Handle GET - Return semua data
  if (method === 'GET') {
    const tendik = readSheet(SHEET_NAMES.TENDIK);
    const kegiatan = readSheet(SHEET_NAMES.KEGIATAN);
    
    return returnSuccess({
      tendik: tendik,
      kegiatan: kegiatan,
      timestamp: new Date().toISOString()
    });
  }

  // Handle POST - Process action
  if (method === 'POST') {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'addSetting':
        return handleAdd(payload);
      
      case 'editSetting':
        return handleEdit(payload);
      
      case 'deleteSetting':
        return handleDelete(payload);
      
      case 'getSetting':
        return handleGet(payload);
      
      default:
        return returnError(`Action '${action}' tidak dikenali`);
    }
  }

  return returnError('Method tidak didukung');
}

// ================================================================
// ACTION HANDLERS
// ================================================================

/**
 * HANDLER: Tambah item baru ke Tendik atau Kegiatan
 * 
 * Request payload:
 * {
 *   action: "addSetting",
 *   type: "tendik" | "kegiatan",
 *   value: "nama item"
 * }
 */
function handleAdd(payload) {
  const { type, value } = payload;

  // Validasi input
  if (!type || !value) {
    return returnError('type dan value harus diisi');
  }

  if (!['tendik', 'kegiatan'].includes(type)) {
    return returnError('type harus "tendik" atau "kegiatan"');
  }

  // Ambil sheet name
  const sheetName = type === 'tendik' ? SHEET_NAMES.TENDIK : SHEET_NAMES.KEGIATAN;

  // Cek duplikat
  const existingData = readSheet(sheetName);
  if (existingData.includes(value)) {
    return returnError(`"${value}" sudah ada`);
  }

  // Tambah ke sheet
  try {
    appendToSheet(sheetName, value);
    
    return returnSuccess({
      message: `${value} berhasil ditambahkan`,
      type: type,
      value: value
    });
  } catch (error) {
    return returnError('Gagal menambah: ' + error.message);
  }
}

/**
 * HANDLER: Edit item yang sudah ada
 * 
 * Request payload:
 * {
 *   action: "editSetting",
 *   type: "tendik" | "kegiatan",
 *   oldValue: "nama lama",
 *   newValue: "nama baru"
 * }
 */
function handleEdit(payload) {
  const { type, oldValue, newValue } = payload;

  // Validasi input
  if (!type || !oldValue || !newValue) {
    return returnError('type, oldValue, dan newValue harus diisi');
  }

  if (!['tendik', 'kegiatan'].includes(type)) {
    return returnError('type harus "tendik" atau "kegiatan"');
  }

  const sheetName = type === 'tendik' ? SHEET_NAMES.TENDIK : SHEET_NAMES.KEGIATAN;

  try {
    updateInSheet(sheetName, oldValue, newValue);
    
    return returnSuccess({
      message: `${oldValue} berhasil diubah menjadi ${newValue}`,
      type: type,
      oldValue: oldValue,
      newValue: newValue
    });
  } catch (error) {
    return returnError('Gagal mengubah: ' + error.message);
  }
}

/**
 * HANDLER: Hapus item dari Tendik atau Kegiatan
 * 
 * Request payload:
 * {
 *   action: "deleteSetting",
 *   type: "tendik" | "kegiatan",
 *   value: "nama item"
 * }
 */
function handleDelete(payload) {
  const { type, value } = payload;

  // Validasi input
  if (!type || !value) {
    return returnError('type dan value harus diisi');
  }

  if (!['tendik', 'kegiatan'].includes(type)) {
    return returnError('type harus "tendik" atau "kegiatan"');
  }

  const sheetName = type === 'tendik' ? SHEET_NAMES.TENDIK : SHEET_NAMES.KEGIATAN;

  try {
    deleteFromSheet(sheetName, value);
    
    return returnSuccess({
      message: `${value} berhasil dihapus`,
      type: type,
      value: value
    });
  } catch (error) {
    return returnError('Gagal menghapus: ' + error.message);
  }
}

/**
 * HANDLER: Ambil data dari sheet tertentu
 * 
 * Request payload:
 * {
 *   action: "getSetting",
 *   type: "tendik" | "kegiatan"
 * }
 */
function handleGet(payload) {
  const { type } = payload;

  if (!type || !['tendik', 'kegiatan'].includes(type)) {
    return returnError('type harus "tendik" atau "kegiatan"');
  }

  const sheetName = type === 'tendik' ? SHEET_NAMES.TENDIK : SHEET_NAMES.KEGIATAN;

  try {
    const data = readSheet(sheetName);
    return returnSuccess({
      type: type,
      data: data
    });
  } catch (error) {
    return returnError('Gagal membaca data: ' + error.message);
  }
}

// ================================================================
// SHEET OPERATIONS - Fungsi dasar untuk manipulasi sheet
// ================================================================

/**
 * Baca semua data dari sheet (kolom A)
 * @param {string} sheetName - Nama sheet yang akan dibaca
 * @return {array} Array berisi semua nilai non-kosong dari kolom A
 */
function readSheet(sheetName) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
    }

    const data = sheet.getRange('A:A').getValues();
    
    // Filter nilai kosong dan hapus whitespace
    return data
      .map(row => row[0])
      .filter(val => val && String(val).trim() !== '')
      .map(val => String(val).trim());
  } catch (error) {
    console.error('readSheet error:', error);
    throw error;
  }
}

/**
 * Tambah baris baru ke sheet (kolom A)
 * @param {string} sheetName - Nama sheet target
 * @param {string} value - Nilai yang akan ditambahkan
 */
function appendToSheet(sheetName, value) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
    }

    // Cari baris kosong pertama
    const data = sheet.getRange('A:A').getValues();
    const lastRow = data.filter(row => row[0] && String(row[0]).trim() !== '').length;
    
    // Tambah di baris berikutnya
    sheet.getRange(lastRow + 1, 1).setValue(value);
    
    console.log(`Ditambahkan ke ${sheetName}: ${value}`);
  } catch (error) {
    console.error('appendToSheet error:', error);
    throw error;
  }
}

/**
 * Update nilai dalam sheet
 * @param {string} sheetName - Nama sheet target
 * @param {string} oldValue - Nilai lama untuk dicari
 * @param {string} newValue - Nilai baru pengganti
 */
function updateInSheet(sheetName, oldValue, newValue) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
    }

    const data = sheet.getRange('A:A').getValues();
    
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === oldValue.trim()) {
        sheet.getRange(i + 1, 1).setValue(newValue);
        console.log(`Diupdate di ${sheetName}: ${oldValue} -> ${newValue}`);
        return;
      }
    }

    throw new Error(`"${oldValue}" tidak ditemukan`);
  } catch (error) {
    console.error('updateInSheet error:', error);
    throw error;
  }
}

/**
 * Hapus nilai dari sheet
 * @param {string} sheetName - Nama sheet target
 * @param {string} value - Nilai yang akan dihapus
 */
function deleteFromSheet(sheetName, value) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
    }

    const data = sheet.getRange('A:A').getValues();
    
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === value.trim()) {
        sheet.deleteRow(i + 1);
        console.log(`Dihapus dari ${sheetName}: ${value}`);
        return;
      }
    }

    throw new Error(`"${value}" tidak ditemukan`);
  } catch (error) {
    console.error('deleteFromSheet error:', error);
    throw error;
  }
}

// ================================================================
// RESPONSE HELPERS
// ================================================================

/**
 * Return response sukses
 */
function returnSuccess(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Return response error
 */
function returnError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
// SETUP & UTILITIES
// ================================================================

/**
 * Fungsi setup awal - jalankan sekali untuk membuat struktur sheet
 * Cara: Buka Apps Script, pilih setupSheets, klik Run
 */
function setupSheets() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Buat sheet untuk Tendik jika belum ada
    if (!ss.getSheetByName(SHEET_NAMES.TENDIK)) {
      ss.insertSheet(SHEET_NAMES.TENDIK);
      const tendikSheet = ss.getSheetByName(SHEET_NAMES.TENDIK);
      tendikSheet.getRange(1, 1).setValue("NAMA TENDIK");
      console.log(`Sheet "${SHEET_NAMES.TENDIK}" berhasil dibuat`);
    }
    
    // Buat sheet untuk Kegiatan jika belum ada
    if (!ss.getSheetByName(SHEET_NAMES.KEGIATAN)) {
      ss.insertSheet(SHEET_NAMES.KEGIATAN);
      const kegiatanSheet = ss.getSheetByName(SHEET_NAMES.KEGIATAN);
      kegiatanSheet.getRange(1, 1).setValue("NAMA KEGIATAN");
      console.log(`Sheet "${SHEET_NAMES.KEGIATAN}" berhasil dibuat`);
    }
    
    console.log("Setup selesai!");
  } catch (error) {
    console.error('Setup error:', error);
  }
}

/**
 * Test fungsi - jalankan untuk test request
 * Buka Apps Script Console untuk lihat output
 */
function testGetData() {
  const result = handleRequest('GET', null);
  console.log(result.getContent());
}

function testAddItem() {
  const payload = {
    action: 'addSetting',
    type: 'tendik',
    value: 'Budi Santoso'
  };
  
  const result = handleAdd(payload);
  console.log(result.getContent());
}

/**
 * Fungsi untuk debugging - lihat raw data dari sheet
 */
function debugSheets() {
  const tendikData = readSheet(SHEET_NAMES.TENDIK);
  const kegiatanData = readSheet(SHEET_NAMES.KEGIATAN);
  
  console.log("=== DEBUG DATA ===");
  console.log("Tendik:", tendikData);
  console.log("Kegiatan:", kegiatanData);
}
