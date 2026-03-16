import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 transition-all duration-300 pb-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-main dark:text-white leading-tight">
          Farmer <span className="text-[#22C55E]">Profile</span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          Manage your account settings and farming preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-10 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#22C55E]/5 rounded-bl-[6rem] -mr-24 -mt-24 transition-all group-hover:scale-110"></div>
        
        <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-slate-700 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <UserCircleIcon className="w-full h-full text-gray-200 dark:text-slate-800" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#22C55E] rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-[#1E293B]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </div>
        </div>

        <div className="flex-grow space-y-8 text-center md:text-left relative">
          <div>
            <h2 className="text-4xl font-black text-text-main dark:text-white tracking-tighter mb-1 uppercase">{user.name}</h2>
            <p className="text-[#22C55E] font-black text-sm uppercase tracking-[0.2em] opacity-80">Verified Farmer</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Registry</p>
                <p className="text-lg font-bold text-gray-700 dark:text-slate-200 break-all">{user.email}</p>
            </div>

            {user.location && (
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Default Location</p>
                    <p className="text-lg font-bold text-gray-700 dark:text-slate-200">📍 {user.location}</p>
                </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-slate-800/50 flex flex-wrap justify-center md:justify-start gap-4">
             <button className="px-8 py-4 bg-gray-50 dark:bg-[#0F172A] hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-gray-100 dark:border-slate-700/50">Edit Profile</button>
             <button className="px-8 py-4 bg-gray-50 dark:bg-[#0F172A] hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-gray-100 dark:border-slate-700/50">Security Gear</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
