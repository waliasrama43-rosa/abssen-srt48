# ⚡ Setup Guide Cepat - 5 Menit

Panduan singkat untuk setup sistem absensi SRT48 dari awal.

---

## Step 1️⃣ - Persiapan Google Sheets (2 Menit)

### A. Buat Spreadsheet Baru
1. Pergi ke [google.com/sheets](https://google.com/sheets)
2. Klik **"+ Blank"** untuk buat spreadsheet baru
3. Rename menjadi: **"absen_settings"**

### B. Setup Sheets
1. Rename sheet pertama: **"Tendik"**
   - Kolom A1: Ketik `NAMA TENDIK`

2. Tambah sheet kedua: **"Kegiatan"**
   - Kolom A1: Ketik `NAMA KEGIATAN`

### C. Catat Sheet ID
1. Lihat URL: `https://docs.google.com/spreadsheets/d/[ID_PANJANG]/edit`
2. Copy bagian **[ID_PANJANG]** - ini yang kita butuhkan nanti

**Contoh ID:**
```
1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S
```

---

## Step 2️⃣ - Setup Google Apps Script (2 Menit)

### A. Buat Project GAS
1. Pergi ke [script.google.com](https://script.google.com)
2. Klik **"+ New project"**
3. Rename: **"Absensi SRT48"**

### B. Copy Kode
1. Buka file `Apps_Script_Code.gs` dari repository
2. Copy seluruh kode
3. Paste ke editor Google Apps Script (hapus kode default)

### C. Update Sheet ID
Di Apps Script, cari line 21:
```javascript
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
```

Ganti dengan ID dari Step 1C:
```javascript
const SHEET_ID = "1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S";
```

### D. Inisialisasi Sheets
1. Di atas editor, pilih function: **"setupSheets"**
2. Klik tombol **▶️ Run**
3. Berikan permission saat diminta
4. Cek apakah ada error di bawah

### E. Deploy Web App
1. Klik **"Deploy"** (pojok kanan atas)
2. Pilih **"New deployment"**
3. Di dropdown icon, pilih: **"Web app"**
4. Isi settings:
   - Execute as: **Pilih email Anda**
   - Who has access: **"Anyone"**
5. Klik **"Deploy"**
6. **COPY URL** yang muncul (panjang)

**Contoh URL:**
```
https://script.google.com/macros/s/AKfycbz3sE7UYoTFg.../exec
```

---

## Step 3️⃣ - Update Frontend (1 Menit)

### Update index.html
1. Buka file `index.html`
2. Cari line ~362: `const URL_GAS = `
3. Ganti value dengan URL dari Step 2E:

```javascript
const URL_GAS = "https://script.google.com/macros/s/AKfycbz3sE7UYoTFg.../exec";
```

---

## Step 4️⃣ - Test (Bonus!)

### Buka dan Test Aplikasi
1. Buka file `index.html` di browser
2. Tunggu sampai data muncul
3. Coba fitur:
   - ✅ Tambah Tendik
   - ✅ Edit Tendik  
   - ✅ Hapus Tendik
   - ✅ Tambah Kegiatan
   - ✅ Edit Kegiatan
   - ✅ Hapus Kegiatan

### Debug Jika Ada Error
- Buka **F12** → **Console**
- Lihat error messages
- Baca section "Troubleshooting" di README.md

---

## 🎉 Selesai!

Aplikasi admin absensi SRT48 sudah siap digunakan.

### File yang Sudah Disetup:
- ✅ Google Sheets dengan 2 sheets (Tendik, Kegiatan)
- ✅ Google Apps Script dengan backend logic
- ✅ Frontend HTML dengan UI modern
- ✅ Fitur Add, Edit, Delete

### File yang Tersedia:
- `index.html` - Frontend aplikasi
- `Apps_Script_Code.gs` - Backend GAS
- `README.md` - Dokumentasi lengkap
- `SETUP_GUIDE.md` - File ini

---

## 📞 Tips & Trik

### Jika ingin...

**Menambah data awal ke Sheets:**
1. Buka Google Sheets "absen_settings"
2. Di sheet "Tendik", ketik nama tendik di A2, A3, dst
3. Di sheet "Kegiatan", ketik kegiatan di A2, A3, dst
4. Refresh halaman `index.html` untuk lihat datanya

**Mengubah warna tema:**
1. Buka `index.html`
2. Cari bagian `:root { --primary-color: ... }`
3. Edit color values (bisa copy dari [colorhexa.com](https://www.colorhexa.com))

**Hosting di internet:**
1. Pilih salah satu:
   - GitHub Pages (gratis)
   - Netlify (gratis)
   - Vercel (gratis)
   - Your own server
2. Upload file `index.html`
3. Share link ke pengguna

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| Data tidak muncul | Cek URL_GAS sudah benar, Check F12 Console |
| Sheet not found error | Jalankan setupSheets() di GAS |
| Permission denied | Update deployment settings di GAS |
| Modal tidak bisa ditutup | Tekan Esc atau klik tombol Batal |

---

Untuk dokumentasi lengkap, buka **README.md**
