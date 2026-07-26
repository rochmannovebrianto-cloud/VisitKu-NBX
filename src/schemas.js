// Definisi field untuk tiap form. Urutan field HARUS sama dengan
// urutan kolom di SHEET_COLUMNS pada Code.gs.

var PROVINSI_OPTIONS = [
  'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Kalimantan Utara',
  'Kalimantan Barat', 'Kalimantan Timur', 'Kalimantan Selatan', 'Kalimantan Tengah',
  'Jawa Timur', 'Jawa Tengah', 'Yogyakarta', 'Bali', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Barat',
  'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo', 'Maluku Utara', 'Maluku',
  'Papua Barat', 'Papua'
];
var REGION_OPTIONS = [
  'Sulawesi 1', 'Sulawesi 2', 'Kalimantan', 'Nusra Bali', 'Maluku Papua',
  'East Java', 'Central Java', 'Northern Sumatera'
];

export var SCHEMAS = {
  Visit: {
    label: 'Visit Customer',
    sheet: 'Visit',
    fields: [
      { name: 'tanggal', label: 'Tanggal Visit', type: 'date', required: true },
      { name: 'customer', label: 'Nama Customer', type: 'customerSearchSelect', required: true },
      { name: 'produk', label: 'Nama Produk', type: 'productSelect', required: true },
      { name: 'qty', label: 'AMS Qty (Zak/Bal)', type: 'number', required: true },
      { name: 'supplierType', label: 'Supplier Type', type: 'select', optionsKey: 'SupplierType', options: ['Distributor', 'Grosir'], required: true },
      { name: 'supplierName', label: 'Supplier Name', type: 'text' },
      { name: 'stokSupplier', label: 'Stok Supplier', type: 'select', optionsKey: 'StokSupplier', options: ['Ready', 'Out of Stock'] },
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
  NonVisit: {
    label: 'Non Visit',
    sheet: 'NonVisit',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'kegiatan', label: 'Kegiatan', type: 'select', optionsKey: 'JenisKegiatan',
        options: ['Baking Demo', 'Sales Blitz or Topping Up', 'Job Training', 'Official Travel',
                  'External Meeting', 'Internal Meeting', 'Product Trial', 'Handling Compliant',
                  'Disposal of Expired Products', 'Reporting'],
        required: true },
      { name: 'durasi', label: 'Durasi', type: 'select', optionsKey: 'Durasi', options: ['Full Day', 'Half Day', 'Quarter Day'] },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  OffDuty: {
    label: 'Off Duty',
    sheet: 'OffDuty',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'tipe', label: 'Tipe', type: 'select', optionsKey: 'OffDutyTipe',
        options: ['Cuti', 'Dispensasi', 'Sakit', 'Libur Nasional', 'Cuti Bersama', 'Akhir Pekan'],
        required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  Akuisisi: {
    label: 'Akuisisi',
    sheet: 'Akuisisi',
    fields: [
      { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
      { name: 'customer', label: 'Customer', type: 'customerSelect', required: true },
      { name: 'tipeAkuisisi', label: 'Tipe Akuisisi', type: 'select', optionsKey: 'TipeAkuisisi',
        options: ['New Item Product', 'Increase Drop Size', 'Selling Blitz / Topping Up'],
        required: true },
      { name: 'produk', label: 'Produk Interflour Akuisisi', type: 'productSelect' },
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
      { name: 'hariPasar', label: 'Hari Pasar', type: 'select', optionsKey: 'HariPasar',
        options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] },
      { name: 'provinsi', label: 'Provinsi', type: 'select', optionsKey: 'Provinsi', options: PROVINSI_OPTIONS },
      { name: 'kotaKab', label: 'Kota/Kabupaten', type: 'text' },
      { name: 'kecamatan', label: 'Kecamatan', type: 'text' },
      { name: 'kelurahan', label: 'Kelurahan', type: 'text' },
      { name: 'kodePos', label: 'Kode Pos', type: 'text' },
      { name: 'pic', label: 'PIC Customer', type: 'text' },
      { name: 'telepon', label: 'Telepon', type: 'text' },
      { name: 'tglRegistrasi', label: 'Tanggal Registrasi', type: 'date' },
      { name: 'tglDidirikan', label: 'Tanggal Didirikan', type: 'text' },
      { name: 'market', label: 'Market', type: 'select', optionsKey: 'Market', options: ['GeneralMarket', 'EndUser'] },
      { name: 'businessType', label: 'Business Type', type: 'select', optionsKey: 'BusinessType',
        options: ['General Market', 'Modern Trade', 'UKM', 'Institusi'] },
      { name: 'region', label: 'Region', type: 'select', optionsKey: 'Region', options: REGION_OPTIONS }
    ]
  }
};

export var TAB_ORDER = ['Visit', 'NonVisit', 'OffDuty', 'Akuisisi', 'Customer'];
