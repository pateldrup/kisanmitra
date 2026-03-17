import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import ProblemCard from '../components/ProblemCard';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';

const CROP_TYPES = ['All', 'Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other'];

export default function CommunityProblems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedLocation = useDebounce(locationFilter, 500);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: sortBy
      });
      
      if (debouncedSearch) params.append('keyword', debouncedSearch);
      if (cropFilter !== 'All') params.append('category', cropFilter);
      if (debouncedLocation) params.append('location', debouncedLocation);

      const { data } = await api.get(`/problems?${params.toString()}`);
      
      setProblems(data.problems);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [debouncedSearch, cropFilter, debouncedLocation, sortBy, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-[#1E293B] p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-main dark:text-text-inverse tracking-tight">
            Community <span className="text-[#22C55E]">Problems</span>
          </h1>
          <p className="mt-3 text-gray-500 dark:text-slate-400 font-medium text-lg">
            Share your farming challenges and get advice from experts and peers.
          </p>
        </div>
        <Link to="/create-problem" className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-[#22C55E] hover:bg-green-600 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-green-500/20 active:scale-95 group">
          <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span>Post a Problem</span>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search Bar */}
        <div className="relative md:col-span-5">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search problems or crops..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#22C55E] outline-none text-text-main dark:text-text-inverse font-medium transition-all"
          />
        </div>

        {/* Location Filter */}
        <div className="relative md:col-span-3">
          <input
             type="text"
             placeholder="Filter by location..."
             value={locationFilter}
             onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }}
             className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#22C55E] outline-none text-text-main dark:text-text-inverse font-medium transition-all"
          />
        </div>

        {/* Crop Filter */}
        <div className="relative md:col-span-2">
            <select
              value={cropFilter}
              onChange={(e) => { setCropFilter(e.target.value); setPage(1); }}
              className="w-full appearance-none px-5 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-text-inverse font-bold cursor-pointer"
            >
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>

        {/* Sort Filter */}
        <div className="relative md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full appearance-none px-5 py-3.5 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-text-inverse font-bold cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 dark:bg-[#1E293B] rounded-[2rem] animate-pulse border border-gray-200 dark:border-slate-800" />
          ))}
        </div>
      ) : problems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-800 disabled:opacity-50 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
               >
                Prev
              </button>
              <span className="px-4 py-2 font-black text-gray-500">
                 {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-slate-800 disabled:opacity-50 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-[#1E293B] rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-[#0F172A] rounded-full flex items-center justify-center mb-6">
                <FunnelIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-text-main dark:text-text-inverse mb-2">No problems found</h3>
            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                We couldn't find any problems matching your current filters. Try adjusting your search or be the first to post a new problem!
            </p>
            <button 
                onClick={() => { setSearchTerm(''); setCropFilter('All'); setLocationFilter(''); }}
                className="mt-8 px-8 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl transition-colors"
            >
                Clear Filters
            </button>
        </div>
      )}
    </div>
  );
}
