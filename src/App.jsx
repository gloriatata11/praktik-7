import React from 'react'
import './App.css'
import BasicFetchingDemo from './components/BasicFetchingDemo'
import AdvancedFetchingDemo from './components/AdvancedFetchingDemo'
import CRUDOperationsDemo from './components/CRUDOperationsDemo'

function App() {
  return (
    <div className="App">
      <h1>Praktik 7: Fetching Data dan CRUD</h1>

      <h2>1. Basic Fetching Demo</h2>
      <BasicFetchingDemo />

      <h2>2. Advanced Fetching Demo</h2>
      <AdvancedFetchingDemo />

      <h2>3. CRUD Operations Demo</h2>
      <CRUDOperationsDemo />
    </div>
  )
}

export default App
