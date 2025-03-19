import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  
  const [errors, setErrors] = useState({});
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  // Reference to input element
  const templateNameInputRef = useRef(null);
  
  // Load saved templates from localStorage on component mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('budgetCustomTemplates');
      if (savedTemplates) {
        setCustomTemplates(JSON.parse(savedTemplates));
      }
    } catch (e) {
      console.error("Error loading saved templates", e);
    }
  }, []);
  
  // Focus input when modal opens
  useEffect(() => {
    if (showSaveTemplateModal && templateNameInputRef.current) {
      setTimeout(() => {
        templateNameInputRef.current.focus();
      }, 100);
    }
  }, [showSaveTemplateModal]);
  
  // Add a specific number of weekdays from today
  function getFutureWeekdayDate(weekdays) {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Start at beginning of today
    let daysAdded = 0;
    
    // Count today if it's a weekday
    const todayDayOfWeek = date.getDay();
    if (todayDayOfWeek !== 0 && todayDayOfWeek !== 6) {
      daysAdded++;
    }
    
    // Add remaining weekdays
    while (daysAdded < weekdays) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++;
      }
    }
    
    // Set to end of day
    date.setHours(23, 59, 59, 999);
    
    return formatDateForInput(date);
  }
  
  // Add specific number of weekdays to an existing date
  function addWeekdaysToDate(date, weekdays) {
    if (!date) {
      return getFutureWeekdayDate(weekdays);
    }
    
    const newDate = new Date(date);
    let daysAdded = 0;
    
    // Start counting from the current date
    while (daysAdded < weekdays) {
      newDate.setDate(newDate.getDate() + 1);
      const dayOfWeek = newDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++;
      }
    }
    
    // Set to end of day
    newDate.setHours(23, 59, 59, 999);
    
    return formatDateForInput(newDate);
  }
  
  // Subtract a specific number of weekdays from a date
  function subtractWeekdaysFromDate(date, weekdays) {
    if (!date) {
      return formatDateForInput(new Date()); // Return today if no date
    }
    
    const newDate = new Date(date);
    let daysSubtracted = 0;
    
    // Subtract weekdays
    while (daysSubtracted < weekdays) {
      newDate.setDate(newDate.getDate() - 1);
      const dayOfWeek = newDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysSubtracted++;
      }
    }
    
    // Set to end of day
    newDate.setHours(23, 59, 59, 999);
    
    return formatDateForInput(newDate);
  }
  
  // Built-in templates for quick selection
  const builtInTemplates = [
    {
      name: "5-Day Campaign",
      data: {
        currentLifetimeBudget: 5000,
        currentSpend: 0,
        currentEndDate: getFutureWeekdayDate(5),
        newDailyBudget: ''
      }
    },
    {
      name: "10-Day Campaign",
      data: {
        currentLifetimeBudget: 10000,
        currentSpend: 0,
        currentEndDate: getFutureWeekdayDate(10),
        newDailyBudget: ''
      }
    },
    {
      name: "15-Day Campaign",
      data: {
        currentLifetimeBudget: 15000,
        currentSpend: 0,
        currentEndDate: getFutureWeekdayDate(15),
        newDailyBudget: ''
      }
    }
  ];
  
  function getQuarterEndDate() {
    const date = new Date();
    const month = date.getMonth();
    const quarterEndMonth = Math.floor(month / 3) * 3 + 2;
    date.setMonth(quarterEndMonth);
    date.setDate(new Date(date.getFullYear(), quarterEndMonth + 1, 0).getDate());
    return formatDateForInput(date);
  }
  
  function getYearEndDate() {
    const date = new Date();
    date.setMonth(11);
    date.setDate(31);
    return formatDateForInput(date);
  }
  
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }
  
  function formatCurrency(value) {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  function formatCurrencyCompact(value) {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }
  
  // Calculate only weekdays between two dates
  const calculateWeekdays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure end date is counted fully
    
    // Validate dates
    if (start > end) return 0;
    
    // Reset time on start date to beginning of day for accurate comparison
    start.setHours(0, 0, 0, 0);
    
    let count = 0;
    let current = new Date(start);
    
    // Count the current day if it's a weekday
    const currentDayOfWeek = current.getDay();
    if (currentDayOfWeek !== 0 && currentDayOfWeek !== 6) {
      count++;
    }
    
    // Count remaining days
    current.setDate(current.getDate() + 1); // Move to next day
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };
  
  // Save current configuration as a custom template
  const saveCustomTemplate = () => {
    if (!newTemplateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    
    if (!budgetData.currentLifetimeBudget) {
      alert("Please enter at least a current lifetime budget");
      return;
    }
    
    // Create the template object with a unique ID
    const newTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      data: {
        currentLifetimeBudget: budgetData.currentLifetimeBudget,
        currentSpend: budgetData.currentSpend || 0,
        currentEndDate: budgetData.currentEndDate || '',
        newDailyBudget: budgetData.newDailyBudget || ''
      }
    };
    
    // Add to custom templates
    const updatedTemplates = [...customTemplates, newTemplate];
    setCustomTemplates(updatedTemplates);
    
    // Save to localStorage
    try {
      localStorage.setItem('budgetCustomTemplates', JSON.stringify(updatedTemplates));
    } catch (e) {
      console.error("Error saving templates to localStorage", e);
    }
    
    // Reset modal
    setNewTemplateName('');
    setShowSaveTemplateModal(false);
  };
  
  // Delete a custom template by index
  const deleteTemplate = (index) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const newTemplates = [...customTemplates];
      newTemplates.splice(index, 1);
      setCustomTemplates(newTemplates);
      
      try {
        localStorage.setItem('budgetCustomTemplates', JSON.stringify(newTemplates));
      } catch (e) {
        console.error("Error saving templates to localStorage", e);
      }
    }
  };
  
  // Validate input data
  const validateInputs = (data) => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (data.currentEndDate) {
      const endDate = new Date(data.currentEndDate);
      if (endDate < today) {
        newErrors.currentEndDate = "End date must be in the future";
      }
    }
    
    if (data.newEndDate) {
      const newEndDate = new Date(data.newEndDate);
      if (newEndDate < today) {
        newErrors.newEndDate = "End date must be in the future";
      }
    }
    
    if (data.currentLifetimeBudget && data.currentSpend) {
      if (Number(data.currentSpend) > Number(data.currentLifetimeBudget)) {
        newErrors.currentSpend = "Current spend cannot exceed lifetime budget";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate all values based on inputs
  const calculateValues = (data) => {
    validateInputs(data);
    
    const updatedData = { ...data };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (data.currentLifetimeBudget && data.currentEndDate) {
      const endDate = new Date(data.currentEndDate);
      endDate.setHours(23, 59, 59, 999); // Make sure it's end of day
      const daysRemaining = calculateWeekdays(today, endDate);
      
      updatedData.currentDailyBudget = daysRemaining > 0
        ? (Number(data.currentLifetimeBudget) - Number(data.currentSpend || 0)) / daysRemaining
        : 0;
    }

    if (data.newDailyBudget && data.newEndDate) {
      const endDate = new Date(data.newEndDate);
      endDate.setHours(23, 59, 59, 999); // Make sure it's end of day
      const daysRemaining = calculateWeekdays(today, endDate);
      
      updatedData.newLifetimeBudget = daysRemaining > 0
        ? Number(data.currentSpend || 0) + (Number(data.newDailyBudget) * daysRemaining)
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
    setActiveTemplate(null); // Clear template selection when user manually changes values
    setBudgetData(prevData => calculateValues({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (name, dateValue) => {
    setActiveTemplate(null); // Clear template selection when user manually changes values
    setBudgetData(prevData => calculateValues({
      ...prevData,
      [name]: dateValue
    }));
  };
  
  const applyTemplate = (template, index) => {
    setActiveTemplate(index);
    
    // Apply the template values but keep any existing values not in the template
    const newData = {
      ...budgetData,
      ...template.data,
      newEndDate: template.data.currentEndDate // Copy current end date to new end date
    };
    
    setBudgetData(calculateValues(newData));
  };
  
  const resetCalculator = () => {
    setActiveTemplate(null);
    setBudgetData({
      currentLifetimeBudget: '',
      currentSpend: '',
      currentEndDate: '',
      currentDailyBudget: 0,
      newDailyBudget: '',
      newEndDate: '',
      newLifetimeBudget: 0,
      changeInLTBudget: 0
    });
    setErrors({});
  };
  
  // Generate data for the comparison chart
  const getChartData = () => {
    if (!budgetData.currentLifetimeBudget || !budgetData.newLifetimeBudget) {
      return [];
    }
    
    return [
      { 
        name: 'Current Budget', 
        value: Number(budgetData.currentLifetimeBudget), 
        spent: Number(budgetData.currentSpend || 0),
        remaining: Number(budgetData.currentLifetimeBudget) - Number(budgetData.currentSpend || 0)
      },
      { 
        name: 'New Budget', 
        value: budgetData.newLifetimeBudget,
        spent: Number(budgetData.currentSpend || 0),
        remaining: budgetData.newLifetimeBudget - Number(budgetData.currentSpend || 0)
      }
    ];
  };
  
  // Tooltip formatter for the chart
  const renderTooltip = (props) => {
    const { active, payload } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: '5px 0 0' }}>Total: {formatCurrency(data.value)}</p>
          <p style={{ margin: '5px 0 0' }}>Spent: {formatCurrency(data.spent)}</p>
          <p style={{ margin: '5px 0 0' }}>Remaining: {formatCurrency(data.remaining)}</p>
        </div>
      );
    }
    
    return null;
  };

  // Handle template name input change
  const handleTemplateNameChange = (e) => {
    setNewTemplateName(e.target.value);
  };

  return (
    <div className="mx-auto p-4 rounded-lg shadow-lg" style={{ maxWidth: '500px', width: '100%', backgroundColor: '#f5f5f5' }}>
      <div className="flex items-center justify-center mb-2">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          {/* Circle */}
          <path d="M30 60C41.0457 60 50 51.0457 50 40C50 28.9543 41.0457 20 30 20C18.9543 20 10 28.9543 10 40C10 51.0457 18.9543 60 30 60Z" fill="url(#paint0_linear)"/>
          {/* Capsule/pill shape */}
          <path d="M50 40C50 51.0457 58.9543 60 70 60C81.0457 60 90 51.0457 90 40C90 28.9543 81.0457 20 70 20C58.9543 20 50 28.9543 50 40Z" fill="url(#paint1_linear)"/>
          <defs>
            <linearGradient id="paint0_linear" x1="10" y1="40" x2="50" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9C42F5"/>
              <stop offset="1" stopColor="#4B8BF5"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="50" y1="40" x2="90" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4B8BF5"/>
              <stop offset="1" stopColor="#42E8F5"/>
            </linearGradient>
          </defs>
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-center" style={{ 
          background: "linear-gradient(90deg, #9C42F5 0%, #4B8BF5 50%, #42E8F5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent"
        }}>Budget Calculator</h1>
      </div>
      <p className="text-xs text-center mb-4 text-gray-500"></p>
      
      {/* Templates */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2" style={{ gap: '20px' }}>
          <h3 className="text-sm font-medium text-gray-700">Quick Templates:</h3>
          <button
            onClick={() => setShowSaveTemplateModal(true)}
            className="px-3 py-1 text-xs rounded-full text-white transition-colors ml-4"
            style={{ 
              background: "linear-gradient(90deg, #9C42F5 0%, #4B8BF5 50%, #42E8F5 100%)",
              padding: '8px 16px'
            }}
          >
            Save Current as Template
          </button>
        </div>
        
        {/* Combined built-in and custom templates */}
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Built-in templates */}
          {builtInTemplates.map((template, index) => (
            <button
              key={`builtin-${index}`}
              onClick={() => applyTemplate(template, index)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeTemplate === index 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {template.name}
            </button>
          ))}
          
          {/* Custom templates as separate buttons with trash icon */}
          {customTemplates.map((template, index) => (
            <div key={`custom-${index}`} className="inline-block">
              <button
                onClick={() => applyTemplate(template, builtInTemplates.length + index)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeTemplate === (builtInTemplates.length + index)
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {template.name}
              </button>
              {' '}{/* Literal space character */}
              <button
                onClick={() => {
                  setTemplateToDelete({ index, name: template.name });
                  setShowDeleteModal(true);
                }}
                className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors ml-2"
                title="Delete template"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
          
          <button
            onClick={resetCalculator}
            className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            style={{ 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px'
            }}
          >
            <h3 
              className="text-xl font-bold mb-6" 
              style={{ 
                color: '#9C42F5',
                fontSize: '1.3rem'
              }}
            >
              Save Custom Template
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                ref={templateNameInputRef}
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="p-3 border border-gray-300 rounded w-full"
                style={{
                  height: '50px',
                  fontSize: '1rem',
                  border: '1px solid #9C42F5',
                  borderRadius: '4px'
                }}
                placeholder="My Custom Template"
              />
            </div>
            
            <div className="flex justify-start gap-3 mt-4">
              <button
                onClick={() => {
                  setNewTemplateName('');
                  setShowSaveTemplateModal(false);
                }}
                className="px-4 py-2"
                style={{
                  fontSize: '0.95rem',
                  color: '#444',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTemplateName.trim()) {
                    alert("Please enter a template name");
                    return;
                  }
                  
                  if (!budgetData.currentLifetimeBudget) {
                    alert("Please enter at least a current lifetime budget");
                    return;
                  }
                  
                  // Create the template object with a unique ID
                  const newTemplate = {
                    id: Date.now().toString(),
                    name: newTemplateName,
                    data: {
                      currentLifetimeBudget: budgetData.currentLifetimeBudget,
                      currentSpend: budgetData.currentSpend || 0,
                      currentEndDate: budgetData.currentEndDate || '',
                      newDailyBudget: budgetData.newDailyBudget || ''
                    }
                  };
                  
                  // Add to custom templates
                  const updatedTemplates = [...customTemplates, newTemplate];
                  setCustomTemplates(updatedTemplates);
                  
                  // Save to localStorage
                  try {
                    localStorage.setItem('budgetCustomTemplates', JSON.stringify(updatedTemplates));
                  } catch (e) {
                    console.error("Error saving templates to localStorage", e);
                  }
                  
                  // Reset modal
                  setNewTemplateName('');
                  setShowSaveTemplateModal(false);
                }}
                className="px-4 py-2 text-sm text-white rounded"
                style={{ 
                  background: "linear-gradient(90deg, #9C42F5 0%, #4B8BF5 100%)",
                  padding: '8px 16px',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  borderRadius: '4px'
                }}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Template Modal */}
      {showDeleteModal && templateToDelete && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            style={{ 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px'
            }}
          >
            <h3 
              className="text-xl font-bold mb-6" 
              style={{ 
                color: '#9C42F5',
                fontSize: '1.3rem'
              }}
            >
              Delete Template
            </h3>
            
            <p className="mb-6" style={{ fontSize: '1rem' }}>
              Are you sure you want to delete the template "{templateToDelete.name}"?
            </p>
            
            <div className="flex justify-start gap-3 mt-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="px-4 py-2"
                style={{
                  fontSize: '0.95rem',
                  color: '#444',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updatedTemplates = customTemplates.filter((_, i) => i !== templateToDelete.index);
                  setCustomTemplates(updatedTemplates);
                  localStorage.setItem('budgetCustomTemplates', JSON.stringify(updatedTemplates));
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="px-4 py-2 text-sm text-white rounded"
                style={{ 
                  backgroundColor: '#f44336',
                  padding: '8px 16px',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  borderRadius: '4px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Current Budget Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(156, 66, 245, 0.1)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#9C42F5' }}>Current Budget</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Lifetime Budget ($)</label>
              <input
                type="number"
                name="currentLifetimeBudget"
                value={budgetData.currentLifetimeBudget}
                onChange={handleInputChange}
                className={`p-2 bg-white border rounded w-full ${
                  errors.currentLifetimeBudget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                step="100"
              />
              {errors.currentLifetimeBudget && (
                <p className="text-red-500 text-xs mt-1">{errors.currentLifetimeBudget}</p>
              )}
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Spend ($)</label>
              <input
                type="number"
                name="currentSpend"
                value={budgetData.currentSpend}
                onChange={handleInputChange}
                className={`p-2 bg-white border rounded w-full ${
                  errors.currentSpend ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                step="100"
              />
              {errors.currentSpend && (
                <p className="text-red-500 text-xs mt-1">{errors.currentSpend}</p>
              )}
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current End Date</label>
              <input
                type="date"
                name="currentEndDate"
                value={budgetData.currentEndDate}
                onChange={(e) => handleDateChange('currentEndDate', e.target.value)}
                className={`p-2 bg-white border rounded w-full ${
                  errors.currentEndDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.currentEndDate && (
                <p className="text-red-500 text-xs mt-1">{errors.currentEndDate}</p>
              )}
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => {
                    const newDate = subtractWeekdaysFromDate(budgetData.currentEndDate, 5);
                    handleDateChange('currentEndDate', newDate);
                  }}
                  className="text-xs px-2 py-1 rounded hover:bg-opacity-80"
                  style={{ backgroundColor: 'rgba(156, 66, 245, 0.2)', color: '#9C42F5' }}
                >
                  -5 Weekdays
                </button>
                <button 
                  onClick={() => {
                    const newDate = addWeekdaysToDate(budgetData.currentEndDate, 5);
                    handleDateChange('currentEndDate', newDate);
                  }}
                  className="text-xs px-2 py-1 rounded hover:bg-opacity-80"
                  style={{ backgroundColor: 'rgba(156, 66, 245, 0.2)', color: '#9C42F5' }}
                >
                  +5 Weekdays
                </button>
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Current Daily Budget</label>
              <div className="p-2 bg-white border border-gray-200 rounded w-full font-semibold" style={{ color: '#9C42F5' }}>
                {formatCurrency(budgetData.currentDailyBudget)}
              </div>
            </div>
          </div>
        </div>
        
        {/* New Budget Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(25, 118, 210, 0.15)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#1976D2' }}>New Budget</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New Daily Budget ($)</label>
              <input
                type="number"
                name="newDailyBudget"
                value={budgetData.newDailyBudget}
                onChange={handleInputChange}
                className={`p-2 bg-white border rounded w-full ${
                  errors.newDailyBudget ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount"
                step="100"
              />
              {errors.newDailyBudget && (
                <p className="text-red-500 text-xs mt-1">{errors.newDailyBudget}</p>
              )}
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New End Date</label>
              <input
                type="date"
                name="newEndDate"
                value={budgetData.newEndDate}
                onChange={(e) => handleDateChange('newEndDate', e.target.value)}
                className={`p-2 bg-white border rounded w-full ${
                  errors.newEndDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.newEndDate && (
                <p className="text-red-500 text-xs mt-1">{errors.newEndDate}</p>
              )}
              <div className="flex gap-2 mt-1">
                <button 
                  onClick={() => {
                    const newDate = subtractWeekdaysFromDate(budgetData.newEndDate, 5);
                    handleDateChange('newEndDate', newDate);
                  }}
                  className="text-xs px-2 py-1 rounded hover:bg-opacity-80"
                  style={{ backgroundColor: 'rgba(25, 118, 210, 0.2)', color: '#1976D2' }}
                >
                  -5 Weekdays
                </button>
                <button 
                  onClick={() => {
                    const newDate = addWeekdaysToDate(budgetData.newEndDate, 5);
                    handleDateChange('newEndDate', newDate);
                  }}
                  className="text-xs px-2 py-1 rounded hover:bg-opacity-80"
                  style={{ backgroundColor: 'rgba(25, 118, 210, 0.2)', color: '#1976D2' }}
                >
                  +5 Weekdays
                </button>
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">New Lifetime Budget</label>
              <div className="p-2 bg-white border border-gray-200 rounded w-full font-semibold" style={{ color: '#1976D2' }}>
                {formatCurrency(budgetData.newLifetimeBudget)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(75, 139, 245, 0.1)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#4B8BF5' }}>Budget Change</h2>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">Change in Lifetime Budget</label>
            <div 
              className="p-2 rounded w-full font-bold border border-gray-200" 
              style={{ 
                backgroundColor: 'white',
                color: budgetData.changeInLTBudget > 0 ? '#DC2626' : 
                       budgetData.changeInLTBudget < 0 ? '#4B8BF5' : 
                       '#6B7280'
              }}
            >
              {budgetData.changeInLTBudget.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        {(budgetData.currentLifetimeBudget && budgetData.newLifetimeBudget) ? (
          <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Budget Comparison</h2>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrencyCompact} />
                  <Tooltip content={renderTooltip} />
                  <Bar name="Spent" dataKey="spent" stackId="a" fill="#9CA3AF" />
                  <Bar name="Remaining" dataKey="remaining" stackId="a" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 mr-1"></div>
                <span className="text-xs">Spent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                <span className="text-xs">Remaining</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="text-center mt-4 text-xs text-gray-400">
        Note: Budget calculations are based on weekdays only (Monday-Friday)
      </div>
    </div>
  );
};

export default BudgetCalculator;
