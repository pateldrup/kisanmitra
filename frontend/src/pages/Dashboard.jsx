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
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-main dark:text-text-inverse mb-2">
          Community <span className="text-brand-secondary">Problems</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Help fellow farmers or find solutions to your own crop issues.
        </p>
      </div>

      {/* Filters */}
      <Card hoverEffect={false} className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems or crops..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse placeholder-gray-400"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative min-w-[150px]">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-9 pr-8 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none text-text-main dark:text-text-inverse cursor-pointer"
              >
                {CROP_CATEGORIES.map(c => <option key={c} value={c}>{c} Crops</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><ChevronDown /></div>
            </div>
            <div className="relative min-w-[150px]">
              <ArrowsUpDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-9 pr-8 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none text-text-main dark:text-text-inverse cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><ChevronDown /></div>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <FaceFrownIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-700 dark:text-gray-200 mb-2">No problems found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">Try adjusting your search or filters, or be the first to post!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 bg-white dark:bg-card-dark p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 w-max mx-auto">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">Prev</button>
              <div className="flex gap-1 px-2">
                {[...Array(pages).keys()].map(x => (
                  <button key={x + 1} onClick={() => setPage(x + 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${page === x + 1 ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {x + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
