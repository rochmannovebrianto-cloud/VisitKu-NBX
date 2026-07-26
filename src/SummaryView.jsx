import React from 'react'
import { getTodayLabel } from './localSummary.js'

var LABELS = {
  Visit: 'Visit Customer',
  NonVisit: 'Non Visit',
  OffDuty: 'Off Duty',
  Akuisisi: 'Akuisisi'
}

var ORDER = ['Visit', 'NonVisit', 'OffDuty', 'Akuisisi']

export default function SummaryView(props) {
  var counts = props.counts || {}
  var total = 0
  for (var i = 0; i < ORDER.length; i++) {
    total += counts[ORDER[i]] || 0
  }

  return (
    <div className="summary">
      <h2 className="form-title">Ringkasan Hari Ini</h2>
      <div className="summary-date">{getTodayLabel()} &middot; Total {total} input</div>

      {ORDER.map(function (key) {
        var n = counts[key] || 0
        return (
          <div className="summary-card" key={key}>
            <div className="summary-card-header">
              <span>{LABELS[key]}</span>
              <span className="summary-count">{n}</span>
            </div>
            {n === 0 && (
              <div className="summary-empty">Belum ada input hari ini</div>
            )}
          </div>
        )
      })}

      <div className="summary-note">
        Angka ini dihitung langsung di HP ini (bukan dari Google Sheets),
        jadi akan reset kalau ganti perangkat atau hapus data browser.
      </div>
    </div>
  )
}
