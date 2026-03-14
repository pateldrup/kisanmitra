import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myProblems, setMyProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        const { data } = await api.get('/problems');
        // Filter client-side for simplicity, or we could add a new endpoint /api/problems/me
        const userProblems = data.problems.filter(p => p.createdBy?._id === user._id);
        setMyProblems(userProblems);
      } catch (error) {
        console.error("Failed to fetch user problems");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchMyProblems();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card-bg p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
        <UserCircleIcon className="w-32 h-32 text-gray-300 dark:text-gray-600" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-500 mb-1">{user.email}</p>
          {user.location && <p className="text-gray-500">📍 {user.location}</p>}
        </div>
      </div>

      {/* User's Problems */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Posted Problems</h2>
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[...Array(3)].map((_, i) => (
                 <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
             ))}
         </div>
        ) : myProblems.length === 0 ? (
          <div className="text-center py-12 card-bg rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 mb-4">You haven't posted any problems yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProblems.map(problem => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
