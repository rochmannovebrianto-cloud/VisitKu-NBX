import React, { useState, useEffect } from 'react'
import { saveRow } from './api.js'

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

export default function DynamicForm(props) {
  var schema = props.schema
  var customers = props.customers
  var products = props.products || []
  var dropdowns = props.dropdowns || {}

  function resolveOptions(f, currentValues) {
    if (f.dependsOn && f.optionsByValue) {
      var parentValue = currentValues[f.dependsOn]
      return f.optionsByValue[parentValue] || []
    }
    if (f.optionsKey && dropdowns[f.optionsKey] && dropdowns[f.optionsKey].length > 0) {
      return dropdowns[f.optionsKey]
    }
    return f.options || []
  }

  var initial = {}
  for (var i = 0; i < schema.fields.length; i++) {
    var f = schema.fields[i]
    if (f.type === 'date') {
      initial[f.name] = todayISO()
    } else if (f.default !== undefined) {
      initial[f.name] = f.default
    } else {
      initial[f.name] = ''
    }
  }

  var stateValues = useState(initial)
  var values = stateValues[0]
  var setValues = stateValues[1]

  var stateNewCustomer = useState('')
  var newCustomerMode = stateNewCustomer[0]
  var setNewCustomerMode = stateNewCustomer[1]

  var stateStatus = useState(null) // {type: 'success'|'error', message}
  var status = stateStatus[0]
  var setStatus = stateStatus[1]

  var stateSaving = useState(false)
  var saving = stateSaving[0]
  var setSaving = stateSaving[1]

  useEffect(function () {
    setValues(initial)
    setStatus(null)
    setNewCustomerMode(false)
    // eslint-disable-next-line
  }, [schema])

  function handleChange(name, val) {
    var next = Object.assign({}, values)
    next[name] = val
    // Kalau field ini punya field lain yang bergantung padanya (dependsOn),
    // kosongkan pilihan field turunan itu supaya tidak ada kombinasi yang salah
    for (var i = 0; i < schema.fields.length; i++) {
      var child = schema.fields[i]
      if (child.dependsOn === name) {
        next[child.name] = ''
      }
    }
    setValues(next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    for (var i = 0; i < schema.fields.length; i++) {
      var f = schema.fields[i]
      if (f.required && !values[f.name] && !(f.type === 'customerSelectOrNew' && newCustomerMode && values[f.name])) {
        setStatus({ type: 'error', message: 'Isi dulu: ' + f.label })
        return
      }
    }

    var orderedValues = []
    for (var j = 0; j < schema.fields.length; j++) {
      var field = schema.fields[j]
      var v = values[field.name]
      if (field.type === 'date' && v) {
        v = isoToDDMMYYYY(v)
      }
      orderedValues.push(v === undefined ? '' : v)
    }

    setSaving(true)
    setStatus(null)
    saveRow(schema.sheet, orderedValues).then(function (res) {
      setSaving(false)
      if (res && res.ok) {
        setStatus({ type: 'success', message: res.message || 'Tersimpan!' })
        setValues(initial)
        setNewCustomerMode(false)
        if (props.onSaved) props.onSaved(schema.sheet)
      } else {
        setStatus({ type: 'error', message: (res && res.message) || 'Gagal menyimpan.' })
      }
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form-title">{schema.label}</h2>

      {schema.fields.map(function (f) {
        if (f.type === 'hidden') return null
        return (
          <div className="field" key={f.name}>
            <label>{f.label}{f.required ? ' *' : ''}</label>

            {f.type === 'text' && (
              <input
                type="text"
                value={values[f.name]}
                onChange={function (e) { handleChange(f.name, e.target.value) }}
              />
            )}

            {f.type === 'number' && (
              <input
                type="number"
                inputMode="decimal"
                value={values[f.name]}
                onChange={function (e) { handleChange(f.name, e.target.value) }}
              />
            )}

            {f.type === 'date' && (
              <input
                type="date"
                value={values[f.name]}
                onChange={function (e) { handleChange(f.name, e.target.value) }}
              />
            )}

            {f.type === 'textarea' && (
              <textarea
                rows={3}
                value={values[f.name]}
                onChange={function (e) { handleChange(f.name, e.target.value) }}
              />
            )}

            {f.type === 'select' && (function () {
              var waitingOnParent = f.dependsOn && !values[f.dependsOn]
              return (
                <select
                  value={values[f.name]}
                  disabled={waitingOnParent}
                  onChange={function (e) { handleChange(f.name, e.target.value) }}
                >
                  <option value="">
                    {waitingOnParent ? '-- Pilih ' + schema.fields.filter(function (p) { return p.name === f.dependsOn })[0].label + ' dulu --' : '-- Pilih --'}
                  </option>
                  {resolveOptions(f, values).map(function (opt) {
                    return <option value={opt} key={opt}>{opt}</option>
                  })}
                </select>
              )
            })()}

            {f.type === 'customerSelect' && (
              <div>
                <input
                  list="customer-options"
                  type="text"
                  placeholder="Ketik untuk cari customer..."
                  value={values[f.name]}
                  onChange={function (e) { handleChange(f.name, e.target.value) }}
                />
                <datalist id="customer-options">
                  {customers.map(function (c) {
                    return <option value={c} key={c} />
                  })}
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
                  onChange={function (e) { handleChange(f.name, e.target.value) }}
                />
                <datalist id="product-options">
                  {products.map(function (p) {
                    return <option value={p} key={p} />
                  })}
                </datalist>
              </div>
            )}

            {f.type === 'customerSelectOrNew' && !newCustomerMode && (
              <div className="customer-select-row">
                <select
                  value={values[f.name]}
                  onChange={function (e) { handleChange(f.name, e.target.value) }}
                >
                  <option value="">-- Pilih Customer --</option>
                  {customers.map(function (c) {
                    return <option value={c} key={c}>{c}</option>
                  })}
                </select>
                <button
                  type="button"
                  className="link-btn"
                  onClick={function () { setNewCustomerMode(true); handleChange(f.name, '') }}
                >
                  + Customer baru
                </button>
              </div>
            )}

            {f.type === 'customerSelectOrNew' && newCustomerMode && (
              <div className="customer-select-row">
                <input
                  type="text"
                  placeholder="Nama customer baru"
                  value={values[f.name]}
                  onChange={function (e) { handleChange(f.name, e.target.value) }}
                />
                <button
                  type="button"
                  className="link-btn"
                  onClick={function () { setNewCustomerMode(false); handleChange(f.name, '') }}
                >
                  Pilih dari daftar
                </button>
              </div>
            )}
          </div>
        )
      })}

      {status && (
        <div className={'status ' + status.type}>{status.message}</div>
      )}

      <button type="submit" className="submit-btn" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  )
}
