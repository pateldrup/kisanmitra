import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  HomeIcon,
  PlusCircleIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  CloudIcon,
  BeakerIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Logo from './Logo';

// ─── Nav Link Definitions ───────────────────────────────────────────────────
const navLinks = [
  { name: 'Dashboard',    path: '/dashboard',      Icon: HomeIcon },
  { name: 'Post Problem', path: '/create-problem',  Icon: PlusCircleIcon },
  { name: 'Crop Guide',   path: '/crop-guide',      Icon: BookOpenIcon },
  { name: 'Mandi Prices', path: '/mandi-prices',    Icon: CurrencyRupeeIcon },
  { name: 'Weather',      path: '/weather',          Icon: CloudIcon },
  { name: 'Crop Doctor',  path: '/crop-doctor',      Icon: BeakerIcon },
];

// ─── HamburgerButton ────────────────────────────────────────────────────────
const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-expanded={isOpen}
    aria-controls="mobile-menu-drawer"
    className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 
               transition-colors text-gray-600 dark:text-slate-300 
               focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
  >
    {isOpen ? (
      <XMarkIcon className="w-6 h-6 transition-transform duration-200 rotate-90" />
    ) : (
      <Bars3Icon className="w-6 h-6 transition-transform duration-200" />
    )}
  </button>
);

// ─── NavItem (mobile drawer item) ───────────────────────────────────────────
const NavItem = ({ link, isActive, onClick }) => {
  const { Icon, name, path } = link;
  return (
    <Link
      to={path}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center gap-4 px-4 rounded-2xl font-bold text-[15px]
        min-h-[56px] transition-all duration-200 active:scale-[0.97]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
        ${isActive
          ? 'bg-[#22C55E] text-white shadow-lg shadow-green-500/25'
          : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-[#22C55E]'
        }
      `}
    >
      <span
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${isActive
            ? 'bg-white/20 text-white'
            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
          }
        `}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <span>{name}</span>
    </Link>
  );
};

// ─── MobileMenu (slide-in drawer from the left) ──────────────────────────────
const MobileMenu = ({ isOpen, onClose, user, onLogout, location }) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* ── Drawer Panel ── */}
      <div
        id="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          lg:hidden fixed top-0 left-0 z-50
          w-[82vw] max-w-[340px] h-full
          bg-white dark:bg-[#1E293B] shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 shrink-0">
          <Link to="/" onClick={onClose}>
            <Logo />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 pt-4 shrink-0">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-2xl">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#22C55E]/30"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-[#22C55E] shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {user.email || 'Farmer Account'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 px-3 mb-3">
            Navigation
          </p>
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + '/');
            return (
              <NavItem
                key={link.name}
                link={link}
                isActive={isActive}
                onClick={onClose}
              />
            );
          })}
        </div>

        {/* Footer Auth Section */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-2 shrink-0">
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full min-h-[48px] 
                           bg-gray-100 dark:bg-slate-800 rounded-2xl font-bold text-sm 
                           text-gray-700 dark:text-white transition-all 
                           hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-[0.98]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <UserIcon className="w-4 h-4" />
                View Profile
              </Link>
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 w-full min-h-[48px] 
                           bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl 
                           font-bold text-sm transition-all 
                           hover:bg-red-100 dark:hover:bg-red-900/20 active:scale-[0.98]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center w-full min-h-[48px] 
                           border-2 border-gray-200 dark:border-slate-700 rounded-2xl 
                           font-bold text-sm text-gray-700 dark:text-white transition-all 
                           hover:border-[#22C55E] active:scale-[0.98]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="flex items-center justify-center w-full min-h-[48px] 
                           bg-[#22C55E] hover:bg-green-600 text-white rounded-2xl 
                           font-bold text-sm transition-all shadow-lg shadow-green-500/20 
                           active:scale-[0.98]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Desktop NavItem ─────────────────────────────────────────────────────────
const DesktopNavItem = ({ link, isActive }) => {
  const { Icon, name, path } = link;
  return (
    <Link
      to={path}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm 
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
        ${isActive
          ? 'text-[#22C55E] bg-[#22C55E]/10'
          : 'text-gray-600 dark:text-slate-300 hover:text-[#22C55E] hover:bg-gray-50 dark:hover:bg-slate-800'
        }
      `}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      {name}
    </Link>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className="sticky top-0 z-30 bg-white/90 dark:bg-[#1E293B]/90 
                   backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 
                   shadow-sm transition-all duration-300"
      >
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity shrink-0">
            <Logo />
          </Link>

          {/* ── Desktop Menu ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                location.pathname.startsWith(link.path + '/');
              return (
                <DesktopNavItem key={link.name} link={link} isActive={isActive} />
              );
            })}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2.5 rounded-full text-gray-500 hover:text-[#22C55E] 
                         hover:bg-gray-100 dark:text-gray-400 dark:hover:text-[#22C55E] 
                         dark:hover:bg-slate-800 transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              {theme === 'light'
                ? <MoonIcon className="w-5 h-5" />
                : <SunIcon className="w-5 h-5" />
              }
            </button>

            {/* User Dropdown (Desktop) */}
            {user ? (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="Open user menu"
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 
                             p-1.5 rounded-full pr-3 transition-colors 
                             border border-transparent hover:border-gray-200 dark:hover:border-slate-700
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover shadow-sm bg-[#22C55E]/20"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-[#22C55E]" />
                  )}
                  <span className="font-semibold text-sm text-gray-700 dark:text-slate-200 hidden md:block whitespace-nowrap max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1E293B] 
                                  rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 
                                  border border-gray-100 dark:border-slate-700 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                        {user.email || 'Farmer Account'}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium 
                                 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-[#22C55E] 
                                 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Your Profile
                    </Link>
                    <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-500 
                                   hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="font-semibold text-sm px-4 py-2 rounded-full 
                             text-gray-600 dark:text-slate-300 
                             hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="font-bold text-sm px-5 py-2 bg-[#22C55E] hover:bg-green-600 
                             text-white rounded-full shadow-lg shadow-green-500/20 
                             transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger Button */}
            <HamburgerButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (rendered outside <nav> so backdrop covers the full viewport) */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        location={location}
      />
    </>
  );
};

export default Navbar;
