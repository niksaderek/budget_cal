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

  const calculateWorkingDays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // Only count weekdays
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  const calculateValues = (data) => {
    const updatedData = { ...data };

    if (data.currentLifetimeBudget && data.currentSpend && data.currentEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.currentEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate);

      updatedData.currentDailyBudget = daysRemaining > 0
        ? (Number(data.currentLifetimeBudget) - Number(data.currentSpend)) / daysRemaining
        : 0;
    }

    if (data.currentSpend && data.newDailyBudget && data.newEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.newEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate);

      updatedData.newLifetimeBudget = daysRemaining > 0
        ? Number(data.currentSpend) + (Number(data.newDailyBudget) * daysRemaining)
        : 0;
    }

    if (data.currentLifetimeBudget > 0 && updatedData.newLifetimeBudget > 0) {
      updatedData.changeInLTBudget = ((updatedData.newLifetimeBudget - data.currentLifetimeBudget) / data.currentLifetimeBudget) * 100;
    } else {
      updatedData.changeInLTBudget = 0;
    }

    return updatedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBudgetData((prevData) => calculateValues({ ...prevData, [name]: value || '' }));
  };

  const handleDateChange = (name, dateValue) => {
    setBudgetData((prevData) => calculateValues({ ...prevData, [name]: dateValue }));
  };

  return (
    <div className="container mx-auto p-4 max-w-lg bg-white rounded-lg shadow-lg">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-4 text-blue-600">Daily & Lifetime Budget Calculator</h1>
      <h2 className="text-sm md:text-base text-center mb-6 text-gray-600">(Weekdays Only)</h2>

      <div className="space-y-6">
        {/* Current Budget Section */}
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-blue-700 mb-3">Current Budget</h2>
          
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
              <div className="p-2 bg-gray-100 rounded w-full font-semibold text-blue-700">
                ${budgetData.currentDailyBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* New Budget Section */}
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-green-700 mb-3">New Budget</h2>
          
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
                step="100"  // Step value set to 100
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
              <div className="p-2 bg-gray-100 rounded w-full font-semibold text-green-700">
                ${budgetData.newLifetimeBudget.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-purple-700 mb-3">Budget Change</h2>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Change in Lifetime Budget</label>
            <div className={`p-2 rounded w-full font-bold ${budgetData.changeInLTBudget > 0 ? 'text-red-600 bg-red-50' : budgetData.changeInLTBudget < 0 ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>
              {budgetData.changeInLTBudget.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
