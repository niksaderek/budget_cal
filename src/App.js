import React, { useState } from 'react';

const BudgetCalculator = () => {
  const [budgetData, setBudgetData] = useState({
    currentLifetimeBudget: '',
    currentSpend: '',
    currentEndDate: '',
    currentDailyBudget: 0,  // Default to 0 to prevent NaN errors
    newDailyBudget: '',
    newEndDate: '',
    newLifetimeBudget: 0,  // Default to 0
    changeInLTBudget: 0    // Default to 0
  });

  const [countWeekdaysOnly, setCountWeekdaysOnly] = useState(true);

  const calculateWorkingDays = (startDate, endDate, weekdaysOnly) => {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (!weekdaysOnly || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  const calculateValues = (data) => {
    const updatedData = { ...data };
    const weekdaysOnly = countWeekdaysOnly;  // Ensure toggle updates calculations

    if (data.currentLifetimeBudget && data.currentSpend && data.currentEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.currentEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate, weekdaysOnly);

      updatedData.currentDailyBudget = daysRemaining > 0
        ? (Number(data.currentLifetimeBudget) - Number(data.currentSpend)) / daysRemaining
        : 0;
    }

    if (data.currentSpend && data.newDailyBudget && data.newEndDate) {
      const currentDate = new Date();
      const endDate = new Date(data.newEndDate);
      const daysRemaining = calculateWorkingDays(currentDate, endDate, weekdaysOnly);

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

  const toggleCountMode = () => {
    setCountWeekdaysOnly((prev) => !prev);
    setBudgetData((prevData) => calculateValues(prevData));  // Recalculate on toggle
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Daily & Lifetime Budget Calculator</h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={toggleCountMode}
          className={`px-4 py-2 rounded text-white font-bold transition ${countWeekdaysOnly ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
          {countWeekdaysOnly ? 'Switch to All Days' : 'Switch to Weekdays Only'}
        </button>
      </div>

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
                />
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  name="currentSpend"
                  value={budgetData.currentSpend}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-200 rounded w-full"
                />
              </td>
              <td className="border p-4">
                <input
                  type="date"
                  name="currentEndDate"
                  value={budgetData.currentEndDate}
                  onChange={(e) => handleDateChange('currentEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
              </td>
              <td className="border p-4 text-right font-semibold">
                ${budgetData.currentDailyBudget.toFixed(2)}
              </td>
              <td className="border p-4">
                <input
                  type="number"
                  name="newDailyBudget"
                  value={budgetData.newDailyBudget}
                  onChange={handleInputChange}
                  className="p-2 bg-gray-200 rounded w-full"
                />
              </td>
              <td className="border p-4">
                <input
                  type="date"
                  name="newEndDate"
                  value={budgetData.newEndDate}
                  onChange={(e) => handleDateChange('newEndDate', e.target.value)}
                  className="p-2 bg-gray-200 rounded w-full"
                />
              </td>
              <td className="border p-4 text-right font-semibold">
                ${budgetData.newLifetimeBudget.toFixed(2)}
              </td>
              <td className="border p-4 text-right font-semibold">
                {budgetData.changeInLTBudget.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetCalculator;
