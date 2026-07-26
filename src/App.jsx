import React, { useState, useEffect } from 'react'
import { SCHEMAS, TAB_ORDER } from './schemas.js'
import DynamicForm from './DynamicForm.jsx'
import SummaryView from './SummaryView.jsx'
import { fetchCustomers, fetchProducts, fetchDropdowns } from './api.js'
import { getTodayCounts, recordSubmission } from './localSummary.js'

var TAB_LABELS = {
  Visit: 'Visit',
  NonVisit: 'Non Visit',
  OffDuty: 'Off Duty',
  Akuisisi: 'Akuisisi',
  Customer: 'Customer',
  Summary: 'Ringkasan'
}

var NAV_ORDER = TAB_ORDER.concat(['Summary'])

export default function App() {
  var stateTab = useState('Visit')
  var activeTab = stateTab[0]
  var setActiveTab = stateTab[1]

  var stateCustomers = useState([])
  var customers = stateCustomers[0]
  var setCustomers = stateCustomers[1]

  var stateProducts = useState([])
  var products = stateProducts[0]
  var setProducts = stateProducts[1]

  var stateDropdowns = useState({})
  var dropdowns = stateDropdowns[0]
  var setDropdowns = stateDropdowns[1]

  var stateCounts = useState(function () { return getTodayCounts() })
  var counts = stateCounts[0]
  var setCounts = stateCounts[1]

  useEffect(function () {
    fetchCustomers().then(function (list) {
      setCustomers(list)
    })
    fetchProducts().then(function (list) {
      setProducts(list)
    })
    fetchDropdowns().then(function (obj) {
      setDropdowns(obj)
    })
  }, [])

  function handleSaved(sheetName, customerName) {
    var updated = recordSubmission(sheetName, customerName)
    setCounts(updated)
  }

  var schema = SCHEMAS[activeTab]
  var totalToday = 0
  var keys = Object.keys(counts)
  for (var i = 0; i < keys.length; i++) {
    totalToday += counts[keys[i]]
  }

  return (
    <div className="app">
      <header className="app-header">
        <span>VisitKu Nabire</span>
        <span className="app-header-tab">{TAB_LABELS[activeTab]}</span>
      </header>

      <main className="app-main">
        {activeTab === 'Summary' && <SummaryView counts={counts} key="Summary" />}
        {activeTab !== 'Summary' && (
          <DynamicForm
            schema={schema}
            customers={customers}
            products={products}
            dropdowns={dropdowns}
            onSaved={handleSaved}
            key={activeTab}
          />
        )}
      </main>

      <nav className="bottom-nav">
        {NAV_ORDER.map(function (key) {
          var isActive = key === activeTab
          return (
            <button
              key={key}
              className={isActive ? 'nav-btn active' : 'nav-btn'}
              onClick={function () { setActiveTab(key) }}
            >
              {TAB_LABELS[key]}
              {key === 'Summary' && totalToday > 0 && (
                <span className="nav-badge">{totalToday}</span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
