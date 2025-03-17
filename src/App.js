import React, { useState } from 'react';

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    currentLifetimeBudget: '',
    currentSpend: '',
    currentEndDate: '',
    currentDailyBudget: 0,
    newDailyBudget: '',
    newEndDate: '',
    newLifetimeBudget: 0,
    changeInLTBudget: 0
  });

  // Calculate only weekdays between two dates
  const calculateWeekdays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let count = 0;
    let current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Calculate all values based on inputs
  const calculateValues = (data) => {
    const updatedData = { ...data };
    const today = new Date();
    
    if (data.currentLifetimeBudget && data.currentSpend && data.currentEndDate) {
      const endDate = new Date(data.currentEndDate);
      const daysRemaining = calculateWeekdays(today, endDate);
      
      updatedData.currentDailyBudget = daysRemaining > 0
        ? (Number(data.currentLifetimeBudget) - Number(data.currentSpend)) / daysRemaining
        : 0;
    }

    if (data.currentSpend && data.newDailyBudget && data.newEndDate) {
      const endDate = new Date(data.newEndDate);
      const daysRemaining = calculateWeekdays(today, endDate);
      
      updatedData.newLifetimeBudget = daysRemaining > 0
        ? Number(data.currentSpend) + (Number(data.newDailyBudget) * daysRemaining)
        : 0;
    }

    if (data.currentLifetimeBudget > 0 && updatedData.newLifetimeBudget > 0) {
      updatedData.changeInLTBudget = ((updatedData.newLifetimeBudget - Number(data.currentLifetimeBudget)) / Number(data.currentLifetimeBudget)) * 100;
    } else {
      updatedData.changeInLTBudget = 0;
    }

    return updatedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prevData => calculateValues({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (name, dateValue) => {
    setBudgetData(prevData => calculateValues({
      ...prevData,
      [name]: dateValue
    }));
  };

  return (
    <div className="mx-auto p-4 bg-white rounded-lg shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
      <h1 className="text-xl md:text-2xl font-bold text-center mb-2" style={{ color: '#2563EB' }}>Daily & Lifetime Budget Calculator</h1>

      <div className="space-y-5">
        {/* Current Budget Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#EFF6FF' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#1E40AF' }}>Current Budget</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Lifetime Budget ($)</label>
              <input
                type="number"
                name="currentLifetimeBudget"
                value={budgetData.currentLifetimeBudget}
                onChange={handleInputChange}
                className="p-2 bg-white border border-gray-300 rounded w-full"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Spend ($)</label>
              <input
                type="number"
                name="currentSpend"
                value={budgetData.currentSpend}
                onChange={handleInputChange}
                className="p-2 bg-white border border-gray-300 rounded w-full"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current End Date</label>
              <input
                type="date"
                name="currentEndDate"
                value={budgetData.currentEndDate}
                onChange={(e) => handleDateChange('currentEndDate', e.target.value)}
                className="p-2 bg-white border border-gray-300 rounded w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Daily Budget</label>
              <div className="p-2 bg-white border border-gray-200 rounded w-full font-semibold" style={{ color: '#1E40AF' }}>
                ${budgetData.currentDailyBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* New Budget Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#F0FDF4' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#166534' }}>New Budget</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New Daily Budget ($)</label>
              <input
                type="number"
                name="newDailyBudget"
                value={budgetData.newDailyBudget}
                onChange={handleInputChange}
                className="p-2 bg-white border border-gray-300 rounded w-full"
                placeholder="Enter amount"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New End Date</label>
              <input
                type="date"
                name="newEndDate"
                value={budgetData.newEndDate}
                onChange={(e) => handleDateChange('newEndDate', e.target.value)}
                className="p-2 bg-white border border-gray-300 rounded w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New Lifetime Budget</label>
              <div className="p-2 bg-white border border-gray-200 rounded w-full font-semibold" style={{ color: '#166534' }}>
                ${budgetData.newLifetimeBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#F5F3FF' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#5B21B6' }}>Budget Change</h2>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Change in Lifetime Budget</label>
            <div 
              className="p-2 rounded w-full font-bold border border-gray-200" 
              style={{ 
                backgroundColor: 'white',
                color: budgetData.changeInLTBudget > 0 ? '#DC2626' : 
                       budgetData.changeInLTBudget < 0 ? '#16A34A' : 
                       '#6B7280'
              }}
            >
              {budgetData.changeInLTBudget.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 text-xs text-gray-500">
        Note: Budget calculations are based on weekdays only (Monday-Friday)
      </div>
    </div>
  );
};

export default BudgetCalculator;
