// Ganti dengan URL Web App Apps Script kamu setelah deploy
export var API_URL = 'https://script.google.com/macros/s/AKfycbwcani-iKvkda2IAqYD1nucsI7EQSEJ8gCSyMf37OaY-k2pCzbdnyJ51ABEAii_sK-6FQ/exec';

export function saveRow(sheetName, values) {
  var payload = { sheet: sheetName, values: values };
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      // Content-Type text/plain menghindari CORS preflight ke Apps Script
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(payload)
  })
    .then(function (res) { return res.json(); })
    .catch(function (err) {
      return { ok: false, message: 'Gagal terhubung ke server: ' + err.message };
    });
}

export function fetchCustomers() {
  var url = API_URL + '?action=customers';
  return fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.ok) return data.customers;
      return [];
    })
    .catch(function () {
      return [];
    });
}
