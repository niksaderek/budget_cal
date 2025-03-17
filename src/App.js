import React, { useState } from 'react';

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    currentLifetimeBudget: "",
    currentSpend: "",
    currentEndDate: '',
    currentDailyBudget: "",
    newDailyBudget: "",
    newEndDate: '',
    newLifetimeBudget: 0,
    changeInLTBudget: 0
  });

  const [countWeekdaysOnly, setCountWeekdaysOnly] = useState(true);

  const calculateWorkingDays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (!countWeekdaysOnly || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count > 0 ? count : 1; // Prevent division by zero
  };

  const calculateValues = (data) => {
    const updatedData = { ...data };

    if (data.currentLifetimeBudget > 0 && data.currentSpend >= 0 && data.currentEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.currentEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate);

      updatedData.currentDailyBudget = (data.currentLifetimeBudget - data.currentSpend) / daysRemaining;
      updatedData.currentDailyBudget = parseFloat(updatedData.currentDailyBudget.toFixed(2));
    }

    if (data.currentSpend >= 0 && data.newDailyBudget > 0 && data.newEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.newEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate);

      updatedData.newLifetimeBudget = data.currentSpend + (data.newDailyBudget * daysRemaining);
      updatedData.newLifetimeBudget = parseFloat(updatedData.newLifetimeBudget.toFixed(2));
    }

    if (data.currentLifetimeBudget > 0 && updatedData.newLifetimeBudget > 0) {
      updatedData.changeInLTBudget = ((updatedData.newLifetimeBudget - data.currentLifetimeBudget) / data.currentLifetimeBudget) * 100;
      updatedData.changeInLTBudget = parseFloat(updatedData.changeInLTBudget.toFixed(2));
    }

    return updatedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name.includes('EndDate') ? value : parseFloat(value) || 0;

    const updatedData = { ...budgetData, [name]: newValue };
    setBudgetData(calculateValues(updatedData));
  };

  const toggleCountMode = () => {
    setCountWeekdaysOnly((prev) => !prev);
    setBudgetData(calculateValues(budgetData)); // Recalculate on toggle
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Budget Calculator</h1>

      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <button 
          onClick={toggleCountMode}
          className={`px-6 py-3 border-2 rounded-md font-bold transition ${countWeekdaysOnly ? 'bg-gray-300 border-gray-600' : 'bg-gray-500 border-gray-700'}`}
        >
          {countWeekdaysOnly ? 'Weekdays Only (Click for All Days)' : 'All Days (Click for Weekdays Only)'}
        </button>
      </div>

      <table className="min-w-full border-collapse bg-gray-50 shadow-sm rounded-lg">
        <thead>
          <tr>
            {['Current LT Budget', 'Current Spend', 'Current End Date', 'Current Daily Budget', 'New Daily Budget', 'New End Date', 'New LT Budget', 'Change in LT Budget']
              .map((title, idx) => (
                <th key={idx} className="bg-blue-600 text-white font-semibold p-4 border-b">{title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border p-4">
              <input type="number" name="currentLifetimeBudget" value={budgetData.currentLifetimeBudget} onChange={handleInputChange} className="p-2 bg-gray-200 rounded w-full" />
            </td>
            <td className="border p-4">
              <input type="number" name="currentSpend" value={budgetData.currentSpend} onChange={handleInputChange} className="p-2 bg-gray-200 rounded w-full" />
            </td>
            <td className="border p-4">
              <input type="date" name="currentEndDate" value={budgetData.currentEndDate} onChange={handleInputChange} className="p-2 bg-gray-200 rounded w-full" />
            </td>
            <td className="border p-4 font-semibold">${budgetData.currentDailyBudget.toFixed(2)}</td>
            <td className="border p-4">
              <input type="number" name="newDailyBudget" value={budgetData.newDailyBudget} onChange={handleInputChange} className="p-2 bg-gray-200 rounded w-full" />
            </td>
            <td className="border p-4">
              <input type="date" name="newEndDate" value={budgetData.newEndDate} onChange={handleInputChange} className="p-2 bg-gray-200 rounded w-full" />
            </td>
            <td className="border p-4 font-semibold">${budgetData.newLifetimeBudget.toFixed(2)}</td>
            <td className="border p-4 font-semibold">{budgetData.changeInLTBudget.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetCalculator;
