import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb component untuk navigation
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home */}
        <li>
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-1 text-[#8E8E93] hover:text-white transition-colors duration-150"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-[#636366]" />
            <li>
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-[#8E8E93] hover:text-white transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-medium">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
