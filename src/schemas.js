// Definisi field untuk tiap form. Urutan field HARUS sama dengan
// urutan kolom di SHEET_COLUMNS pada Code.gs.

export var SCHEMAS = {
  Visit: {
    label: 'Visit Customer',
    sheet: 'Visit',
    fields: [
      { name: 'tanggal', label: 'Tanggal Visit', type: 'date', required: true },
      { name: 'customer', label: 'Nama Customer', type: 'customerSelect', required: true },
      { name: 'produk', label: 'Nama Produk', type: 'text', required: true },
      { name: 'qty', label: 'AMS Qty (Zak/Bal)', type: 'number', required: true },
      { name: 'konversi', label: 'Konversi (kg/Zak)', type: 'number', default: 25 },
      { name: 'supplierType', label: 'Supplier Type', type: 'select', options: ['Interflour', 'Competitor'], required: true },
      { name: 'supplierName', label: 'Supplier Name', type: 'text' },
      { name: 'stokSupplier', label: 'Stok Supplier', type: 'number' },
      { name: 'hargaBeli', label: 'Harga Beli', type: 'number' },
      { name: 'hargaJual', label: 'Harga Jual', type: 'number' },
      { name: 'tujuan', label: 'Tujuan', type: 'textarea' },
      { name: 'issue', label: 'Issue', type: 'textarea' },
      { name: 'actionPlan', label: 'Action Plan', type: 'textarea' },
      { name: 'timeline', label: 'Timeline', type: 'text' },
      { name: 'asmVisit', label: 'ASM Visit', type: 'select', options: ['Ya', 'Tidak'] },
      { name: 'tcdVisit', label: 'TCD Visit', type: 'select', options: ['Ya', 'Tidak'] }
    ]
  },
  DailyLog: {
    label: 'Kegiatan Harian',
    sheet: 'DailyLog',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'kegiatan', label: 'Kegiatan', type: 'select',
        options: ['Internal Meeting', 'Visit Customer', 'Reporting', 'OffDuty', 'Training', 'Perjalanan', 'Lainnya'],
        required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  NonVisit: {
    label: 'Non Visit',
    sheet: 'NonVisit',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'kegiatan', label: 'Kegiatan', type: 'select',
        options: ['Survey Pasar', 'Cek Kompetitor', 'Distribusi Brosur', 'Koordinasi Distributor', 'Lainnya'],
        required: true },
      { name: 'durasi', label: 'Durasi', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  OffDuty: {
    label: 'Off Duty',
    sheet: 'OffDuty',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'tipe', label: 'Tipe', type: 'select', options: ['Cuti', 'Sakit', 'Libur Nasional', 'Izin', 'Lainnya'], required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  Akuisisi: {
    label: 'Akuisisi',
    sheet: 'Akuisisi',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'customer', label: 'Customer', type: 'customerSelectOrNew', required: true },
      { name: 'tipeAkuisisi', label: 'Tipe Akuisisi', type: 'select',
        options: ['Customer Baru', 'Produk Baru di Customer Lama', 'Konversi dari Kompetitor', 'Lainnya'],
        required: true },
      { name: 'produk', label: 'Produk Interflour Akuisisi', type: 'text' },
      { name: 'jumlah', label: 'Jumlah (Zak/Box)', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  Customer: {
    label: 'Customer Baru',
    sheet: 'Customer',
    fields: [
      { name: 'namaCustomer', label: 'Nama Customer', type: 'text', required: true },
      { name: 'alamat', label: 'Alamat Customer', type: 'textarea' },
      { name: 'namaPasar', label: 'Nama Pasar', type: 'text' },
      { name: 'hariPasar', label: 'Hari Pasar', type: 'select',
        options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] },
      { name: 'provinsi', label: 'Provinsi', type: 'text' },
      { name: 'kotaKab', label: 'Kota/Kabupaten', type: 'text' },
      { name: 'kecamatan', label: 'Kecamatan', type: 'text' },
      { name: 'kelurahan', label: 'Kelurahan', type: 'text' },
      { name: 'kodePos', label: 'Kode Pos', type: 'text' },
      { name: 'pic', label: 'PIC Customer', type: 'text' },
      { name: 'telepon', label: 'Telepon', type: 'text' },
      { name: 'tglRegistrasi', label: 'Tanggal Registrasi', type: 'date' },
      { name: 'tglDidirikan', label: 'Tanggal Didirikan', type: 'text' },
      { name: 'market', label: 'Market', type: 'select', options: ['Grosir', 'Retail', 'Mix'] },
      { name: 'businessType', label: 'Business Type', type: 'text' },
      { name: 'region', label: 'Region', type: 'text' }
    ]
  }
};

export var TAB_ORDER = ['Visit', 'DailyLog', 'NonVisit', 'OffDuty', 'Akuisisi', 'Customer'];
