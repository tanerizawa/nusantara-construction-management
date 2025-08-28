import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Star, Heart, MessageSquare, Calendar, Clock, User, Tag, Zap } from 'lucide-react';

/**
 * Badge Component System - Apple HIG Compliant
 * 
 * Versatile badge system for status, notifications, and labels
 * Follows Apple's Human Interface Guidelines for clarity and accessibility
 */

// Base Badge Component
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  onClick,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-purple-100 text-purple-800 border-purple-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    dark: 'bg-gray-800 text-white border-gray-700',
    light: 'bg-white text-gray-800 border-gray-300'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-5 py-2.5 text-lg'
  };
  
  const shapes = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none'
  };
  
  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };
  
  const isClickable = onClick || removable;
  
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 font-medium border
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${shapes[shape]}
        ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Left Icon */}
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">
          {React.cloneElement(icon, { size: iconSizes[size] })}
        </span>
      )}
      
      {/* Content */}
      <span className="truncate">{children}</span>
      
      {/* Right Icon */}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">
          {React.cloneElement(icon, { size: iconSizes[size] })}
        </span>
      )}
      
      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="flex-shrink-0 hover:opacity-60 transition-opacity duration-200"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};

// Status Badge
export const StatusBadge = ({ status, children, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', icon: <CheckCircle />, text: 'Aktif' },
    inactive: { variant: 'default', icon: <AlertCircle />, text: 'Tidak Aktif' },
    pending: { variant: 'warning', icon: <Clock />, text: 'Menunggu' },
    approved: { variant: 'success', icon: <CheckCircle />, text: 'Disetujui' },
    rejected: { variant: 'danger', icon: <X />, text: 'Ditolak' },
    draft: { variant: 'default', icon: <AlertCircle />, text: 'Draft' },
    published: { variant: 'success', icon: <CheckCircle />, text: 'Dipublikasi' },
    archived: { variant: 'dark', icon: <AlertCircle />, text: 'Diarsipkan' },
    completed: { variant: 'success', icon: <CheckCircle />, text: 'Selesai' },
    'in-progress': { variant: 'primary', icon: <Clock />, text: 'Sedang Berjalan' },
    cancelled: { variant: 'danger', icon: <X />, text: 'Dibatalkan' },
    overdue: { variant: 'danger', icon: <AlertTriangle />, text: 'Terlambat' }
  };
  
  const config = statusConfig[status] || statusConfig.active;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {children || config.text}
    </Badge>
  );
};

// Priority Badge
export const PriorityBadge = ({ priority, children, ...props }) => {
  const priorityConfig = {
    low: { variant: 'default', text: 'Rendah' },
    medium: { variant: 'warning', text: 'Sedang' },
    high: { variant: 'danger', text: 'Tinggi' },
    urgent: { variant: 'danger', icon: <AlertTriangle />, text: 'Mendesak' },
    critical: { variant: 'danger', icon: <Zap />, text: 'Kritis' }
  };
  
  const config = priorityConfig[priority] || priorityConfig.medium;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {children || config.text}
    </Badge>
  );
};

// Notification Badge
export const NotificationBadge = ({ count, max = 99, showZero = false, ...props }) => {
  if (!showZero && (!count || count === 0)) return null;
  
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge
      variant="danger"
      size="xs"
      shape="pill"
      className="min-w-[20px] justify-center"
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

// Category Badge
export const CategoryBadge = ({ category, color, ...props }) => {
  const categoryColors = {
    konstruksi: 'primary',
    keuangan: 'success',
    sdm: 'warning',
    inventory: 'info',
    perpajakan: 'secondary',
    administrasi: 'default'
  };
  
  const variant = color || categoryColors[category] || 'default';
  
  return (
    <Badge
      variant={variant}
      icon={<Tag />}
      {...props}
    >
      {category}
    </Badge>
  );
};

// User Badge
export const UserBadge = ({ user, showRole = false, ...props }) => {
  return (
    <Badge
      variant="light"
      icon={<User />}
      {...props}
    >
      {user?.name || user}
      {showRole && user?.role && (
        <span className="text-gray-500">• {user.role}</span>
      )}
    </Badge>
  );
};

// Date Badge
export const DateBadge = ({ date, relative = false, ...props }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    
    const dateObj = new Date(dateValue);
    const now = new Date();
    
    if (relative) {
      const diffTime = Math.abs(now - dateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 hari yang lalu';
      if (diffDays < 7) return `${diffDays} hari yang lalu`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
      return dateObj.toLocaleDateString('id-ID');
    }
    
    return dateObj.toLocaleDateString('id-ID');
  };
  
  return (
    <Badge
      variant="default"
      icon={<Calendar />}
      {...props}
    >
      {formatDate(date)}
    </Badge>
  );
};

// Rating Badge
export const RatingBadge = ({ rating, maxRating = 5, ...props }) => {
  return (
    <Badge
      variant="warning"
      icon={<Star />}
      {...props}
    >
      {rating}/{maxRating}
    </Badge>
  );
};

// Progress Badge
export const ProgressBadge = ({ progress, showPercentage = true, ...props }) => {
  const getVariant = () => {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'primary';
    if (progress >= 50) return 'warning';
    if (progress >= 25) return 'default';
    return 'danger';
  };
  
  return (
    <Badge
      variant={getVariant()}
      {...props}
    >
      {showPercentage ? `${progress}%` : progress}
    </Badge>
  );
};

// Custom Icon Badges
export const FavoriteBadge = ({ isFavorite, ...props }) => (
  <Badge
    variant={isFavorite ? 'danger' : 'default'}
    icon={<Heart />}
    {...props}
  >
    Favorit
  </Badge>
);

export const CommentBadge = ({ count, ...props }) => (
  <Badge
    variant="info"
    icon={<MessageSquare />}
    {...props}
  >
    {count} Komentar
  </Badge>
);

export const NewBadge = ({ ...props }) => (
  <Badge
    variant="success"
    icon={<Zap />}
    shape="pill"
    size="sm"
    {...props}
  >
    Baru
  </Badge>
);

export const HotBadge = ({ ...props }) => (
  <Badge
    variant="danger"
    icon={<Zap />}
    shape="pill"
    size="sm"
    {...props}
  >
    Hot
  </Badge>
);

export const AlertBadge = ({ type = 'info', ...props }) => {
  const alertConfig = {
    info: { variant: 'info', icon: <Info /> },
    warning: { variant: 'warning', icon: <AlertTriangle /> },
    error: { variant: 'danger', icon: <AlertCircle /> },
    success: { variant: 'success', icon: <CheckCircle /> }
  };
  
  const config = alertConfig[type];
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    />
  );
};

// Badge Group Component
export const BadgeGroup = ({ 
  badges = [], 
  maxVisible = 3, 
  spacing = 'normal',
  className = '',
  ...props 
}) => {
  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  };
  
  const visibleBadges = badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;
  
  return (
    <div 
      className={`flex items-center flex-wrap ${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {visibleBadges.map((badge, index) => (
        <React.Fragment key={index}>
          {badge}
        </React.Fragment>
      ))}
      
      {hiddenCount > 0 && (
        <Badge variant="default" size="sm">
          +{hiddenCount} lainnya
        </Badge>
      )}
    </div>
  );
};

// Interactive Badge
export const InteractiveBadge = ({ 
  children, 
  onToggle, 
  active = false, 
  activeVariant = 'primary',
  inactiveVariant = 'default',
  ...props 
}) => {
  return (
    <Badge
      variant={active ? activeVariant : inactiveVariant}
      onClick={onToggle}
      className="cursor-pointer select-none"
      {...props}
    >
      {children}
    </Badge>
  );
};

// Contextual Badges for YK Project
export const ProjectStatusBadge = ({ status, ...props }) => (
  <StatusBadge status={status} {...props} />
);

export const InventoryStatusBadge = ({ inStock, quantity, minStock, ...props }) => {
  if (!inStock) {
    return <StatusBadge status="inactive" {...props}>Stok Habis</StatusBadge>;
  }
  
  if (quantity <= minStock) {
    return <StatusBadge status="warning" {...props}>Stok Menipis</StatusBadge>;
  }
  
  return <StatusBadge status="active" {...props}>Tersedia</StatusBadge>;
};

export const PaymentStatusBadge = ({ status, ...props }) => {
  const paymentStatus = {
    paid: 'approved',
    pending: 'pending',
    overdue: 'overdue',
    cancelled: 'cancelled'
  };
  
  return <StatusBadge status={paymentStatus[status]} {...props} />;
};

export const EmployeeStatusBadge = ({ status, ...props }) => (
  <StatusBadge status={status} {...props} />
);

const BadgeComponents = {
  Badge,
  StatusBadge,
  PriorityBadge,
  NotificationBadge,
  CategoryBadge,
  UserBadge,
  DateBadge,
  RatingBadge,
  ProgressBadge,
  FavoriteBadge,
  CommentBadge,
  NewBadge,
  HotBadge,
  AlertBadge,
  BadgeGroup,
  InteractiveBadge,
  ProjectStatusBadge,
  InventoryStatusBadge,
  PaymentStatusBadge,
  EmployeeStatusBadge
};

export default BadgeComponents;
