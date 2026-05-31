# ⚡ QUICK START - TL;DR VERSION

**Ringkasan singkat untuk menjalankan sistem dalam 5 menit**

---

## 🎯 5 STEPS ONLY

### 1️⃣ GOOGLE SHEETS (1 menit)
```
1. Pergi: https://sheets.google.com
2. Buat spreadsheet baru → Rename: "absen_settings"
3. Sheet 1: Rename ke "Tendik", A1 ketik "NAMA TENDIK"
4. Sheet 2: Tambah baru → Rename ke "Kegiatan", A1 ketik "NAMA KEGIATAN"
5. COPY Sheet ID dari URL:
   https://docs.google.com/spreadsheets/d/[COPY_INI]/edit
```

### 2️⃣ GOOGLE APPS SCRIPT (2 menit)
```
1. Pergi: https://script.google.com
2. Buat project baru → Copy kode dari Apps_Script_Code.gs
3. Line 21: Ganti 
   const SHEET_ID = "PASTE_SHEET_ID_DARI_STEP1";
4. Save (Ctrl+S)
5. Jalankan setupSheets(): 
   - Pilih "setupSheets" di dropdown
   - Klik Run ▶️
   - Allow permissions
6. Deploy sebagai Web App:
   - Klik Deploy → New deployment
   - Type: Web app
   - Execute as: Your email
   - Who has access: Anyone
   - Deploy
   - COPY URL WEB APP
```

### 3️⃣ UPDATE FRONTEND (1 menit)
```
1. Buka index.html di text editor
2. Cari: const URL_GAS = 
3. Ganti dengan URL dari Step 2:
   const URL_GAS = "https://script.google.com/macros/s/[PASTE_URL]/exec";
4. Save
```

### 4️⃣ BUKA APLIKASI (30 detik)
```
1. Double-click index.html
2. Browser akan terbuka
3. Tunggu loading selesai
```

### 5️⃣ TEST (30 detik)
```
1. Klik "➕ Tambah Tendik Baru"
2. Ketik nama, klik Tambah
3. Seharusnya muncul di list dan di Google Sheets
4. Test Edit dan Delete ✓
```

---

## 📋 FINAL CHECKLIST

| ✅ | Task |
|----|------|
| ☐ | Sheets ID dicatat |
| ☐ | Sheet ID di-update di Apps Script (line 21) |
| ☐ | setupSheets() berhasil dijalankan |
| ☐ | Web App sudah di-deploy & URL dicatat |
| ☐ | URL_GAS di index.html sudah updated |
| ☐ | index.html berhasil dibuka di browser |
| ☐ | Test Tambah/Edit/Hapus berhasil |

---

## 🆘 COMMON ISSUES

| Problem | Fix |
|---------|-----|
| Data tidak muncul | Cek F12 console untuk error, pastikan URL benar |
| Sheet not found | Jalankan setupSheets() lagi |
| Permission denied | Update deployment di Apps Script |
| Modal tidak tutup | Tekan Esc atau klik Batal |

---

**DONE! 🎉**

Untuk detail lengkap, baca `PANDUAN_JALANKAN_SCRIPT.md`
