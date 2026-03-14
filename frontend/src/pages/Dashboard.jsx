import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-main dark:text-text-inverse mb-3">
          Welcome to <span className="text-brand-secondary">KisanMitra</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your Smart Digital Assistant for Farming.
        </p>
      </div>

      <Card hoverEffect={false} className="p-8 sm:p-12 text-center border-dashed border-2 bg-brand-primary/5 dark:bg-card-dark flex flex-col items-center justify-center min-h-[400px]">
        <span className="text-6xl mb-6 inline-block">🌾</span>
        <h2 className="text-2xl font-bold text-text-main dark:text-text-inverse mb-4">
          Hello, {user?.name || 'Farmer'}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
          Welcome to Phase 1 of the KisanMitra platform. We have successfully set up your secure account.
        </p>
        <p className="text-gray-500 text-md mt-6 max-w-md mx-auto">
          More farming features such as Community Problems, Crop Guide, and Weather will be added soon.
        </p>
      </Card>
      
    </div>
  );
};

export default Dashboard;
