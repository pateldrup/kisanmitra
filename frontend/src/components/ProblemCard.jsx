import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();
  
  const getFallbackImage = (cropType) => {
    switch(cropType?.toLowerCase()) {
      case 'rice': return 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=600&q=80';
      case 'cotton': return 'https://images.unsplash.com/photo-1595861937409-f67451a3f01c?w=600&q=80';
      case 'maize': return 'https://images.unsplash.com/photo-1629854483526-9d8a556d43e5?w=600&q=80';
      case 'sugarcane': return 'https://images.unsplash.com/photo-1596489397940-201ea99ec8e4?w=600&q=80';
      case 'wheat': return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80';
      default: return 'https://images.unsplash.com/photo-1592982537447-6f2ecdd2fcc5?w=600&q=80';
    }
  };

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const imageUrl = problem.image 
    ? (problem.image.startsWith('http') ? problem.image : `${backendUrl}${problem.image}`) 
    : getFallbackImage(problem.cropType);

  return (
    <div className="group bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-[#22C55E]/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
        <img
          src={imageUrl}
          alt={problem.title || problem.cropType || 'Problem Image'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = getFallbackImage(problem.cropType); e.target.onerror = null; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-[#22C55E] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {problem.cropType || 'General'}
          </span>
        </div>
        {problem.solutions?.length > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <ChatBubbleLeftIcon className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[10px] font-black text-gray-700 dark:text-white">{problem.solutions.length}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#22C55E] transition-colors leading-snug">
          {problem.title}
        </h3>

        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {problem.description || 'No description provided for this problem.'}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800/60 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <UserIcon className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span className="truncate font-medium">{problem.userName || problem.createdBy?.name || 'Local Farmer'}</span>
            {(problem.location || problem.createdBy?.location) && (
              <>
                <span className="text-gray-300 dark:text-slate-700">•</span>
                <MapPinIcon className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span className="truncate">{problem.location || problem.createdBy?.location}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{new Date(problem.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/problem/${problem._id}`)}
          className="w-full min-h-[44px] py-3 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2"
        >
          View Solutions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
