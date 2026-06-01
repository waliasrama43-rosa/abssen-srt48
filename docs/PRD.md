# EduSmart Asrama - Product Requirements Document

## Overview

EduSmart Asrama adalah platform SaaS manajemen asrama untuk pondok pesantren dan boarding school. Sistem ini mengelola kegiatan harian santri, pemantauan sarana prasarana, dan pelaporan otomatis.

## Key Features

### 1. Attendance & Activity Management
- Scan QR/NFC untuk absensi kegiatan
- Multi-kegiatan per hari (sholat, ngaji, makan, belajar, dll)
- Real-time monitoring kehadiran santri
- Auto-scoring berdasarkan kehadiran

### 2. Multi-Tenant Architecture
- Satu sistem untuk banyak sekolah/pesantren
- Isolasi data per tenant
- Konfigurasi independen per tenant
- Auto-sharding database per bulan

### 3. Offline-First PWA
- Tetap berfungsi tanpa internet
- Sync otomatis saat online kembali
- Cache data penting secara lokal
- Install sebagai native app

### 4. Role-Based Access
- **Admin Pusat**: Kelola semua tenant
- **Admin Sekolah**: Kelola satu tenant
- **Musyrif/ah**: Input kegiatan harian
- **Wali Santri**: Lihat laporan anak

### 5. Sarana Prasarana (Sarpras)
- Monitoring kondisi fasilitas
- Pelaporan kerusakan
- Tracking perbaikan
- Inventarisasi aset

### 6. Automated Reporting
- Laporan harian otomatis
- Rekap mingguan/bulanan
- Export PDF untuk wali santri
- Dashboard analytics

## Technical Requirements

### Performance
- First paint < 2 seconds
- Offline-capable within 5 seconds of first visit
- Touch-responsive (< 100ms feedback)

### Scalability
- Support 100+ tenants
- 10,000+ students per tenant
- Monthly auto-sharding for log data

### Security
- Session-based auth with expiry
- Tenant data isolation
- Input validation on all endpoints
- Rate limiting on auth endpoints

## Data Model

### Global Config Sheet
- tenant_registry: tenant_code, name, admin_email, master_sheet_id, status
- plans: plan_id, name, max_students, max_users, price

### Master Sheet (per tenant)
- users: user_id, username, password_hash, role, name, status
- students: student_id, name, class, room, parent_phone, status
- activities: activity_id, name, category, time, score_weight
- config: key, value

### Log Sheet (per tenant per month)
- attendance: timestamp, student_id, activity_id, status, scanned_by
- sarpras_reports: timestamp, item, condition, reporter, notes
- scores: student_id, activity_id, date, score, notes

## Phases

1. **Foundation**: PWA shell, auth, offline support, basic GAS backend
2. **Core**: Attendance scanning, activity management, student CRUD
3. **Reporting**: Dashboard analytics, PDF export, automated reports
4. **Advanced**: Multi-tenant billing, parent portal, notifications
