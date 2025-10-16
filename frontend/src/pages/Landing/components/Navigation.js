import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { LANDING_CONFIG } from '../config/landingConfig';

export const Navigation = ({ 
  isMenuOpen, 
  toggleMenu, 
  activeSection = 'home',
  className = '' 
}) => {
  const { navigation, ctaButtons } = LANDING_CONFIG;

  return (
    <nav className={`fixed top-0 w-full bg-white/95 backdrop-blur-lg shadow-lg z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl">
                <span className="font-bold text-xl">NG</span>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold text-gray-900">Nusantara Group</div>
                <div className="text-sm text-gray-600">Building Excellence</div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.href.replace('#', '')}
              />
            ))}
            <CTAButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <MobileMenu 
            navigation={navigation}
            activeSection={activeSection}
            onClose={toggleMenu}
          />
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ href, label, isActive }) => (
  <a 
    href={href} 
    className={`font-semibold transition-colors duration-300 relative group ${
      isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {label}
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
      isActive ? 'w-full' : 'w-0 group-hover:w-full'
    }`}></span>
  </a>
);

const CTAButton = () => {
  const { ctaButtons } = LANDING_CONFIG;
  
  return (
    <Link 
      to="/login" 
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
    >
      Login
    </Link>
  );
};

const MobileMenu = ({ navigation, activeSection, onClose }) => (
  <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      {navigation.map((item) => (
        <a 
          key={item.href}
          href={item.href} 
          className={`block px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
            activeSection === item.href.replace('#', '') 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
          onClick={onClose}
        >
          {item.label}
        </a>
      ))}
      <div className="px-4 py-2">
        <Link 
          to="/login" 
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
          onClick={onClose}
        >
          Login
        </Link>
      </div>
    </div>
  </div>
);