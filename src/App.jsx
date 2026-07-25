import React, { useState, useEffect } from 'react'
import { SCHEMAS, TAB_ORDER } from './schemas.js'
import DynamicForm from './DynamicForm.jsx'
import { fetchCustomers, fetchProducts } from './api.js'

var TAB_LABELS = {
  Visit: 'Visit',
  DailyLog: 'Kegiatan',
  NonVisit: 'Non Visit',
  OffDuty: 'Off Duty',
  Akuisisi: 'Akuisisi',
  Customer: 'Customer'
}

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

  useEffect(function () {
    fetchCustomers().then(function (list) {
      setCustomers(list)
    })
    fetchProducts().then(function (list) {
      setProducts(list)
    })
  }, [])

  var schema = SCHEMAS[activeTab]

  return (
    <div className="app">
      <header className="app-header">
        <span>VisitKu Nabire</span>
      </header>

      <main className="app-main">
        <DynamicForm schema={schema} customers={customers} products={products} key={activeTab} />
      </main>

      <nav className="bottom-nav">
        {TAB_ORDER.map(function (key) {
          var isActive = key === activeTab
          return (
            <button
              key={key}
              className={isActive ? 'nav-btn active' : 'nav-btn'}
              onClick={function () { setActiveTab(key) }}
            >
              {TAB_LABELS[key]}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
