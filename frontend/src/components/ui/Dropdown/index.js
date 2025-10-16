import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      {React.cloneElement(trigger, { onClick: toggle })}
      
      {isOpen && (
        <div 
          className={`absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignmentClasses[align]}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  icon,
  className = '',
  disabled = false,
  ...props 
}) => {
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={`w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const DropdownDivider = () => (
  <div className="h-px bg-gray-200 my-1" />
);

const DropdownLabel = ({ children, className = '', ...props }) => (
  <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
    {children}
  </div>
);

export { Dropdown, DropdownItem, DropdownDivider, DropdownLabel };