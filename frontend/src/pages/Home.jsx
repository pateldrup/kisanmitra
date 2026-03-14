import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-6">
        Welcome to <span className="text-primary">KisanMitra</span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
        The ultimate Help & Support Platform for Farmers. Share your farming problems, get expert solutions, and connect with a community that cares about agriculture.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/signup" 
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-hover hover:scale-105 transition transform duration-200"
        >
          Join the Community
        </Link>
        <Link 
          to="/dashboard" 
          className="px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow border border-primary hover:bg-gray-50 dark:bg-gray-800 dark:text-primary dark:border-primary dark:hover:bg-gray-700 transition transform duration-200"
        >
          Browse Problems
        </Link>
      </div>
    </div>
  );
};

export default Home;
