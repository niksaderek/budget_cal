import React from 'react'
import ReactDOM from 'react-dom/client'
import BudgetCalculator from './BudgetCalculator'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container mx-auto p-4">
      <BudgetCalculator />
    </div>
  </React.StrictMode>,
)
