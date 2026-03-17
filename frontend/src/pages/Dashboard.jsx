import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { AuthContext } from '../context/AuthContext';
import ProblemCard from '../components/ProblemCard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);

  // Fetch Crops for Dashboard
  useEffect(() => {
     let cancelled = false;
     const fetchCrops = async () => {
         setCropsLoading(true);
         try {
             const { data } = await api.get('crops?limit=5'); // Fetch a few crops
             // API returns array directly in response.data based on cropController.js
             if (!cancelled) setCrops(Array.isArray(data) ? data : (data.data || []));
         } catch (err) {
             console.error('Error fetching crops', err);
         } finally {
             if (!cancelled) setCropsLoading(false);
         }
     };
     fetchCrops();
     return () => { cancelled = true; };
  }, []);

  // Fetch Latest Problems for Dashboard
  useEffect(() => {
     let cancelled = false;
     const fetchProblems = async () => {
         setProblemsLoading(true);
         try {
             // Fetch 3 latest problems
             const { data } = await api.get('problems?limit=3&sort=newest');
             if (!cancelled) {
                 // Support both { problems: [] } and [] structure
                 const probs = data.problems || (Array.isArray(data) ? data : []);
                 setProblems(probs);
             }
         } catch (err) {
             console.error('Error fetching problems', err);
         } finally {
             if (!cancelled) setProblemsLoading(false);
         }
     };
     fetchProblems();
     return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 lg:px-16 transition-all duration-300">
      {/* Recommended Crops Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Featured <span className="text-[#22C55E]">Crops</span></h2>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Discover popular crops and best practices.</p>
          </div>
        </div>

        {cropsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
            </div>
        ) : crops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
               {crops.slice(0, 3).map(crop => (
                   <div key={crop._id} className="group bg-white dark:bg-[#1E293B] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl shadow-black/5 hover:border-[#22C55E]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 flex flex-col h-full">
                       <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                           <img 
                               src={crop.image} 
                               alt={crop.name} 
                               loading="lazy"
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                               onError={(e) => { e.target.src = '/images/crops/placeholder.jpg'; e.target.onerror = null; }}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                           <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E]">{crop.season}</span>
                           </div>
                       </div>
                       <div className="p-6 flex flex-col flex-grow">
                           <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#22C55E] transition-colors">{crop.name}</h3>
                           <p className="text-sm font-medium text-gray-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed">{crop.description}</p>
                           <button onClick={() => navigate(`/crop-guide/${crop._id}`)} className="w-full py-4 bg-gray-50 dark:bg-[#1E293B] hover:bg-[#22C55E] text-gray-700 dark:text-slate-300 hover:text-white rounded-2xl font-bold transition-all text-sm uppercase tracking-widest group-hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500/20 active:scale-95 flex items-center justify-center">
                               View Details
                               <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </button>
                       </div>
                   </div>
               ))}
            </div>
        ) : (
            <p className="text-gray-500 text-sm">No crops available right now.</p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-slate-800" />

      {/* Featured Problems Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Community <span className="text-[#22C55E]">Problems</span></h2>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Help fellow farmers or learn from community solutions.</p>
          </div>
        </div>

        {problemsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
            </div>
        ) : problems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
               {problems.map(problem => (
                   <ProblemCard key={problem._id} problem={problem} />
               ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                <p className="text-gray-500 font-medium">No problems posted yet.</p>
                <button onClick={() => navigate('/create-problem')} className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl font-bold shadow-lg shadow-green-500/20">
                    Post a Problem
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
