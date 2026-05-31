# 📊 VISUAL GUIDE - DIAGRAM & ILUSTRASI

Panduan visual untuk memahami alur kerja sistem.

---

## 🏗️ ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN PANEL (Frontend)                         │
│                      (index.html)                                │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Tambah Data │  │  Edit Data   │  │ Hapus Data   │            │
│  └────────────────────────────────────────────────┘            │
│                        ↓ (Fetch)                                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │   GOOGLE APPS SCRIPT (Backend)      │
        │  (Apps_Script_Code.gs)              │
        │                                     │
        │  • doGet() - Baca data             │
        │  • doPost() - Proses aksi          │
        │  • addSetting()                    │
        │  • editSetting()                   │
        │  • deleteSetting()                 │
        │  • readSheet()                     │
        │  • appendToSheet()                 │
        │  • updateInSheet()                 │
        │  • deleteFromSheet()               │
        └─────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │    GOOGLE SHEETS (Database)         │
        │   (absen_settings spreadsheet)      │
        │                                     │
        │  Sheet "Tendik":                    │
        │  ┌──────────────────────┐           │
        │  │ NAMA TENDIK          │           │
        │  │ Budi Santoso         │           │
        │  │ Siti Nurhaliza       │           │
        │  │ Ahmad Wijaya         │           │
        │  └──────────────────────┘           │
        │                                     │
        │  Sheet "Kegiatan":                  │
        │  ┌──────────────────────┐           │
        │  │ NAMA KEGIATAN        │           │
        │  │ Rapat Rutin          │           │
        │  │ Validasi Data        │           │
        │  └──────────────────────┘           │
        └─────────────────────────────────────┘
```

---

## 🔄 DATA FLOW - TAMBAH DATA

```
User Interface                  Backend                    Database
─────────────────────────────────────────────────────────────────────

1. User klik
   "Tambah Tendik"
        │
        ▼
2. Modal pop-up
   Input nama
        │
        ▼
3. Klik "Tambah"
        │
        ▼  (fetch POST)
   ┌────────────────────────────┐
   │ JSON POST:                 │
   │ {                          │
   │   action: "addSetting"     │
   │   type: "tendik"           │
   │   value: "Nama Baru"       │
   │ }                          │
   └────────────────────────────┘
            ║
            ║ (Request ke GAS)
            ╚════════════════════════╗
                                     ▼
                          4. Apps Script
                             menerima
                                │
                                ▼
                          5. Validasi:
                             • Cek duplikat
                             • Cek input kosong
                                │
                                ▼ (Valid)
                          6. appendToSheet()
                                │
                                ║
                                ║ (Write to Sheet)
                                ╚════════════════════╗
                                                     ▼
                                            7. Google Sheets
                                               simpan di A2+
                                                     │
                                                     ▼
                                            "Nama Baru" 
                                            tersimpan
                                                     │
                                     ┌──────────────┘
                                     │ (Response JSON)
                                     ▼
        ┌────────────────────────────────────┐
        │ JSON Response:                     │
        │ {                                  │
        │   status: "success"                │
        │   data: {                          │
        │     message: "berhasil ditambahkan"│
        │     value: "Nama Baru"             │
        │   }                                │
        │ }                                  │
        └────────────────────────────────────┘
                     ║
                     ║ (Response)
                     ╚════════════════╗
                                      ▼
8. Frontend terima                  9. UI Update:
   response                            • Alert "Berhasil!"
                                       • Item muncul di list
                                       • Modal tutup
                                            │
                                            ▼
                                       User senang ✅
```

---

## 📝 DATA FLOW - EDIT DATA

```
1. User klik "✏️ Edit"
        │
        ▼
2. Modal pop-up dengan nilai lama
        │
        ▼
3. User edit teks
        │
        ▼
4. Klik "Update"
        │
        ▼  (fetch POST)
   ┌──────────────────────────────┐
   │ JSON POST:                   │
   │ {                            │
   │   action: "editSetting"      │
   │   type: "tendik"             │
   │   oldValue: "Nama Lama"      │
   │   newValue: "Nama Baru"      │
   │ }                            │
   └──────────────────────────────┘
            ║
            ║ (ke GAS)
            ╚════════════════╗
                             ▼
                  5. GAS updateInSheet()
                     Cari "Nama Lama"
                     Ganti dengan "Nama Baru"
                             │
                             ║ (Write)
                             ╚════╗
                                  ▼
                        6. Sheets update
                                  │
                     ┌────────────┘
                     │ (Response)
                     ▼
        7. Alert: "Berhasil diubah!"
        8. List update otomatis
```

---

## 🗑️ DATA FLOW - HAPUS DATA

```
1. User klik "🗑️ Hapus"
        │
        ▼
2. Confirm dialog:
   "Yakin hapus?"
        │
        ▼
3. Klik OK
        │
        ▼  (fetch POST)
   ┌─────────────────────────┐
   │ JSON POST:              │
   │ {                       │
   │   action: "deleteSetting"
   │   type: "tendik"        │
   │   value: "Nama"         │
   │ }                       │
   └─────────────────────────┘
            ║
            ║ (ke GAS)
            ╚════════════════╗
                             ▼
                  4. GAS deleteFromSheet()
                     Cari row dengan "Nama"
                     Delete row tersebut
                             │
                             ║ (Delete)
                             ╚════╗
                                  ▼
                        5. Row dihapus dari Sheets
                                  │
                     ┌────────────┘
                     │ (Response)
                     ▼
        6. Alert: "Berhasil dihapus!"
        7. Item hilang dari list
```

---

## 📂 FILE STRUCTURE

```
abssen-srt48/
│
├── 📄 index.html
│   └─ Frontend aplikasi admin panel
│      • HTML structure (header, sections, modal)
│      • CSS styling (Bootstrap 5, custom)
│      • JavaScript logic (700+ lines)
│      • State management
│      • Fetch API calls
│
├── 📄 Apps_Script_Code.gs
│   └─ Backend Google Apps Script
│      • doGet(e) - Handle GET requests
│      • doPost(e) - Handle POST requests
│      • handleAdd() - Tambah data
│      • handleEdit() - Edit data
│      • handleDelete() - Hapus data
│      • readSheet() - Baca dari Sheets
│      • appendToSheet() - Tambah row
│      • updateInSheet() - Edit row
│      • deleteFromSheet() - Hapus row
│      • Response helpers
│      • Setup functions
│
├── 📘 README.md
│   └─ Dokumentasi lengkap (15+ sections)
│      • Fitur overview
│      • Setup instructions
│      • API documentation
│      • Troubleshooting
│      • Security notes
│
├── 📗 SETUP_GUIDE.md
│   └─ Quick start 5-menit
│      • Step-by-step setup
│      • Common issues
│      • Tips & tricks
│
├── 📙 PANDUAN_JALANKAN_SCRIPT.md
│   └─ Panduan detail (INI)
│      • Setup Google Sheets
│      • Setup Google Apps Script
│      • Jalankan script
│      • Koneksi ke frontend
│      • Test aplikasi
│      • Troubleshooting
│
├── 📕 QUICK_START.md
│   └─ TL;DR version
│      • 5 steps only
│      • Quick checklist
│
└── 📓 VISUAL_GUIDE.md
    └─ Diagram & ilustrasi (FILE INI)
```

---

## 🔗 REQUEST/RESPONSE FORMAT

### GET Request - Ambil Data

```
REQUEST:
┌────────────────────────────────────────┐
│ GET /exec                              │
│ (No body)                              │
└────────────────────────────────────────┘
            ↓
         GAS
            ↓
RESPONSE:
┌────────────────────────────────────────┐
│ {                                      │
│   "status": "success",                 │
│   "data": {                            │
│     "tendik": [                        │
│       "Budi",                          │
│       "Siti",                          │
│       "Ahmad"                          │
│     ],                                 │
│     "kegiatan": [                      │
│       "Rapat",                         │
│       "Validasi"                       │
│     ],                                 │
│     "timestamp": "2024-01-15T..."      │
│   }                                    │
│ }                                      │
└────────────────────────────────────────┘
```

### POST Request - Add/Edit/Delete

```
REQUEST:
┌────────────────────────────────────────┐
│ POST /exec                             │
│                                        │
│ Body (JSON):                           │
│ {                                      │
│   "action": "addSetting",              │
│   "type": "tendik",                    │
│   "value": "Nama Baru"                 │
│ }                                      │
└────────────────────────────────────────┘
            ↓
         GAS
         Process
            ↓
RESPONSE:
┌────────────────────────────────────────┐
│ {                                      │
│   "status": "success",                 │
│   "data": {                            │
│     "message": "berhasil ditambahkan", │
│     "type": "tendik",                  │
│     "value": "Nama Baru"               │
│   }                                    │
│ }                                      │
└────────────────────────────────────────┘
```

---

## 🎨 UI COMPONENTS

### Header Section
```
┌─────────────────────────────────────────┐
│  🎓 Admin Absensi SRT48                 │
│  Kelola Tendik dan Kegiatan dengan mudah│
└─────────────────────────────────────────┘
```

### Alert Notification
```
SUCCESS:
┌─────────────────────────────────────────┐
│ ✅ Budi Santoso berhasil ditambahkan!   │
└─────────────────────────────────────────┘

ERROR:
┌─────────────────────────────────────────┐
│ ⚠️ Nama tidak boleh kosong!             │
└─────────────────────────────────────────┘
```

### Data List Item
```
┌──────────────────────────────────────────────┐
│ ▌ Budi Santoso      [✏️ Edit] [🗑️ Hapus]    │
└──────────────────────────────────────────────┘
```

### Add/Edit Modal
```
┌─────────────────────────────────┐
│ ✏️ Edit Tendik                  │
├─────────────────────────────────┤
│                                 │
│ Nama Tendik:                    │
│ ┌─────────────────────────────┐ │
│ │ Budi Santoso              │ │
│ └─────────────────────────────┘ │
│                                 │
│  [Batal]  [Update]              │
│                                 │
└─────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA

### Google Sheets: "absen_settings"

**Sheet 1: "Tendik"**
```
Column A: NAMA TENDIK
Row 1:    NAMA TENDIK (Header)
Row 2:    Budi Santoso
Row 3:    Siti Nurhaliza
Row 4:    Ahmad Wijaya
Row 5:    Eka Putri
...
```

**Sheet 2: "Kegiatan"**
```
Column A: NAMA KEGIATAN
Row 1:    NAMA KEGIATAN (Header)
Row 2:    Rapat Rutin
Row 3:    Validasi Data
Row 4:    Input Attendance
Row 5:    Report
...
```

---

## 🔐 SECURITY FLOW

```
User → Browser → HTTPS → Google Apps Script
                                    ↓
                            Validasi Input
                                    ↓
                            Check Permissions
                                    ↓
                            Execute Action
                                    ↓
                            Google Sheets
```

**Security Features:**
- ✅ Input validation (no empty strings)
- ✅ Duplicate checking
- ✅ Error handling
- ✅ Public URL (consider adding auth for production)

---

## ⚙️ JAVASCRIPT EVENT FLOW

```
Page Load
    ↓
window.addEventListener('DOMContentLoaded', initApp)
    ↓
initApp()
    ├─→ loadData()  (GET dari GAS)
    │       ↓
    │   renderUI()
    │       ├─→ renderTendikList()
    │       └─→ renderKegiatanList()
    │
    └─→ Show content area
          Hide loading
    
User Actions:
    ├─→ Click "Tambah" → openAddModal()
    ├─→ Click "Edit" → openEditModal()
    ├─→ Click "Hapus" → confirm() → deleteItem()
    ├─→ Submit Modal → submitModal()
    │                      ├─→ Validate input
    │                      ├─→ POST ke GAS
    │                      ├─→ Reload data
    │                      └─→ Render UI
    └─→ Close Modal → closeModal()
```

---

## 📱 RESPONSIVE DESIGN

```
DESKTOP (> 768px):
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│  [Tendik Section]   [Kegiatan Section]  │
│  ┌───────────────┐  ┌───────────────┐  │
│  │ • Item 1      │  │ • Item 1      │  │
│  │ • Item 2      │  │ • Item 2      │  │
│  └───────────────┘  └───────────────┘  │
└─────────────────────────────────────────┘

MOBILE (< 768px):
┌────────────────────────┐
│  Header                │
├────────────────────────┤
│  [Tendik Section]      │
│  ┌──────────────────┐  │
│  │ • Item 1         │  │
│  │ • Item 2         │  │
│  └──────────────────┘  │
│                        │
│  [Kegiatan Section]    │
│  ┌──────────────────┐  │
│  │ • Item 1         │  │
│  │ • Item 2         │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

## 🎯 SETUP FLOWCHART

```
START
  │
  ├─→ [1] Buat Google Sheets
  │       │
  │       ├─→ Create "absen_settings"
  │       ├─→ Add "Tendik" sheet
  │       ├─→ Add "Kegiatan" sheet
  │       └─→ Copy Sheet ID
  │
  ├─→ [2] Setup Google Apps Script
  │       │
  │       ├─→ Create project
  │       ├─→ Copy kode GAS
  │       ├─→ Update Sheet ID (line 21)
  │       ├─→ Run setupSheets()
  │       └─→ Deploy Web App → Copy URL
  │
  ├─→ [3] Update Frontend
  │       │
  │       ├─→ Open index.html
  │       ├─→ Update URL_GAS (line 362)
  │       └─→ Save
  │
  ├─→ [4] Open & Test
  │       │
  │       ├─→ Open index.html
  │       ├─→ Test Add
  │       ├─→ Test Edit
  │       └─→ Test Delete
  │
  └─→ END ✅
      SISTEM BERJALAN!
```

---

## 🐛 DEBUGGING FLOW

```
ERROR FOUND?
    │
    ├─→ Open F12 (Browser Console)
    │       └─→ Check error messages
    │
    ├─→ Check Network tab
    │       └─→ See fetch requests
    │
    ├─→ Check Google Apps Script
    │       ├─→ View → Execution log
    │       └─→ Run test functions
    │
    ├─→ Check Google Sheets
    │       ├─→ Sheets exist?
    │       ├─→ Data ada?
    │       └─→ Sheet ID benar?
    │
    └─→ FIXED! ✅
```

---

**Visual Guide Complete! 📊**

Untuk kode lengkap dan detail, lihat file-file lainnya.
