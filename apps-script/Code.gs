// ============================================================
// VISITKU NABIRE - Apps Script Backend
// ============================================================
// SETUP:
// 1. Buka Google Sheet VisitKu Nabire kamu.
// 2. Extensions > Apps Script.
// 3. Hapus isi default, paste seluruh file ini.
// 4. Ganti SPREADSHEET_ID di bawah dengan ID sheet kamu.
// 5. Deploy > New deployment > Web app.
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy URL Web App yang dihasilkan, paste ke src/api.js (API_URL).
// ============================================================

var SPREADSHEET_ID = '1eTWbma-MsUKEZmYiXqAfyNlt8sY8HLAnjlcoVInxJ78';
var FIRST_DATA_ROW = 3;
var LAST_DATA_ROW = 302;

// Kolom manual (yang diisi form) per sheet, dalam urutan field di form.
// Kolom lain (mis. F & R di Visit) sudah berisi rumus dan tidak disentuh.
var SHEET_COLUMNS = {
  Customer: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],
  Visit: ['A','B','C','D','G','H','I','J','K','L','M','N','O','P','Q'],
  NonVisit: ['A','B','C','D','E'],
  OffDuty: ['A','B','C'],
  Akuisisi: ['A','B','C','D','E','F']
};

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function findFirstEmptyRow_(sheet) {
  for (var r = FIRST_DATA_ROW; r <= LAST_DATA_ROW; r++) {
    var val = sheet.getRange(r, 1).getValue();
    if (val === '' || val === null) {
      return r;
    }
  }
  return -1;
}

function doPost(e) {
  var result = { ok: false, message: '' };
  try {
    var body = JSON.parse(e.postData.contents);
    var sheetName = body.sheet;
    var values = body.values;

    if (!SHEET_COLUMNS[sheetName]) {
      result.message = 'Sheet tidak dikenal: ' + sheetName;
      return jsonOutput_(result);
    }

    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      result.message = 'Sheet tidak ditemukan di spreadsheet: ' + sheetName;
      return jsonOutput_(result);
    }

    var row = findFirstEmptyRow_(sheet);
    if (row === -1) {
      result.message = 'Sheet ' + sheetName + ' penuh (300 baris). Hubungi admin untuk perluasan.';
      return jsonOutput_(result);
    }

    var columns = SHEET_COLUMNS[sheetName];
    for (var i = 0; i < columns.length; i++) {
      var colLetter = columns[i];
      var colIndex = columnLetterToIndex_(colLetter);
      var value = values[i];
      if (value === undefined) value = '';
      sheet.getRange(row, colIndex).setValue(value);
    }

    result.ok = true;
    result.row = row;
    result.message = 'Tersimpan di baris ' + row;
  } catch (err) {
    result.message = 'Error: ' + err.toString();
  }
  return jsonOutput_(result);
}

function doGet(e) {
  var result = { ok: false };
  try {
    var action = e.parameter.action;
    var ss = getSpreadsheet_();

    if (action === 'customers') {
      var sheet = ss.getSheetByName('Customer');
      var names = [];
      for (var r = FIRST_DATA_ROW; r <= LAST_DATA_ROW; r++) {
        var name = sheet.getRange(r, 1).getValue();
        if (name !== '' && name !== null) {
          names.push(name);
        }
      }
      result.ok = true;
      result.customers = names;
    } else if (action === 'products') {
      var psheet = ss.getSheetByName('Produk');
      var lastRow = psheet.getLastRow();
      var products = [];
      for (var pr = 3; pr <= lastRow; pr++) {
        var pname = psheet.getRange(pr, 1).getValue();
        if (pname !== '' && pname !== null) {
          products.push(pname);
        }
      }
      result.ok = true;
      result.products = products;
    } else {
      result.message = 'Unknown action';
    }
  } catch (err) {
    result.message = 'Error: ' + err.toString();
  }
  return jsonOutput_(result);
}

function jsonOutput_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function columnLetterToIndex_(letter) {
  var col = 0;
  for (var i = 0; i < letter.length; i++) {
    col = col * 26 + (letter.charCodeAt(i) - 64);
  }
  return col;
}
