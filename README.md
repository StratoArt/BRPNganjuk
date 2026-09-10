# Bayer Rewards Plus — Live Website

## Isi
- `index.html` = dashboard web, siap di-host di GitHub Pages.
- `google-apps-script_Code.gs` = backend Google Sheets.

## Setup
1. Upload/open template `Bayer_Rewards_Plus_Google_Sheet_Template.xlsx` di Google Sheets.
2. Buka Extensions → Apps Script.
3. Paste isi `google-apps-script_Code.gs`.
4. Ganti `PASTE_GOOGLE_SHEET_ID_HERE` dengan ID spreadsheet.
5. Deploy → New deployment → Web app.
6. Jalankan sebagai akun pemilik dan beri akses sesuai kebutuhan.
7. Copy URL Web App.
8. Buka `index.html`, isi `APPS_SCRIPT_URL` dengan URL tersebut.
9. Upload `index.html` ke repository GitHub Pages.

## Catatan keamanan
Dashboard ini menampilkan data retailer. Jangan jadikan endpoint agregat/data mentah publik jika berisi informasi yang tidak boleh diketahui umum. Untuk penggunaan internal, sebaiknya dashboard dibatasi aksesnya atau endpoint hanya mengembalikan agregat.

Dashboard otomatis memakai demo data jika URL backend belum diisi.
