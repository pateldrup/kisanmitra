import React from 'react';

const Footer = () => {
  return (
    <footer className="card-bg mt-auto py-6 text-center text-gray-500 text-sm shadow-inner">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} KisanMitra - Farmer Help & Support Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
