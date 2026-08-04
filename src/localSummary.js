// Menghitung jumlah input hari ini langsung di HP (localStorage),
// tanpa perlu tarik data dari Google Sheets - jadi instan, tanpa loading.

var TRACKED_SHEETS = ['Visit', 'NonVisit', 'OffDuty', 'Akuisisi']

function todayKey() {
  var d = new Date()
  var m = String(d.getMonth() + 1).padStart(2, '0')
  var day = String(d.getDate()).padStart(2, '0')
  return 'visitku_summary_' + d.getFullYear() + '-' + m + '-' + day
}

function todayOutletKey() {
  return todayKey() + '_outlets'
}

function emptyCounts() {
  var counts = {}
  for (var i = 0; i < TRACKED_SHEETS.length; i++) {
    counts[TRACKED_SHEETS[i]] = 0
  }
  return counts
}

export function getTodayCounts() {
  try {
    var raw = window.localStorage.getItem(todayKey())
    if (!raw) return emptyCounts()
    var parsed = JSON.parse(raw)
    var counts = emptyCounts()
    for (var i = 0; i < TRACKED_SHEETS.length; i++) {
      var key = TRACKED_SHEETS[i]
      if (typeof parsed[key] === 'number') counts[key] = parsed[key]
    }
    return counts
  } catch (err) {
    return emptyCounts()
  }
}

export function recordSubmission(sheetName) {
  if (TRACKED_SHEETS.indexOf(sheetName) === -1) return getTodayCounts()
  var counts = getTodayCounts()
  counts[sheetName] = counts[sheetName] + 1
  try {
    window.localStorage.setItem(todayKey(), JSON.stringify(counts))
  } catch (err) {
    // localStorage unavailable - counts just won't persist across reloads
  }
  return counts
}

// ---- Outlet yang sudah divisit hari ini (khusus sheet Visit) ----

export function getTodayVisitedOutlets() {
  try {
    var raw = window.localStorage.getItem(todayOutletKey())
    if (!raw) return []
    var parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    return []
  }
}

export function recordVisitedOutlet(customerName) {
  if (!customerName) return getTodayVisitedOutlets()
  var list = getTodayVisitedOutlets()
  if (list.indexOf(customerName) === -1) {
    list.push(customerName)
    try {
      window.localStorage.setItem(todayOutletKey(), JSON.stringify(list))
    } catch (err) {
      // localStorage unavailable
    }
  }
  return list
}

export function getTodayLabel() {
  var d = new Date()
  var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
}
