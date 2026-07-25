# VisitKu Nabire

PWA untuk isi 6 tabel kuning (Visit, Kegiatan Harian, Non Visit, Off Duty, Akuisisi, Customer Baru)
dari HP, langsung tersimpan ke Google Sheets `VisitKu_Nabire.xlsx`.

## Setup (sekali saja)

### 1. Siapkan Google Sheet
1. Upload `VisitKu_Nabire.xlsx` ke Google Drive.
2. Klik kanan > Buka dengan > Google Sheets.
3. Copy Sheet ID dari URL: `docs.google.com/spreadsheets/d/SHEET_ID_INI/edit`.

### 2. Setup Apps Script (backend)
1. Di Google Sheet, buka **Extensions > Apps Script**.
2. Hapus isi default, paste isi file `apps-script/Code.gs`.
3. Ganti `SPREADSHEET_ID` di baris atas dengan Sheet ID dari langkah 1.
4. Klik **Deploy > New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik **Deploy**, copy **Web app URL** yang muncul.

### 3. Hubungkan PWA ke Apps Script
1. Buka `src/api.js`.
2. Ganti `PASTE_APPS_SCRIPT_WEB_APP_URL_DISINI` dengan URL dari langkah 2.
3. Commit & push perubahan ini.

### 4. Install & jalankan lokal (opsional, untuk cek dulu)
```bash
npm install
npm run dev
```

### 5. Deploy ke GitHub Pages
1. Push repo ini ke GitHub dengan nama repo `visitku-nbx`.
2. Di GitHub: **Settings > Pages > Source > GitHub Actions**.
3. Push ke branch `main` — workflow di `.github/workflows/deploy.yml` otomatis build & deploy.
4. Setelah selesai, app bisa diakses di:
   `https://<username-github>.github.io/VisitKu-NBX/`

### 6. Tambah ke Home Screen HP
1. Buka URL di atas lewat Chrome di HP.
2. Menu (titik tiga) > **Tambahkan ke layar Utama**.
3. Sekarang bisa dibuka seperti aplikasi biasa.

## Struktur

- `src/schemas.js` — definisi field tiap form (nama, tipe, opsi dropdown). Edit di sini kalau mau ubah/tambah field.
- `src/DynamicForm.jsx` — komponen form generik, dipakai semua 6 form.
- `src/api.js` — koneksi ke Apps Script (POST simpan data, GET daftar customer).
- `apps-script/Code.gs` — backend yang tulis data ke Google Sheets.

## Kalau mau ubah field

Edit `src/schemas.js` — tambah/kurangi objek di array `fields`. **Penting:** urutan field
di sini harus sama persis dengan urutan kolom di `SHEET_COLUMNS` pada `apps-script/Code.gs`,
supaya data masuk ke kolom yang benar.

## Kalau 300 baris per tabel sudah penuh

Kasih tahu Claude untuk perluas kapasitas baris di file Excel, lalu update juga
`LAST_DATA_ROW` di `apps-script/Code.gs`.
