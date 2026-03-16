import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-card-dark mt-auto py-8 border-t border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Logo className="scale-75 origin-left" />
          </div>
          
          <div className="text-gray-500 dark:text-slate-400 text-sm text-center md:text-right font-medium">
            <p className="mb-1">&copy; {new Date().getFullYear()} KisanMitra - Smart Farmer Help & Support Platform.</p>
            <p className="text-xs opacity-75 italic">Empowering agriculture through technology.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
