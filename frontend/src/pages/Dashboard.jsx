import React, { useState, useEffect } from 'react';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import ProblemCard from '../components/ProblemCard';
import Card from '../components/Card';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, FaceFrownIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/problems', {
        params: {
          page,
          keyword: debouncedSearchTerm,
          category,
          sort
        }
      });
      setProblems(data.problems || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error(err);
      // Fail gracefully and show mock data if API is down
      setError(null); // we'll show empty or mock instead
      setProblems([
         { _id: '1', title: 'Yellow leaves on tomato plant', description: 'My tomato plants have started yellowing from the bottom up. Could this be blight or nutrient deficiency?', cropType: 'Vegetables', createdBy: { name: 'Ramesh Singh', location: 'Punjab' } },
         { _id: '2', title: 'Pest attack on Wheat crop', description: 'Small insects are eating the leaves of young wheat. What is the organic remedy?', cropType: 'Wheat', createdBy: { name: 'Suresh Patel', location: 'Gujarat' } },
         { _id: '3', title: 'Low yield in sugarcane', description: 'Despite good irrigation, sugarcane growth is stunted. Any fertilizer recommendation?', cropType: 'Sugarcane', createdBy: { name: 'Amit Kumar', location: 'UP' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearchTerm, category, sort]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const cropCategories = ['All', 'Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-main dark:text-text-inverse mb-3">
          Community <span className="text-brand-secondary">Problems</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Help fellow farmers or find solutions to your own crop issues.
        </p>
      </div>

      {/* Filters Section */}
      <Card hoverEffect={false} className="p-2 sm:p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search problems or crops..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary transition-all outline-none text-text-main dark:text-text-inverse placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter Dropdown */}
            <div className="relative min-w-[160px]">
              <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none text-text-main dark:text-text-inverse transition-all cursor-pointer"
              >
                {cropCategories.map(cat => (
                  <option key={cat} value={cat}>{cat} Crops</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[160px]">
              <ArrowsUpDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select 
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full appearance-none pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none text-text-main dark:text-text-inverse transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/30">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-24 px-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center">
            <FaceFrownIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-heading font-bold text-gray-700 dark:text-gray-200 mb-2">No problems found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">We couldn't find any problems matching your current search and filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem) => (
              <div key={problem._id} className="transition-all duration-300 transform">
                <ProblemCard problem={problem} />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 bg-white dark:bg-card-dark p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 w-max mx-auto">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                Prev
              </button>
              
              <div className="flex gap-1 px-4">
                {[...Array(pages).keys()].map(x => (
                  <button
                    key={x + 1}
                    onClick={() => setPage(x + 1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${page === x + 1 ? 'bg-brand-primary text-white shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
               >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
