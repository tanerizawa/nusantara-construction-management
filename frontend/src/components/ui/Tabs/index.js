import React, { useState, useEffect, createContext, useContext } from 'react';

const TabsContext = createContext();

const Tabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className = '',
  orientation = 'horizontal',
  ...props 
}) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const selectTab = (value) => {
    setSelectedTab(value);
    onValueChange && onValueChange(value);
  };

  return (
    <TabsContext.Provider value={{ selectedTab, selectTab, orientation }}>
      <div className={`${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = '', ...props }) => {
  const { orientation } = useContext(TabsContext);
  
  const orientationClasses = orientation === 'vertical' 
    ? 'flex-col border-r border-gray-200'
    : 'border-b border-gray-200';

  return (
    <div 
      className={`flex ${orientationClasses} ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, disabled = false, className = '', ...props }) => {
  const { selectedTab, selectTab, orientation } = useContext(TabsContext);
  const isSelected = selectedTab === value;
  
  const orientationClasses = orientation === 'vertical' 
    ? 'border-r-2 border-transparent'
    : 'border-b-2 border-transparent';
  
  const selectedClasses = isSelected 
    ? (orientation === 'vertical' ? 'border-r-blue-600' : 'border-b-blue-600')
    : '';

  const baseClasses = 'px-4 py-2 text-sm font-medium transition-all focus:outline-none';
  const stateClasses = disabled 
    ? 'text-gray-400 cursor-not-allowed' 
    : isSelected 
      ? 'text-blue-600' 
      : 'text-gray-600 hover:text-gray-900';

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={isSelected ? 0 : -1}
      className={`${baseClasses} ${orientationClasses} ${selectedClasses} ${stateClasses} ${className}`}
      onClick={() => !disabled && selectTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className = '', forceMount, ...props }) => {
  const { selectedTab } = useContext(TabsContext);
  const isSelected = selectedTab === value;

  if (!forceMount && !isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      aria-hidden={!isSelected}
      hidden={!isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={`${!isSelected && 'hidden'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };