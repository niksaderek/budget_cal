import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa'; // Icon for the date picker

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
  
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState('light'); // Track light/dark theme
  const [notification, setNotification] = useState('');

  // Error handling & validation
  const validateInput = (name, value) => {
    let error = '';
    
    if (value < 0) {
      error = `${name} cannot be negative.`;
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    
    return error;
  };

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
    
    // Validate input
    const validationError = validateInput(name, newValue);
    if (validationError) return;

    const updatedData = { ...budgetData, [name]: newValue };
    setBudgetData(calculateValues(updatedData));

    if (!validationError) {
      setNotification(`${name} updated successfully.`);
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    }
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

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`container mx-auto p-6 max-w-7xl bg-white rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Daily & Lifetime Budget Calculator</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded bg-blue-500 text-white"
        >
          Toggle Theme
        </button>
      </div>

      {notification && (
        <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
          {notification}
        </div>
      )}

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
                {errors.currentLifetimeBudget && <p className="text-red-500 text-xs">{errors.currentLifetimeBudget}</p>}
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
                {errors.currentSpend && <p className="text-red-500 text-xs">{errors.currentSpend}</p>}
              </td>
              <td className="border p-4">
                <input
                  type="date"
                  name="currentEndDate"
                  value={toInputDateFormat(budgetData.currentEndDate)}
                  onChange={(e) => handleDateChange('currentEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
                <FaCalendarAlt className="inline-block ml-2 text-blue-500 cursor-pointer" />
                <p className="text-sm text-gray-500">Click on the calendar icon to select date</p>
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
                {errors.newDailyBudget && <p className="text-red-500 text-xs">{errors.newDailyBudget}</p>}
              </td>
              <td className="border p-4">
                <input
                  type="date"
                  name="newEndDate"
                  value={toInputDateFormat(budgetData.newEndDate)}
                  onChange={(e) => handleDateChange('newEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
                <FaCalendarAlt className="inline-block ml-2 text-blue-500 cursor-pointer" />
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
    </div>
  );
};

export default BudgetCalculator;
