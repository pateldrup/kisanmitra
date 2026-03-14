import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <span className="text-8xl mb-6 inline-block">🌱</span>
      <h1 className="text-5xl font-heading font-extrabold mb-6 text-text-main dark:text-text-inverse tracking-tight">
        Welcome to <span className="text-brand-secondary">KisanMitra</span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
        Phase 1: Your Secure Farming Account. Join our platform to access future modules like Community Problems, Crop Guide, and Mandi Prices.
      </p>
      
      <div className="flex gap-4">
        <Link to="/signup">
          <Button className="!px-8 !py-3 text-lg">
            Create an Account
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="!px-8 !py-3 text-lg">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
