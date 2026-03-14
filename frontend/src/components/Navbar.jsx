import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import Button from './Button';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Post Problem', path: '/create-problem' },
  { name: 'Crop Guide', path: '/crop-guide' },
  { name: 'Mandi Prices', path: '/mandi-prices' },
  { name: 'Weather', path: '/weather' },
  { name: 'Crop Doctor', path: '/crop-doctor' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Left Side */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-brand-primary dark:text-brand-accent bg-brand-primary/10 dark:bg-brand-accent/10' 
                    : 'text-text-main dark:text-text-inverse hover:text-brand-secondary dark:hover:text-brand-accent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-500 hover:text-brand-secondary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-brand-accent dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover shadow-sm bg-brand-primary" />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-brand-primary dark:text-brand-accent" />
                )}
                <span className="font-medium text-sm hidden sm:block whitespace-nowrap max-w-[100px] truncate">{user.name}</span>
              </button>
              
              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card-dark rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 py-1 z-20 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || 'Farmer Account'}</p>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-primary dark:hover:text-brand-accent transition-colors">Your Profile</Link>
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-primary dark:hover:text-brand-accent transition-colors">Settings</Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1"></div>
                    <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Log Out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="font-medium px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Login</Link>
              <Button onClick={() => navigate('/signup')} className="!py-2 !px-5 text-sm">Sign Up</Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-800 px-4 py-4 space-y-1 shadow-lg absolute w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-primary dark:hover:text-brand-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-medium">Login</Link>
              <Button onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }} className="w-full">Sign Up</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
