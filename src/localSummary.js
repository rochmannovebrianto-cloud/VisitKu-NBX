// Menghitung jumlah input hari ini langsung di HP (localStorage),
// tanpa perlu tarik data dari Google Sheets - jadi instan, tanpa loading.
//
// Visit & Akuisisi dihitung UNIK per customer (kalau toko yang sama
// diinput beberapa kali dalam sehari, tetap dihitung 1).
// NonVisit & OffDuty dihitung biasa (per input).

var DEDUPE_BY_CUSTOMER = ['Visit', 'Akuisisi']
var PLAIN_COUNT = ['NonVisit', 'OffDuty']
var TRACKED_SHEETS = DEDUPE_BY_CUSTOMER.concat(PLAIN_COUNT)

function todayKey() {
  var d = new Date()
  var m = String(d.getMonth() + 1).padStart(2, '0')
  var day = String(d.getDate()).padStart(2, '0')
  return 'visitku_summary_' + d.getFullYear() + '-' + m + '-' + day
}

function emptyData() {
  var data = {}
  for (var i = 0; i < DEDUPE_BY_CUSTOMER.length; i++) {
    data[DEDUPE_BY_CUSTOMER[i]] = []
  }
  for (var j = 0; j < PLAIN_COUNT.length; j++) {
    data[PLAIN_COUNT[j]] = 0
  }
  return data
}

function loadData() {
  try {
    var raw = window.localStorage.getItem(todayKey())
    if (!raw) return emptyData()
    var parsed = JSON.parse(raw)
    var data = emptyData()
    for (var i = 0; i < DEDUPE_BY_CUSTOMER.length; i++) {
      var key = DEDUPE_BY_CUSTOMER[i]
      if (Array.isArray(parsed[key])) data[key] = parsed[key]
    }
    for (var j = 0; j < PLAIN_COUNT.length; j++) {
      var pkey = PLAIN_COUNT[j]
      if (typeof parsed[pkey] === 'number') data[pkey] = parsed[pkey]
    }
    return data
  } catch (err) {
    return emptyData()
  }
}

function saveData(data) {
  try {
    window.localStorage.setItem(todayKey(), JSON.stringify(data))
  } catch (err) {
    // localStorage unavailable - counts just won't persist across reloads
  }
}

export function getTodayCounts() {
  var data = loadData()
  var counts = {}
  for (var i = 0; i < DEDUPE_BY_CUSTOMER.length; i++) {
    var key = DEDUPE_BY_CUSTOMER[i]
    counts[key] = data[key].length
  }
  for (var j = 0; j < PLAIN_COUNT.length; j++) {
    var pkey = PLAIN_COUNT[j]
    counts[pkey] = data[pkey]
  }
  return counts
}

// customerName hanya relevan untuk sheet Visit & Akuisisi (dedupe)
export function recordSubmission(sheetName, customerName) {
  if (TRACKED_SHEETS.indexOf(sheetName) === -1) return getTodayCounts()
  var data = loadData()

  if (DEDUPE_BY_CUSTOMER.indexOf(sheetName) !== -1) {
    var name = (customerName || '').trim().toLowerCase()
    if (name && data[sheetName].indexOf(name) === -1) {
      data[sheetName].push(name)
    }
  } else {
    data[sheetName] = data[sheetName] + 1
  }

  saveData(data)
  return getTodayCounts()
}

export function getTodayLabel() {
  var d = new Date()
  var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
}
