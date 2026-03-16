import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MandiPrices = () => {
    // State Definitions
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters and Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    const [filterData, setFilterData] = useState({ crops: [], states: [], mandis: [] });
    const [selectedCrop, setSelectedCrop] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedMandi, setSelectedMandi] = useState('');

    // Fetch filters to populate dropdowns
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/mandi-prices/filters');
                if (res.data.success) {
                    setFilterData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load filters", err);
            }
        };
        fetchFilters();
    }, []);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Fetch Data
    const fetchMandiPrices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let url = 'http://localhost:5000/api/mandi-prices';
            
            // If there's an active search string, hit the search endpoint instead
            if (debouncedSearch) {
                 url = `http://localhost:5000/api/mandi-prices/search?q=${debouncedSearch}`;
            } else {
                 // Build query params
                 const params = new URLSearchParams();
                 if (selectedCrop) params.append('crop', selectedCrop);
                 if (selectedState) params.append('state', selectedState);
                 if (selectedMandi) params.append('mandi', selectedMandi);
                 
                 if (params.toString()) {
                     url += `?${params.toString()}`;
                 }
            }

            const response = await axios.get(url);
            if (response.data.success) {
                setPrices(response.data.data);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
             setError(err.message || 'Error communicating with server');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, selectedCrop, selectedState, selectedMandi]);

    useEffect(() => {
        fetchMandiPrices();
    }, [fetchMandiPrices]);

    // Clear filters function
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCrop('');
        setSelectedState('');
        setSelectedMandi('');
    };

    // Prepare data for the graph (Trend chart usually looks at average modal price by date)
    // Here we'll take a subset of the first 30 prices and sort them by ascending date for line-charting
    const chartData = [...prices]
        .slice(0, 30)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            price: item.modalPrice,
            crop: item.cropName,
            mandi: item.mandiName
        }));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-slate-200 py-10 px-4 md:px-8 lg:px-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header & Title */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 gap-6">
                     <div className="flex items-center gap-4">
                         <div className="bg-[#22C55E]/10 p-4 rounded-2xl shrink-0">
                            <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         </div>
                         <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">Mandi <span className="text-[#22C55E]">Prices</span></h1>
                            <p className="mt-1 text-gray-500 dark:text-slate-400 font-medium">Real-time market rates from across India.</p>
                         </div>
                     </div>
                     <button 
                         onClick={fetchMandiPrices}
                         className="w-full lg:w-auto px-6 py-4 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-green-500/20 active:scale-95"
                     >
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                         Refresh Market Data
                     </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Search Input */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#22C55E] mb-2 px-1">Quick Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-3 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-medium"
                                    placeholder="Crop or Mandi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Crop Filter */}
                        <div>
                             <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Crop</label>
                            <select 
                                className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                disabled={!!debouncedSearch}
                            >
                                <option value="">All Crops</option>
                                {filterData.crops.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* State Filter */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">State</label>
                            <select 
                                className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                disabled={!!debouncedSearch}
                            >
                                <option value="">All States</option>
                                {filterData.states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        
                        {/* Mandi Filter */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Mandi</label>
                            <select 
                                className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                                value={selectedMandi}
                                onChange={(e) => setSelectedMandi(e.target.value)}
                                disabled={!!debouncedSearch}
                            >
                                <option value="">All Mandis</option>
                                {filterData.mandis.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    {(searchQuery || selectedCrop || selectedState || selectedMandi) && (
                         <div className="mt-6 flex justify-end">
                            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-black uppercase tracking-widest flex items-center transition-all bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                Clear All Filters
                            </button>
                         </div>
                    )}
                </div>

                {/* Graph Section */}
                {!loading && prices.length > 0 && (
                     <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                            Price Trend (Recent Data)
                        </h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickMargin={10} />
                                    <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#22C55E', fontWeight: 'bold' }}
                                        formatter={(value, name, props) => [`₹${value}`, `${props.payload.crop} (${props.payload.mandi})`]}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                                    <Line type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Modal Price (₹)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                )}

                {/* Data Section */}
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {loading ? (
                         <div className="flex flex-col justify-center items-center py-20">
                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
                             <p className="mt-4 text-gray-500 dark:text-slate-400 animate-pulse">Fetching market data...</p>
                         </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                             <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             {error}
                        </div>
                    ) : prices.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                            <p className="text-xl text-gray-500 dark:text-slate-400 font-medium">No mandi prices found.</p>
                            <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-700">
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">Crop</th>
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">Mandi</th>
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">State</th>
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">Modal Price</th>
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">Min - Max</th>
                                            <th className="p-4 text-gray-600 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                                        {prices.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                        {item.cropName}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">{item.mandiName}</td>
                                                <td className="p-4 text-gray-600 dark:text-slate-300">{item.state}</td>
                                                <td className="p-4 font-bold text-[#22C55E] text-lg">₹{item.modalPrice}</td>
                                                <td className="p-4 text-sm text-gray-500 dark:text-slate-400">₹{item.minPrice} - ₹{item.maxPrice}</td>
                                                <td className="p-4 text-sm text-gray-500 dark:text-slate-400">{new Date(item.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-800">
                                {prices.map((item) => (
                                    <div key={item._id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-800/20 transition-all active:scale-[0.98]">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <div className="min-w-0">
                                                 <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#22C55E]/10 text-[#22C55E] mb-3">
                                                    {item.cropName}
                                                </span>
                                                <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight truncate">{item.mandiName}</h3>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium flex items-center mt-1">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    {item.state}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                 <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Modal Price</p>
                                                 <p className="font-black text-[#22C55E] text-2xl">₹{item.modalPrice}</p>
                                                 <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-slate-800 mt-4">
                                            <div className="text-center">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Min</p>
                                                <p className="text-sm font-black text-gray-700 dark:text-slate-300">₹{item.minPrice}</p>
                                            </div>
                                            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
                                            <div className="text-center">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Max</p>
                                                <p className="text-sm font-black text-gray-700 dark:text-slate-300">₹{item.maxPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default MandiPrices;
