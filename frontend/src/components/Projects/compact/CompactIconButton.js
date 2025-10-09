import React from 'react';

const CompactIconButton = ({ 
  icon: Icon, 
  onClick, 
  color = 'blue', 
  size = 'sm',
  className = '',
  ...props 
}) => {
  const colors = {
    teal: { 
      text: 'text-[#5AC8FA]', 
      bg: 'bg-[#5AC8FA]/15', 
      hover: 'hover:bg-[#5AC8FA]/25', 
      border: 'border-[#5AC8FA]/30',
      ring: 'focus:ring-[#5AC8FA]/50'
    },
    blue: { 
      text: 'text-[#0A84FF]', 
      bg: 'bg-[#0A84FF]/15', 
      hover: 'hover:bg-[#0A84FF]/25', 
      border: 'border-[#0A84FF]/30',
      ring: 'focus:ring-[#0A84FF]/50'
    },
    orange: { 
      text: 'text-[#FF9500]', 
      bg: 'bg-[#FF9500]/15', 
      hover: 'hover:bg-[#FF9500]/25', 
      border: 'border-[#FF9500]/30',
      ring: 'focus:ring-[#FF9500]/50'
    },
    amber: { 
      text: 'text-[#FF9F0A]', 
      bg: 'bg-[#FF9F0A]/15', 
      hover: 'hover:bg-[#FF9F0A]/25', 
      border: 'border-[#FF9F0A]/30',
      ring: 'focus:ring-[#FF9F0A]/50'
    },
    red: { 
      text: 'text-[#FF3B30]', 
      bg: 'bg-[#FF3B30]/15', 
      hover: 'hover:bg-[#FF3B30]/25', 
      border: 'border-[#FF3B30]/30',
      ring: 'focus:ring-[#FF3B30]/50'
    },
    green: { 
      text: 'text-[#30D158]', 
      bg: 'bg-[#30D158]/15', 
      hover: 'hover:bg-[#30D158]/25', 
      border: 'border-[#30D158]/30',
      ring: 'focus:ring-[#30D158]/50'
    }
  };
  
  const sizes = {
    xs: { button: 'h-6 w-6 p-0', icon: 'h-3 w-3' },
    sm: { button: 'h-7 w-7 p-0', icon: 'h-3.5 w-3.5' },
    md: { button: 'h-8 w-8 p-0', icon: 'h-4 w-4' }
  };
  
  const c = colors[color];
  const s = sizes[size];
  
  return (
    <button
      onClick={onClick}
      className={`
        ${s.button} 
        ${c.text} 
        ${c.bg} 
        ${c.hover} 
        border 
        ${c.border} 
        rounded-md 
        transition-all 
        duration-150 
        focus:outline-none 
        focus:ring-2 
        ${c.ring}
        flex 
        items-center 
        justify-center
        ${className}
      `}
      {...props}
    >
      <Icon className={s.icon} />
    </button>
  );
};

export default CompactIconButton;
