/**
 * ================================================================
 * SISTEM MANAJEMEN ABSENSI SRT48
 * Google Apps Script Backend - VERSI 1 SHEET
 * ================================================================
 * 
 * STRUKTUR GOOGLE SHEETS:
 * Hanya butuh 1 sheet (Sheet1 atau nama apapun)
 * 
 * | Kolom A (TENDIK) | Kolom B (KEGIATAN) |
 * |------------------|--------------------|
 * | NAMA TENDIK      | NAMA KEGIATAN      |  <- Header (row 1)
 * | Budi Santoso     | Rapat Rutin        |
 * | Siti Nurhaliza   | Validasi Data      |
 * | Ahmad Wijaya     | Input Attendance   |
 * 
 * INSTRUKSI SETUP:
 * 1. Buka Google Sheets yang sudah ada
 * 2. Pastikan struktur kolom:
 *    - Kolom A = Daftar Tendik
 *    - Kolom B = Daftar Kegiatan
 * 3. Row 1 = Header (NAMA TENDIK, NAMA KEGIATAN)
 * 4. Copy Sheet ID dari URL
 * 5. Paste di SHEET_ID di bawah
 * 6. Deploy sebagai Web App
 * ================================================================
 */

// ================================================================
// KONFIGURASI - GANTI DENGAN ID SHEETS KAMU
// ================================================================

// Cara mendapatkan ID:
// Buka Google Sheets, lihat URL:
// https://docs.google.com/spreadsheets/d/[COPY_ID_INI]/edit
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

// Nama sheet yang dipakai (biasanya "Sheet1")
// Ganti kalau nama sheet kamu berbeda
const SHEET_NAME = "Sheet1";

// Kolom untuk Tendik dan Kegiatan
const COL_TENDIK = 1;    // Kolom A
const COL_KEGIATAN = 2;  // Kolom B

// ================================================================
// MAIN HANDLER
// ================================================================

function doGet(e) {
  try {
    const tendik = readColumn(COL_TENDIK);
    const kegiatan = readColumn(COL_KEGIATAN);

    return returnSuccess({
      tendik: tendik,
      kegiatan: kegiatan,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return returnError(error.message);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'addSetting':
        return handleAdd(payload);
      case 'editSetting':
        return handleEdit(payload);
      case 'deleteSetting':
        return handleDelete(payload);
      default:
        return returnError("Action '" + action + "' tidak dikenali");
    }
  } catch (error) {
    return returnError(error.message);
  }
}

// ================================================================
// ACTION HANDLERS
// ================================================================

/**
 * TAMBAH item baru
 * Payload: { action: "addSetting", type: "tendik"|"kegiatan", value: "nama" }
 */
function handleAdd(payload) {
  const type = payload.type;
  const value = payload.value;

  if (!type || !value) {
    return returnError("type dan value harus diisi");
  }

  const col = (type === "tendik") ? COL_TENDIK : COL_KEGIATAN;

  // Cek duplikat
  const existing = readColumn(col);
  if (existing.includes(value.trim())) {
    return returnError('"' + value + '" sudah ada');
  }

  // Tambah ke kolom
  appendToColumn(col, value.trim());

  return returnSuccess({
    message: value + " berhasil ditambahkan",
    type: type,
    value: value
  });
}

/**
 * EDIT item
 * Payload: { action: "editSetting", type: "tendik"|"kegiatan", oldValue: "...", newValue: "..." }
 */
function handleEdit(payload) {
  const type = payload.type;
  const oldValue = payload.oldValue;
  const newValue = payload.newValue;

  if (!type || !oldValue || !newValue) {
    return returnError("type, oldValue, dan newValue harus diisi");
  }

  const col = (type === "tendik") ? COL_TENDIK : COL_KEGIATAN;

  // Cari dan update
  const sheet = getSheet();
  const data = sheet.getRange(1, col, sheet.getLastRow(), 1).getValues();

  for (var i = 1; i < data.length; i++) { // Mulai dari 1 (skip header)
    if (String(data[i][0]).trim() === oldValue.trim()) {
      sheet.getRange(i + 1, col).setValue(newValue.trim());
      return returnSuccess({
        message: oldValue + " berhasil diubah menjadi " + newValue,
        type: type,
        oldValue: oldValue,
        newValue: newValue
      });
    }
  }

  return returnError('"' + oldValue + '" tidak ditemukan');
}

/**
 * HAPUS item
 * Payload: { action: "deleteSetting", type: "tendik"|"kegiatan", value: "nama" }
 */
function handleDelete(payload) {
  const type = payload.type;
  const value = payload.value;

  if (!type || !value) {
    return returnError("type dan value harus diisi");
  }

  const col = (type === "tendik") ? COL_TENDIK : COL_KEGIATAN;

  // Cari dan hapus (clear cell, lalu compact)
  const sheet = getSheet();
  const data = sheet.getRange(1, col, sheet.getLastRow(), 1).getValues();

  for (var i = 1; i < data.length; i++) { // Skip header
    if (String(data[i][0]).trim() === value.trim()) {
      // Clear cell
      sheet.getRange(i + 1, col).clearContent();
      
      // Compact: pindahkan data ke atas agar tidak ada gap kosong
      compactColumn(col);

      return returnSuccess({
        message: value + " berhasil dihapus",
        type: type,
        value: value
      });
    }
  }

  return returnError('"' + value + '" tidak ditemukan');
}

// ================================================================
// SHEET OPERATIONS
// ================================================================

/**
 * Ambil sheet object
 */
function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Coba ambil sheet pertama jika nama tidak ditemukan
    sheet = ss.getSheets()[0];
  }
  
  return sheet;
}

/**
 * Baca semua data dari kolom tertentu (skip header row 1)
 */
function readColumn(col) {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return []; // Kosong atau hanya header
  
  var data = sheet.getRange(2, col, lastRow - 1, 1).getValues(); // Mulai row 2 (skip header)
  
  // Filter kosong
  var result = [];
  for (var i = 0; i < data.length; i++) {
    var val = String(data[i][0]).trim();
    if (val !== "" && val !== "undefined" && val !== "null") {
      result.push(val);
    }
  }
  
  return result;
}

/**
 * Tambah data ke baris kosong pertama di kolom tertentu
 */
function appendToColumn(col, value) {
  var sheet = getSheet();
  var data = sheet.getRange(1, col, sheet.getLastRow() + 1, 1).getValues();
  
  // Cari baris kosong pertama setelah header
  var targetRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0] || String(data[i][0]).trim() === "") {
      targetRow = i + 1;
      break;
    }
  }
  
  // Kalau tidak ada baris kosong, tambah di bawah
  if (targetRow === -1) {
    targetRow = data.length + 1;
  }
  
  sheet.getRange(targetRow, col).setValue(value);
}

/**
 * Compact kolom - pindahkan semua data ke atas tanpa gap kosong
 * Dipanggil setelah delete untuk rapihkan data
 */
function compactColumn(col) {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return;
  
  var data = sheet.getRange(2, col, lastRow - 1, 1).getValues();
  
  // Kumpulkan data yang tidak kosong
  var compacted = [];
  for (var i = 0; i < data.length; i++) {
    var val = String(data[i][0]).trim();
    if (val !== "" && val !== "undefined" && val !== "null") {
      compacted.push([val]);
    }
  }
  
  // Clear kolom (dari row 2 ke bawah)
  sheet.getRange(2, col, lastRow - 1, 1).clearContent();
  
  // Tulis ulang data yang sudah compact
  if (compacted.length > 0) {
    sheet.getRange(2, col, compacted.length, 1).setValues(compacted);
  }
}

// ================================================================
// RESPONSE HELPERS
// ================================================================

function returnSuccess(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "success",
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function returnError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "error",
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ================================================================
// SETUP - Jalankan sekali untuk buat header
// ================================================================

/**
 * Jalankan fungsi ini SEKALI untuk setup header di sheet
 * Pilih setupSheet() > klik Run
 */
function setupSheet() {
  var sheet = getSheet();
  
  // Set header row 1
  sheet.getRange(1, COL_TENDIK).setValue("NAMA TENDIK");
  sheet.getRange(1, COL_KEGIATAN).setValue("NAMA KEGIATAN");
  
  // Format header (bold)
  sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
  
  Logger.log("Setup selesai! Header sudah dibuat.");
  Logger.log("Kolom A = NAMA TENDIK");
  Logger.log("Kolom B = NAMA KEGIATAN");
}

// ================================================================
// TEST FUNCTIONS - Jalankan untuk test
// ================================================================

function testGetData() {
  var tendik = readColumn(COL_TENDIK);
  var kegiatan = readColumn(COL_KEGIATAN);
  Logger.log("Tendik: " + JSON.stringify(tendik));
  Logger.log("Kegiatan: " + JSON.stringify(kegiatan));
}

function testAddTendik() {
  var result = handleAdd({ action: "addSetting", type: "tendik", value: "Test Tendik" });
  Logger.log(result.getContent());
}

function testAddKegiatan() {
  var result = handleAdd({ action: "addSetting", type: "kegiatan", value: "Test Kegiatan" });
  Logger.log(result.getContent());
}
