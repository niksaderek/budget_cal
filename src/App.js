import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa'; // Assuming you have this icon

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    currentLifetimeBudget: 25000.00,
    currentSpend: 5000.00,
    currentEndDate: "3/23/2025",
    currentDailyBudget: 2000.00,
    newDailyBudget: 1500.00,
    newEndDate: "3/27/2025",
    newLifetimeBudget: 26000.00,
    changeInLTBudget: 4.00
  });

  const calculateValues = (data) => {
    const updatedData = { ...data };

    if (data.currentLifetimeBudget !== undefined && data.currentSpend !== undefined && data.currentEndDate !== undefined) {
      const currentDate = new Date();
      const endDate = new Date(data.currentEndDate);
      const daysRemaining = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining > 0) {
        updatedData.currentDailyBudget = (Number(data.currentLifetimeBudget) - Number(data.currentSpend)) / daysRemaining;
        updatedData.currentDailyBudget = parseFloat(updatedData.currentDailyBudget.toFixed(2));
      }
    }

    if (data.currentSpend !== undefined && data.newDailyBudget !== undefined && data.newEndDate !== undefined) {
      const currentDate = new Date();
      const endDate = new Date(data.newEndDate);
      const daysRemaining = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (daysRemaining > 0) {
        updatedData.newLifetimeBudget = Number(data.currentSpend) + (Number(data.newDailyBudget) * daysRemaining);
        updatedData.newLifetimeBudget = parseFloat(updatedData.newLifetimeBudget.toFixed(2));
      }
    }

    if (data.currentLifetimeBudget > 0 && updatedData.newLifetimeBudget > 0) {
      updatedData.changeInLTBudget = ((updatedData.newLifetimeBudget - data.currentLifetimeBudget) / data.currentLifetimeBudget) * 100;
      updatedData.changeInLTBudget = parseFloat(updatedData.changeInLTBudget.toFixed(2));
    }

    return updatedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'currentEndDate' || name === 'newEndDate' ? value : parseFloat(value) || 0;
    
    const updatedData = { ...budgetData, [name]: newValue };
    setBudgetData(calculateValues(updatedData));
  };

  const handleDateChange = (name, dateValue) => {
    const formattedDate = formatDate(dateValue);
    const updatedData = { ...budgetData, [name]: formattedDate };
    setBudgetData(calculateValues(updatedData));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const toInputDateFormat = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Daily & Lifetime Budget Calculator</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-gray-50 shadow-sm rounded-lg">
          <thead>
            <tr>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">Current Lifetime Budget</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">Current Spend</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">Current End Date</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">Current Daily Budget</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">New Daily Budget</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">New End Date</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">New Lifetime Budget</th>
              <th className="bg-blue-600 text-white font-semibold p-4 border-b">Change in LT Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="border p-4">
                <input
                  type="number"
                  name="currentLifetimeBudget"
                  value={budgetData.currentLifetimeBudget}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-200 rounded w-full"
                  step="0.01"
                />
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  name="currentSpend"
                  value={budgetData.currentSpend}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-200 rounded w-full"
                  step="100"
                />
              </td>
              <td className="border p-4" title="Click the calendar icon to select a date">
                <input
                  type="date"
                  name="currentEndDate"
                  value={toInputDateFormat(budgetData.currentEndDate)}
                  onChange={(e) => handleDateChange('currentEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
                <FaInfoCircle className="ml-2 inline text-blue-500" />
              </td>
              <td className="border p-4 text-right font-semibold">
                ${budgetData.currentDailyBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  name="newDailyBudget"
                  value={budgetData.newDailyBudget}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-200 rounded w-full"
                  step="100"
                />
              </td>
              <td className="border p-4" title="Click the calendar icon to select a date">
                <input
                  type="date"
                  name="newEndDate"
                  value={toInputDateFormat(budgetData.newEndDate)}
                  onChange={(e) => handleDateChange('newEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
                <FaInfoCircle className="ml-2 inline text-blue-500" />
              </td>
              <td className="border p-4 text-right font-semibold">
                ${budgetData.newLifetimeBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="border p-4 text-right font-semibold">
                {budgetData.changeInLTBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Input the amount in the gray fields. Bolded fields are calculated automatically.</p>
      </div>
    </div>
  );
};

export default BudgetCalculator;
