# 🚀 PANDUAN MENJALANKAN SCRIPT - LENGKAP & DETAIL

Panduan ini menjelaskan cara menjalankan seluruh sistem absensi SRT48 dari awal hingga akhir.

---

## 📋 DAFTAR ISI
1. [Yang Perlu Disiapkan](#yang-perlu-disiapkan)
2. [Step 1: Setup Google Sheets](#step-1-setup-google-sheets)
3. [Step 2: Setup Google Apps Script](#step-2-setup-google-apps-script)
4. [Step 3: Jalankan Script](#step-3-jalankan-script)
5. [Step 4: Koneksi ke Frontend](#step-4-koneksi-ke-frontend)
6. [Step 5: Test Aplikasi](#step-5-test-aplikasi)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Yang Perlu Disiapkan

Sebelum mulai, pastikan Anda punya:

- ✅ Akun Google (Gmail)
- ✅ Akses ke Google Sheets
- ✅ Akses ke Google Apps Script
- ✅ Browser modern (Chrome, Firefox, Safari, Edge)
- ✅ 3 file dari repository:
  - `index.html`
  - `Apps_Script_Code.gs`
  - File ini (panduan)

---

## **STEP 1: SETUP GOOGLE SHEETS**

### 1.1 Buat Spreadsheet Baru

```
1. Buka https://sheets.google.com
2. Klik tombol "+ Blank" (pojok kiri atas)
3. Spreadsheet baru akan terbuka
4. Rename (ubah nama) menjadi: "absen_settings"
   - Klik pada nama default "Untitled spreadsheet"
   - Ketik: absen_settings
   - Tekan Enter
```

### 1.2 Setup Sheet Pertama: "Tendik"

```
1. Rename sheet pertama dari "Sheet1" menjadi "Tendik"
   - Klik kanan pada tab "Sheet1" di bawah
   - Pilih "Rename sheet"
   - Ketik: Tendik
   - Klik OK

2. Di kolom A:
   - A1: Ketik "NAMA TENDIK"
   - A2: (kosong - siap untuk data)
```

**Contoh:**
```
┌─────────────────────┐
│ A                   │
├─────────────────────┤
│ NAMA TENDIK         │  <- Header
│                     │  <- Siap untuk data
│                     │
│                     │
└─────────────────────┘
```

### 1.3 Setup Sheet Kedua: "Kegiatan"

```
1. Tambah sheet baru
   - Klik tombol "+" di bawah (sebelah tab Tendik)
   
2. Rename menjadi "Kegiatan"
   - Klik kanan pada sheet baru
   - Pilih "Rename sheet"
   - Ketik: Kegiatan
   - Klik OK

3. Di kolom A:
   - A1: Ketik "NAMA KEGIATAN"
   - A2: (kosong - siap untuk data)
```

**Contoh:**
```
┌─────────────────────┐
│ A                   │
├─────────────────────┤
│ NAMA KEGIATAN       │  <- Header
│                     │  <- Siap untuk data
│                     │
│                     │
└─────────────────────┘
```

### 1.4 Catat Sheet ID

```
1. Lihat URL di address bar browser:
   https://docs.google.com/spreadsheets/d/[ID_PANJANG]/edit#gid=0

2. Sorot dan copy bagian [ID_PANJANG]
   
   Contoh URL lengkap:
   https://docs.google.com/spreadsheets/d/1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S/edit#gid=0
                                          ╰──────────────────────────────────╯
                                                  ID INI YANG DICOPY
```

3. **SAVE ID ini di Notepad** - kita butuh di step berikutnya!

---

## **STEP 2: SETUP GOOGLE APPS SCRIPT**

### 2.1 Buat Project Google Apps Script Baru

```
1. Buka https://script.google.com
2. Klik "+ New project" (pojok kiri atas)
3. Script editor akan terbuka
4. Rename project:
   - Klik pada nama default "Untitled project" (pojok atas)
   - Ketik: Absensi SRT48
   - Tekan Enter
```

### 2.2 Copy Kode Google Apps Script

```
1. Buka file "Apps_Script_Code.gs" dari repository
2. Select semua kode (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Kembali ke Google Apps Script editor
5. Select semua kode default di editor (Ctrl+A)
6. Delete (tekan Delete)
7. Paste kode yang sudah dicopy (Ctrl+V / Cmd+V)
8. Klik Save (Ctrl+S)
```

### 2.3 Update Sheet ID di Script

Ini adalah langkah **PENTING**!

```
1. Di kode Google Apps Script, cari line 21:
   const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

2. Ganti dengan ID dari Step 1.4:
   const SHEET_ID = "1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S";

3. Klik Save (Ctrl+S)
```

**Visual Guide:**

```javascript
// ❌ SEBELUM (jangan begini):
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

// ✅ SESUDAH (begini!):
const SHEET_ID = "1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S";
```

---

## **STEP 3: JALANKAN SCRIPT**

### 3.1 Inisialisasi Sheets (PENTING!)

Langkah ini membuat struktur sheet dengan benar.

```
1. Di Google Apps Script, lihat dropdown di atas editor
   Biasanya tertulis "Select function"

2. Klik dropdown tersebut
3. Pilih fungsi: "setupSheets"
4. Klik tombol ▶️ (Run) yang berwarna biru

   ┌─────────────┬──────────┐
   │ setupSheets │ ▶️ Run   │
   └─────────────┴──────────┘

5. Browser akan minta permission:
   - Klik "Review permissions"
   - Pilih akun Google Anda
   - Klik "Allow"

6. Cek console untuk konfirmasi:
   - Buka menu "View" → "Logs"
   - Seharusnya ada pesan sukses:
     "Setup selesai!"
```

**Jika ada error:**
- Cek kembali Sheet ID di line 21
- Pastikan sheet "Tendik" dan "Kegiatan" ada di Google Sheets

### 3.2 Deploy sebagai Web App

Ini adalah langkah untuk membuat URL endpoint.

```
1. Di Google Apps Script, klik "Deploy" (pojok kanan atas)
   ┌──────────┐
   │ Deploy ▼ │
   └──────────┘

2. Klik "New deployment"

3. Di window baru:
   - Klik icon ⚙️ (Settings)
   - Pilih type: "Web app"
   - Klik "Create"

4. Isi settings di window baru:
   ┌─────────────────────────────────────┐
   │ Execute as:                         │
   │ [Pilih email/akun Google Anda] ▼    │
   │                                     │
   │ Who has access:                     │
   │ [Anyone] ▼                          │
   └─────────────────────────────────────┘

5. Klik "Deploy"

6. Akan muncul dialog:
   ┌──────────────────────────────────┐
   │ Deployment ID: ...               │
   │ Web app URL:                      │
   │ https://script.google.com/macros/ │
   │ s/[ID_PANJANG]/exec               │
   └──────────────────────────────────┘

7. **COPY URL WEB APP ini!**
   (Klik copy icon atau select semua dan Ctrl+C)

8. Klik "Close"
```

**URL akan terlihat seperti ini:**
```
https://script.google.com/macros/s/AKfycbz3sE7UYoTFgAClHIa4rWsOBSx_IFRCzHLFMnfdhhxLcOiKEiA9r52uF6mGqQ8SVAvh/exec
```

**SAVE URL ini di Notepad** - butuh di step berikutnya!

---

## **STEP 4: KONEKSI KE FRONTEND**

### 4.1 Update URL di index.html

```
1. Buka file "index.html" dengan text editor:
   - Notepad
   - Visual Studio Code
   - Sublime Text
   - atau editor apapun

2. Cari line ~362 (gunakan Ctrl+F untuk cari):
   const URL_GAS =

3. Seharusnya ada seperti ini:
   const URL_GAS = "https://script.google.com/macros/s/AKfycbz3sE7UYoTFgAClHIa4rWsOBSx_IFRCzHLFMnfdhhxLcOiKEiA9r52uF6mGqQ8SVAvh/exec";

4. Ganti URL dengan yang dari Step 3.2:
   const URL_GAS = "https://script.google.com/macros/s/[PASTE_URL_DARI_STEP_3.2]/exec";

5. Contoh final:
   const URL_GAS = "https://script.google.com/macros/s/AKfycbz3sE7UYoTFgAClHIa4rWsOBSx_IFRCzHLFMnfdhhxLcOiKEiA9r52uF6mGqQ8SVAvh/exec";

6. Save file (Ctrl+S)
```

---

## **STEP 5: TEST APLIKASI**

### 5.1 Buka Aplikasi

```
1. Buka file "index.html" dengan browser:
   - Double-click file index.html
   - Atau: Drag-drop ke browser window
   - Atau: Klik kanan → "Open with" → Browser pilihan

2. Browser akan membuka halaman admin panel

3. Tunggu sampai halaman fully loaded (cek loading spinner)
   Seharusnya tampil:
   - Header: "🎓 Admin Absensi SRT48"
   - Dua section: "Tendik" dan "Kegiatan"
```

### 5.2 Test Tambah Tendik

```
1. Klik tombol "➕ Tambah Tendik Baru"
2. Modal dialog akan pop-up
3. Ketik nama: "Budi Santoso"
4. Klik tombol "Tambah"
5. Seharusnya:
   - Alert hijau muncul: "Budi Santoso berhasil ditambahkan!"
   - "Budi Santoso" muncul di list
   - Data tersimpan di Google Sheets
```

### 5.3 Test Edit Tendik

```
1. Di list Tendik, klik tombol "✏️ Edit" samping "Budi Santoso"
2. Modal dialog muncul dengan nama "Budi Santoso"
3. Ubah menjadi: "Budi Wijaya"
4. Klik "Update"
5. Seharusnya:
   - Alert hijau: "Budi Santoso berhasil diubah menjadi Budi Wijaya!"
   - List update otomatis
   - Google Sheets update
```

### 5.4 Test Hapus Tendik

```
1. Klik tombol "🗑️ Hapus" samping "Budi Wijaya"
2. Confirm dialog akan muncul:
   "Yakin hapus "Budi Wijaya"? Tindakan ini tidak dapat dibatalkan."
3. Klik OK
4. Seharusnya:
   - Alert hijau: "Budi Wijaya berhasil dihapus!"
   - Item hilang dari list
   - Google Sheets update
```

### 5.5 Test Tambah Kegiatan

```
1. Scroll ke bawah ke section "Kegiatan"
2. Klik "➕ Tambah Kegiatan Baru"
3. Ketik: "Rapat Rutin"
4. Klik "Tambah"
5. "Rapat Rutin" muncul di list
```

### 5.6 Test Fitur Lainnya

Ulangi test Edit dan Hapus untuk section Kegiatan.

---

## 🎉 SELESAI!

Jika semua test berhasil, artinya sistem sudah berjalan dengan baik!

---

## 🐛 TROUBLESHOOTING

### ❌ Masalah: "Network error" atau "Fetch failed"

**Penyebab:** URL_GAS salah atau tidak tersambung

**Solusi:**
```
1. Buka browser console (F12 → Console)
2. Cek error message yang muncul
3. Kembali ke Step 4.1
4. Pastikan URL_GAS sudah benar (copy-paste dari Step 3.2)
5. Refresh browser (F5)
```

### ❌ Masalah: "Sheet 'Tendik' tidak ditemukan"

**Penyebab:** Sheet ID salah atau sheet belum dibuat

**Solusi:**
```
1. Buka Google Sheets "absen_settings"
2. Pastikan ada 2 sheets: "Tendik" dan "Kegiatan"
3. Pastikan Sheet ID di Apps Script benar (Step 2.3)
4. Jalankan setupSheets() lagi (Step 3.1)
5. Refresh halaman index.html
```

### ❌ Masalah: "Permission denied"

**Penyebab:** Deployment tidak punya akses

**Solusi:**
```
1. Buka Google Apps Script
2. Klik "Deploy" → "Manage deployments"
3. Edit deployment yang aktif
4. Pastikan:
   - Execute as: Akun Google Anda
   - Who has access: "Anyone"
5. Klik Update
6. Refresh halaman index.html
```

### ❌ Masalah: Data tidak muncul saat halaman dibuka

**Penyebab:** Script belum siap atau ada error

**Solusi:**
```
1. Buka browser console (F12 → Console)
2. Lihat error messages
3. Tunggu lebih lama (loading mungkin lambat)
4. Pastikan internet connection aktif
5. Cek Google Sheets apakah ada data
6. Refresh halaman
```

### ❌ Masalah: Modal tidak bisa ditutup

**Penyebab:** Bug minor

**Solusi:**
```
1. Tekan tombol "Batal" di modal
2. Atau tekan tombol "Esc" di keyboard
3. Atau reload halaman (F5)
```

### ❌ Masalah: Data tidak tersimpan

**Penyebab:** Fetch request gagal

**Solusi:**
```
1. Cek network tab di browser (F12 → Network)
2. Lihat response dari URL_GAS
3. Pastikan status code: 200 (success)
4. Cek Google Sheets apakah data sudah ada
5. Cek error di Google Apps Script console
```

---

## 📞 DEBUG TIPS

### Melihat Logs di Google Apps Script

```
1. Buka Google Apps Script
2. Pilih function yang ingin di-debug
3. Klik Run
4. Buka menu "View" → "Execution log"
5. Lihat logs untuk melihat apa yang terjadi
```

### Melihat Errors di Browser

```
1. Buka browser
2. Tekan F12
3. Klik tab "Console"
4. Lihat semua error messages
5. Biasanya ada clue tentang masalahnya
```

### Test API Manual

```
1. Buka browser console (F12 → Console)
2. Ketik:
   fetch("https://[URL_GAS_ANDA]/exec")
   .then(r => r.json())
   .then(d => console.log(d))

3. Tekan Enter
4. Lihat response dari server
```

---

## ✅ CHECKLIST SETUP FINAL

Sebelum di-deploy, pastikan:

```
☐ Google Sheets "absen_settings" sudah dibuat
☐ Sheet "Tendik" sudah ada (dengan header di A1)
☐ Sheet "Kegiatan" sudah ada (dengan header di A1)
☐ Sheet ID sudah dicatat
☐ Apps Script project sudah dibuat
☐ Apps_Script_Code.gs sudah di-copy
☐ Sheet ID sudah di-update di line 21
☐ setupSheets() sudah dijalankan
☐ Web App sudah di-deploy
☐ Web App URL sudah dicatat
☐ index.html sudah di-update dengan URL
☐ index.html sudah di-save
☐ Aplikasi sudah ditest (Add/Edit/Delete)
☐ Data muncul di Google Sheets
☐ Semua test berhasil ✅
```

---

## 🚀 NEXT STEPS

Setelah sistem berjalan:

1. **Tambah data awal** ke Google Sheets manual (opsional)
2. **Share halaman** kepada user lain
3. **Host di internet** (GitHub Pages, Netlify, etc)
4. **Backup data** secara regular
5. **Monitor penggunaan** dan performance

---

**Selesai! Sistem Absensi SRT48 siap digunakan! 🎉**

Untuk pertanyaan lebih lanjut, lihat README.md atau hubungi admin.
