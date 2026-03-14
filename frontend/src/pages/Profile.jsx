import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="card-bg p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
        <UserCircleIcon className="w-32 h-32 text-gray-300 dark:text-gray-600" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-500 mb-1">{user.email}</p>
          {user.location && <p className="text-gray-500">📍 {user.location}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
