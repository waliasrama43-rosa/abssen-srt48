# 🎓 Admin Absensi SRT48

Sistem manajemen admin untuk aplikasi absensi SRT48. Kelola Tendik (Tenaga Didik) dan Kegiatan dengan mudah melalui interface yang user-friendly.

**Status:** ✅ Lengkap dengan fitur Add, Edit, Delete

---

## 📋 Daftar Isi

1. [Fitur](#fitur)
2. [Teknologi](#teknologi)
3. [Setup Cepat](#setup-cepat)
4. [Panduan Lengkap](#panduan-lengkap)
5. [Struktur File](#struktur-file)
6. [API Documentation](#api-documentation)
7. [Troubleshooting](#troubleshooting)

---

## ✨ Fitur

- ✅ **Kelola Tendik** - Tambah, Edit, Hapus tenaga didik
- ✅ **Kelola Kegiatan** - Tambah, Edit, Hapus jenis kegiatan  
- ✅ **Interface Modern** - Design responsive dan user-friendly
- ✅ **Real-time Data** - Terhubung langsung dengan Google Sheets
- ✅ **Modal Dialogs** - Form yang intuitif untuk input data
- ✅ **Alert Notifications** - Feedback instan untuk setiap aksi
- ✅ **Validasi Data** - Cegah duplikat dan input kosong

---

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Backend**: Google Apps Script (GAS)
- **Database**: Google Sheets
- **Deployment**: Google Apps Script Web App

---

## 🚀 Setup Cepat

### Langkah 1: Siapkan Google Sheets

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama **"absen_settings"**
3. Rename sheet pertama menjadi **"Tendik"**
4. Tambah sheet kedua dengan nama **"Kegiatan"**
5. Di setiap sheet, ketik header:
   - Tendik sheet: Kolom A1 = "NAMA TENDIK"
   - Kegiatan sheet: Kolom A1 = "NAMA KEGIATAN"

6. **Catat ID Sheets** dari URL (contoh URL):
   ```
   https://docs.google.com/spreadsheets/d/[COPY_ID_INI]/edit
   ```

### Langkah 2: Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. **Ganti nama**: Ubah nama project menjadi "Absensi SRT48"
4. Copy seluruh kode dari file `Apps_Script_Code.gs`
5. Paste ke editor Apps Script
6. **Penting**: Edit line ke-21:
   ```javascript
   const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
   ```
   Ganti dengan ID Sheets yang sudah dicatat di Langkah 1

7. Jalankan function `setupSheets`:
   - Pilih function: `setupSheets`
   - Klik tombol ▶️ Run
   - Berikan permission untuk akses Sheets

8. **Deploy sebagai Web App**:
   - Klik "Deploy" → "New deployment"
   - Pilih type: "Web app"
   - Pilih "Execute as": User email Anda
   - Pilih "Who has access": "Anyone"
   - Klik "Deploy"
   - **Copy URL** yang muncul

### Langkah 3: Update Frontend

1. Buka file `index.html`
2. Cari line ke-362 (cari `const URL_GAS`)
3. Ganti value dengan URL dari Langkah 2.8:
   ```javascript
   const URL_GAS = "https://script.google.com/macros/s/[PASTE_ID_INI]/exec";
   ```

### Langkah 4: Buka dan Test

1. Buka file `index.html` di browser (atau upload ke web hosting)
2. Halaman akan loading data dari Sheets
3. Test fitur: Tambah, Edit, Hapus Tendik/Kegiatan

---

## 📚 Panduan Lengkap

### File-File Project

```
abssen-srt48/
├── index.html              # Frontend - Aplikasi admin panel utama
├── Apps_Script_Code.gs     # Backend - Kode Google Apps Script
├── README.md               # File dokumentasi ini (LENGKAP)
└── SETUP_GUIDE.md          # Panduan setup step-by-step (optional)
```

### Cara Menggunakan

#### ✅ Menambah Tendik atau Kegiatan

1. Klik tombol **"➕ Tambah Tendik Baru"** atau **"➕ Tambah Kegiatan Baru"**
2. Modal dialog akan muncul
3. Ketik nama di field input
4. Klik **"Tambah"**
5. Data akan langsung tersimpan di Google Sheets

#### ✏️ Mengubah Tendik atau Kegiatan

1. Dari list, klik tombol **"✏️ Edit"** di samping item
2. Modal dialog muncul dengan nilai saat ini
3. Edit nama yang ingin diubah
4. Klik **"Update"**
5. Perubahan akan disimpan

#### 🗑️ Menghapus Tendik atau Kegiatan

1. Dari list, klik tombol **"🗑️ Hapus"** di samping item
2. Konfirmasi akan muncul
3. Klik OK untuk menghapus
4. Item akan dihapus dari Sheets

#### ⌨️ Keyboard Shortcuts

- **Enter** - Submit form di modal
- **Esc** - Tutup modal
- **Click outside** - Tutup modal

---

## 📁 Struktur File

### index.html

```html
<head>
  - Bootstrap CSS untuk styling
  - Custom CSS untuk tampilan modern
  - Responsive design
</head>

<body>
  - Header dengan judul
  - Alert notification area
  - Loading state
  - Content area (Tendik + Kegiatan sections)
  - Modal dialog untuk add/edit
  - Footer

  <script>
    - Configuration (URL_GAS, state management)
    - Lifecycle hooks (DOMContentLoaded)
    - Data loading dari GAS
    - UI rendering functions
    - Modal management
    - API functions (CRUD)
    - Utility functions
  </script>
</body>
```

### Apps_Script_Code.gs

```javascript
// Configuration & Global Variables
const SHEET_ID = "..."
const SHEET_NAMES = { TENDIK, KEGIATAN }

// Main Handlers
doGet(e)        - Handle GET request
doPost(e)       - Handle POST request
handleRequest() - Router utama

// Action Handlers
handleAdd()     - Tambah item baru
handleEdit()    - Edit item yang ada
handleDelete()  - Hapus item
handleGet()     - Baca data

// Sheet Operations
readSheet()     - Baca dari sheet
appendToSheet() - Tambah baris
updateInSheet() - Update row
deleteFromSheet() - Hapus row

// Response Helpers
returnSuccess() - Kirim response sukses
returnError()   - Kirim response error

// Setup & Utilities
setupSheets()   - Inisialisasi structure
testGetData()   - Test function
debugSheets()   - Debug data
```

---

## 🔗 API Documentation

### Request Format

Semua request menggunakan JSON format.

#### GET Request - Ambil Semua Data

```
GET https://script.google.com/macros/s/[ID]/exec

Response:
{
  "status": "success",
  "data": {
    "tendik": ["Budi", "Siti", ...],
    "kegiatan": ["Rapat", "Validasi", ...],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST Request - Add Item

```
POST https://script.google.com/macros/s/[ID]/exec

Body:
{
  "action": "addSetting",
  "type": "tendik",           // atau "kegiatan"
  "value": "Nama Item Baru"
}

Response:
{
  "status": "success",
  "data": {
    "message": "Nama Item Baru berhasil ditambahkan",
    "type": "tendik",
    "value": "Nama Item Baru"
  }
}
```

#### POST Request - Edit Item

```
POST https://script.google.com/macros/s/[ID]/exec

Body:
{
  "action": "editSetting",
  "type": "tendik",
  "oldValue": "Nama Lama",
  "newValue": "Nama Baru"
}

Response:
{
  "status": "success",
  "data": {
    "message": "Nama Lama berhasil diubah menjadi Nama Baru",
    "type": "tendik",
    "oldValue": "Nama Lama",
    "newValue": "Nama Baru"
  }
}
```

#### POST Request - Delete Item

```
POST https://script.google.com/macros/s/[ID]/exec

Body:
{
  "action": "deleteSetting",
  "type": "kegiatan",
  "value": "Nama Item"
}

Response:
{
  "status": "success",
  "data": {
    "message": "Nama Item berhasil dihapus",
    "type": "kegiatan",
    "value": "Nama Item"
  }
}
```

#### POST Request - Get Specific Data

```
POST https://script.google.com/macros/s/[ID]/exec

Body:
{
  "action": "getSetting",
  "type": "tendik"
}

Response:
{
  "status": "success",
  "data": {
    "type": "tendik",
    "data": ["Budi", "Siti", "Ahmad"]
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Deskripsi error di sini"
}
```

---

## 🧪 Troubleshooting

### ❌ Data tidak muncul saat halaman dibuka

**Solusi:**
1. Buka browser console (F12 → Console)
2. Cek apakah ada error messages
3. Pastikan `URL_GAS` di index.html sudah benar
4. Cek Google Apps Script sudah di-deploy
5. Pastikan Sheets ID di Apps Script sudah benar

### ❌ "Sheet tidak ditemukan" error

**Solusi:**
1. Buka Google Sheets
2. Pastikan ada 2 sheets: "Tendik" dan "Kegiatan" (case-sensitive!)
3. Jalankan `setupSheets()` di Apps Script
4. Refresh halaman

### ❌ "action tidak dikenali" error

**Solusi:**
1. Cek payload JSON yang dikirim sudah benar
2. Pastikan "action" valuenya: `addSetting`, `editSetting`, `deleteSetting`, atau `getSetting`
3. Lihat browser console untuk detail error

### ❌ Perubahan data tidak tersimpan

**Solusi:**
1. Cek network tab di browser (F12 → Network)
2. Pastikan fetch request berhasil (status 200)
3. Lihat response dari server
4. Cek Google Apps Script logs (lihat Execution log)

### ❌ Modal tidak bisa ditutup

**Solusi:**
- Tekan tombol **Batal**
- Atau tekan **Esc** di keyboard
- Atau klik area gelap di luar modal

### ❌ "Permission denied" error

**Solusi:**
1. Di Apps Script, klik "Deploy" → "Manage deployments"
2. Klik edit untuk deployment yang aktif
3. Pastikan "Execute as" = User Anda
4. Pastikan "Who has access" = "Anyone"
5. Klik Update

---

## 🔐 Security Notes

- URL endpoint GAS bersifat publik (siapa saja bisa akses)
- Untuk production, tambahkan authentication layer
- Jangan hard-code sensitive data di frontend
- Pertimbangkan menambah validasi di backend

---

## 📞 Support & Contribution

Jika menemukan bug atau ada pertanyaan:
1. Buka Issues di GitHub
2. Sertakan: Browser, Error message, Screenshot
3. Jelaskan langkah-langkah untuk reproduce

---

## 📄 Lisensi

Project ini open-source dan bebas digunakan untuk keperluan apapun.

---

## 🎯 Roadmap

- [ ] Export data ke CSV/PDF
- [ ] Import data dari Excel
- [ ] User authentication
- [ ] Activity logging
- [ ] Data backup otomatis
- [ ] Multi-language support

---

**Last Updated:** Januari 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅