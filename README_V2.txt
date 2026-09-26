Bayer Rewards Plus Dashboard — V2

FITUR BARU
1. Status Rewards Plus dipecah menjadi:
   - Aktif & Rutin Scan Poin
   - Terdaftar tetapi Jarang Scan
   - Terdaftar Tidak Pernah Scan
   - Belum Terdaftar
2. Dashboard menampilkan KPI terpisah untuk Jarang Scan dan Tidak Pernah Scan.
3. Pie chart partisipasi mengikuti 4 status tersebut.
4. Tabel Retailer Response memiliki tombol Detail dan Edit.
5. Detail retailer menampilkan seluruh profil, Q1-Q10, kompetitor, kendala, ekspektasi hadiah, dan saran.
6. Edit data menyimpan perubahan kembali ke Google Sheets berdasarkan Response_ID.
7. Analisis Q1-Q10 lebih detail: rata-rata, persentase skor 1-2, netral, skor 4-5, concern, ringkasan per kelompok.
8. Analisis Kendala Utama menggunakan kategorisasi kata kunci dan tetap menandai bahwa hasilnya adalah indikasi awal.
9. PWA/mobile-first tetap dipertahankan.

PENTING: BACKEND
File Code.gs di paket ini adalah backend versi baru. Apps Script Web App yang sedang dipakai harus diperbarui dengan isi Code.gs ini lalu DEPLOY AS NEW VERSION pada deployment yang sama.

Langkah Apps Script:
1. Buka Google Apps Script project yang saat ini digunakan.
2. Ganti isi Code.gs dengan Code.gs dari paket ini.
3. Save.
4. Deploy > Manage deployments.
5. Pilih deployment Web App yang URL-nya sama dengan API di index.html.
6. Edit deployment > Version: New version > Deploy.
7. Pastikan Execute as: Me dan akses: Anyone (sesuai konfigurasi deployment sebelumnya).
8. Test URL API?action=health.
9. Setelah itu website bisa menggunakan Detail/Edit.

GOOGLE SHEETS
Header RESPONSES yang digunakan:
Response_ID | Timestamp | Nama Kios / Toko | Lokasi | Lama Beroperasi | Kategori Kios | Komoditas Utama | Komoditas Lainnya | Status Rewards Plus | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Ikut Loyalty Kompetitor | Kompetitor | Perbandingan | Alasan Perbandingan | Kendala Utama | Ekspektasi Hadiah | Saran

DATA LAMA
Data lama dengan status “Terdaftar tetapi Jarang/Tidak Pernah Scan” tidak bisa dipisahkan otomatis karena spreadsheet lama hanya menyimpan satu status gabungan. Status tersebut tetap ditampilkan sebagai data lama dan bisa diubah manual melalui tombol Edit jika kategorinya sudah diketahui.

DEPLOY GITHUB PAGES
Upload/replace:
- index.html
- manifest.webmanifest
- service-worker.js
- icon-192.png
- icon-512.png

Code.gs TIDAK diupload ke GitHub Pages. Code.gs hanya untuk Google Apps Script backend.

UPDATE: Kompetitor sekarang mendukung multi-select: Syngenta, Corteva, FMC, BASF, MKD, Agricon, dan Other. Nilai disimpan sebagai daftar dipisahkan koma pada kolom Kompetitor.
