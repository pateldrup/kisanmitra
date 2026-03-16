import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import ProblemCard from '../components/ProblemCard';
import Card from '../components/Card';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';

const CROP_CATEGORIES = ['All', 'Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other'];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/problems', {
          params: { page, keyword: debouncedSearch, category, sort }
        });
        if (!cancelled) {
          setProblems(data.problems || []);
          setPages(data.pages || 1);
          setPage(data.page || 1);
        }
      } catch {
        if (!cancelled) setProblems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, category, sort]);

  const ChevronDown = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 lg:px-16 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-main dark:text-text-inverse leading-tight">
            Community <span className="text-[#22C55E]">Problems</span>
          </h1>
          <p className="mt-1 text-gray-500 dark:text-slate-400 font-medium">
            Help fellow farmers or find solutions to your own crop issues.
          </p>
        </div>
        <button className="w-full md:w-auto bg-[#22C55E] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all">
          Post a Problem
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1E293B] p-4 md:p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems or crops..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-text-inverse font-medium placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative min-w-[200px]">
              <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-11 pr-10 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none text-text-main dark:text-text-inverse font-bold cursor-pointer"
              >
                {CROP_CATEGORIES.map(c => <option key={c} value={c}>{c} Crops</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><ChevronDown /></div>
            </div>
            <div className="relative min-w-[180px]">
              <ArrowsUpDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-11 pr-10 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none text-text-main dark:text-text-inverse font-bold cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><ChevronDown /></div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[450px] bg-gray-100 dark:bg-[#1E293B] rounded-[2rem] animate-pulse border border-gray-100 dark:border-slate-800" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center bg-gray-50/50 dark:bg-[#1E293B]/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#0F172A] rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FaceFrownIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-700 dark:text-gray-200 mb-2 uppercase tracking-tighter">No problems found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm font-medium">Try adjusting your search or filters, or be the first to post!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 bg-white dark:bg-[#1E293B] p-2 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 w-max mx-auto overflow-hidden">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-[#0F172A] disabled:opacity-30 transition-all active:scale-95 text-gray-500">Prev</button>
              <div className="flex gap-2">
                {[...Array(pages).keys()].map(x => (
                  <button key={x + 1} onClick={() => setPage(x + 1)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all active:scale-90 ${page === x + 1 ? 'bg-[#22C55E] text-white shadow-lg shadow-green-500/30' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-[#0F172A]'}`}>
                    {x + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-[#0F172A] disabled:opacity-30 transition-all active:scale-95 text-[#22C55E]">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
