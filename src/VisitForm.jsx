import React, { useState, useEffect } from 'react'
import { saveRow } from './api.js'
import { recordVisitedOutlet } from './localSummary.js'

function todayISO() {
  var d = new Date()
  var m = String(d.getMonth() + 1).padStart(2, '0')
  var day = String(d.getDate()).padStart(2, '0')
  return d.getFullYear() + '-' + m + '-' + day
}

function isoToDDMMYYYY(iso) {
  if (!iso) return ''
  var parts = iso.split('-')
  return parts[2] + '/' + parts[1] + '/' + parts[0]
}

export default function VisitForm(props) {
  var schema = props.schema
  var customers = props.customers
  var products = props.products || []
  var dropdowns = props.dropdowns || {}
  var visitedToday = props.visitedToday || []

  var headerFields = schema.fields.filter(function (f) { return f.group === 'header' })
  var productFields = schema.fields.filter(function (f) { return f.group === 'product' })

  function resolveOptions(f, currentValues) {
    if (f.dependsOn && f.optionsByValue) {
      return f.optionsByValue[currentValues[f.dependsOn]] || []
    }
    if (f.optionsKey && dropdowns[f.optionsKey] && dropdowns[f.optionsKey].length > 0) {
      return dropdowns[f.optionsKey]
    }
    return f.options || []
  }

  function emptyValuesFor(fields) {
    var v = {}
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i]
      v[f.name] = f.type === 'date' ? todayISO() : ''
    }
    return v
  }

  var stateHeader = useState(function () { return emptyValuesFor(headerFields) })
  var header = stateHeader[0]
  var setHeader = stateHeader[1]

  var stateProductDraft = useState(function () { return emptyValuesFor(productFields) })
  var productDraft = stateProductDraft[0]
  var setProductDraft = stateProductDraft[1]

  var stateProductList = useState([])
  var productList = stateProductList[0]
  var setProductList = stateProductList[1]

  var stateStatus = useState(null)
  var status = stateStatus[0]
  var setStatus = stateStatus[1]

  var stateSaving = useState(false)
  var saving = stateSaving[0]
  var setSaving = stateSaving[1]

  useEffect(function () {
    setHeader(emptyValuesFor(headerFields))
    setProductDraft(emptyValuesFor(productFields))
    setProductList([])
    setStatus(null)
    // eslint-disable-next-line
  }, [])

  function handleHeaderChange(name, val) {
    var next = Object.assign({}, header)
    next[name] = val
    setHeader(next)
  }

  function handleDraftChange(name, val) {
    var next = Object.assign({}, productDraft)
    next[name] = val
    setProductDraft(next)
  }

  function addProductToList() {
    for (var i = 0; i < productFields.length; i++) {
      var f = productFields[i]
      if (f.required && !productDraft[f.name]) {
        setStatus({ type: 'error', message: 'Isi dulu: ' + f.label })
        return
      }
    }
    setProductList(productList.concat([productDraft]))
    setProductDraft(emptyValuesFor(productFields))
    setStatus(null)
  }

  function removeProductFromList(index) {
    var next = productList.slice()
    next.splice(index, 1)
    setProductList(next)
  }

  function buildOrderedValues(productItem) {
    var combined = Object.assign({}, header, productItem)
    var ordered = []
    for (var i = 0; i < schema.fields.length; i++) {
      var field = schema.fields[i]
      var v = combined[field.name]
      if (field.type === 'date' && v) v = isoToDDMMYYYY(v)
      ordered.push(v === undefined ? '' : v)
    }
    return ordered
  }

  function handleSubmitAll() {
    for (var i = 0; i < headerFields.length; i++) {
      var f = headerFields[i]
      if (f.required && !header[f.name]) {
        setStatus({ type: 'error', message: 'Isi dulu: ' + f.label })
        return
      }
    }
    if (productList.length === 0) {
      setStatus({ type: 'error', message: 'Tambahkan minimal 1 produk dulu sebelum simpan.' })
      return
    }

    setSaving(true)
    setStatus(null)

    var rows = productList.map(buildOrderedValues)
    var i2 = 0
    var failedAny = false

    function saveNext() {
      if (i2 >= rows.length) {
        setSaving(false)
        if (failedAny) {
          setStatus({ type: 'error', message: 'Sebagian produk gagal tersimpan, coba cek koneksi lalu ulangi.' })
        } else {
          setStatus({ type: 'success', message: productList.length + ' produk untuk outlet "' + header.customer + '" tersimpan!' })
          recordVisitedOutlet(header.customer)
          if (props.onSaved) props.onSaved(schema.sheet, productList.length)
          // Reset semua: outlet baru, tanggal tetap hari ini
          var freshHeader = emptyValuesFor(headerFields)
          setHeader(freshHeader)
          setProductList([])
          setProductDraft(emptyValuesFor(productFields))
        }
        return
      }
      saveRow(schema.sheet, rows[i2]).then(function (res) {
        if (!res || !res.ok) failedAny = true
        i2 += 1
        saveNext()
      })
    }
    saveNext()
  }

  function renderField(f, values, onChange, disabledUntilParent) {
    var waitingOnParent = f.dependsOn && !values[f.dependsOn]
    return (
      <div className="field" key={f.name}>
        <label>{f.label}{f.required ? ' *' : ''}</label>

        {f.type === 'text' && (
          <input type="text" value={values[f.name]} onChange={function (e) { onChange(f.name, e.target.value) }} />
        )}

        {f.type === 'number' && (
          <input type="number" inputMode="decimal" value={values[f.name]} onChange={function (e) { onChange(f.name, e.target.value) }} />
        )}

        {f.type === 'date' && (
          <input type="date" value={values[f.name]} onChange={function (e) { onChange(f.name, e.target.value) }} />
        )}

        {f.type === 'textarea' && (
          <textarea rows={3} value={values[f.name]} onChange={function (e) { onChange(f.name, e.target.value) }} />
        )}

        {f.type === 'select' && (
          <select value={values[f.name]} disabled={waitingOnParent} onChange={function (e) { onChange(f.name, e.target.value) }}>
            <option value="">{waitingOnParent ? '-- Pilih dulu --' : '-- Pilih --'}</option>
            {resolveOptions(f, values).map(function (opt) { return <option value={opt} key={opt}>{opt}</option> })}
          </select>
        )}

        {f.type === 'customerSelect' && (
          <div>
            <input
              list="customer-options"
              type="text"
              placeholder="Ketik untuk cari customer..."
              value={values[f.name]}
              onChange={function (e) { onChange(f.name, e.target.value) }}
            />
            <datalist id="customer-options">
              {customers.map(function (c) { return <option value={c} key={c} /> })}
            </datalist>
          </div>
        )}

        {f.type === 'productSelect' && (
          <div>
            <input
              list="product-options"
              type="text"
              placeholder="Ketik untuk cari produk..."
              value={values[f.name]}
              onChange={function (e) { onChange(f.name, e.target.value) }}
            />
            <datalist id="product-options">
              {products.map(function (p) { return <option value={p} key={p} /> })}
            </datalist>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="form">
      <h2 className="form-title">{schema.label}</h2>

      {visitedToday.length > 0 && (
        <div className="visited-banner">
          <div className="visited-banner-title">{visitedToday.length} outlet sudah divisit hari ini</div>
          <div className="visited-banner-list">
            {visitedToday.map(function (name) {
              return <span className="visited-chip" key={name}>{name}</span>
            })}
          </div>
        </div>
      )}

      <div className="visit-section">
        <h3 className="visit-section-title">Data Outlet (isi sekali)</h3>
        {headerFields.map(function (f) { return renderField(f, header, handleHeaderChange) })}
      </div>

      <div className="visit-section">
        <h3 className="visit-section-title">Tambah Produk</h3>
        {productFields.map(function (f) { return renderField(f, productDraft, handleDraftChange) })}
        <button type="button" className="link-btn add-product-btn" onClick={addProductToList}>
          + Tambah Produk ke Daftar
        </button>
      </div>

      {productList.length > 0 && (
        <div className="visit-section">
          <h3 className="visit-section-title">Produk yang akan disimpan ({productList.length})</h3>
          {productList.map(function (item, idx) {
            return (
              <div className="product-list-item" key={idx}>
                <div>
                  <strong>{item.produk}</strong> — {item.qty} zak/bal
                  <div className="product-list-sub">{item.supplierType}{item.supplierName ? ' · ' + item.supplierName : ''}</div>
                </div>
                <button type="button" className="remove-btn" onClick={function () { removeProductFromList(idx) }}>Hapus</button>
              </div>
            )
          })}
        </div>
      )}

      {status && <div className={'status ' + status.type}>{status.message}</div>}

      <button type="button" className="submit-btn" disabled={saving} onClick={handleSubmitAll}>
        {saving ? 'Menyimpan...' : 'Simpan Semua Produk (' + productList.length + ')'}
      </button>
    </div>
  )
}
