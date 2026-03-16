import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import cropService from '../services/cropService';
import CropCard from '../components/CropCard';
import CropComparisonModal from '../components/CropComparisonModal';

const CropLibrary = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters and Search
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [season, setSeason] = useState('');
    const [soilType, setSoilType] = useState('');
    const [waterRequirement, setWaterRequirement] = useState('');
    
    // Comparison State
    const [compareMode, setCompareMode] = useState(false);
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(timerId);
        };
    }, [search]);

    // Fetch crops based on filters
    const fetchCrops = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (season) params.season = season;
            if (soilType) params.soilType = soilType;
            if (waterRequirement) params.waterRequirement = waterRequirement;

            const data = await cropService.getCrops(params);
            setCrops(data);
        } catch (err) {
            setError('Failed to load crops data.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, season, soilType, waterRequirement]);

    useEffect(() => {
        fetchCrops();
    }, [fetchCrops]);


    const handleSelectForCompare = (crop) => {
        if (selectedCrops.find(c => c._id === crop._id)) {
            setSelectedCrops(selectedCrops.filter(c => c._id !== crop._id));
        } else if (selectedCrops.length < 2) {
            setSelectedCrops([...selectedCrops, crop]);
        } else {
             alert('You can only compare 2 crops at a time.');
        }
    };

    const handleCompareClick = () => {
        if (selectedCrops.length === 2) {
            setShowModal(true);
        } else {
            alert('Please select exactly 2 crops to compare.');
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 bg-[#F0FDF4] dark:bg-[#0F172A] min-h-[calc(100vh-4rem)] transition-all duration-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                        <span className="text-[#22C55E]">Crop</span> Library
                   </h1>
                   <p className="text-gray-600 dark:text-slate-400 font-medium">Discover the best crops for your farm based on soil and season.</p>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                     <button 
                        onClick={() => {
                            setCompareMode(!compareMode);
                            setSelectedCrops([]); // Reset selection when toggling
                        }}
                        className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${compareMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-[#22C55E]'}`}
                     >
                        {compareMode ? 'Cancel' : 'Compare'}
                     </button>
                     {compareMode && (
                        <button 
                            onClick={handleCompareClick}
                            disabled={selectedCrops.length !== 2}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all ${selectedCrops.length === 2 ? 'bg-[#22C55E] hover:bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
                        >
                            Compare Details
                        </button>
                     )}
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-[#1E293B] p-5 md:p-8 rounded-2xl shadow-xl shadow-black/5 dark:shadow-none mb-10 border border-gray-100 dark:border-slate-800 transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Search */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-xs font-black uppercase tracking-widest text-[#22C55E] mb-2 px-1">Search Crop</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="e.g. Wheat, Rice..." 
                                className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl p-3.5 pl-11 focus:outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-medium"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                    {/* Season Filter */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Season</label>
                        <select 
                            value={season} 
                            onChange={(e) => setSeason(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="">All Seasons</option>
                            <option value="Kharif">Kharif (Monsoon)</option>
                            <option value="Rabi">Rabi (Winter)</option>
                            <option value="Zaid">Zaid (Summer)</option>
                        </select>
                    </div>
                    {/* Soil Type Filter */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Soil Type</label>
                        <select 
                            value={soilType} 
                            onChange={(e) => setSoilType(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="">All Soils</option>
                            <option value="Clay">Clay</option>
                            <option value="Loamy">Loamy</option>
                            <option value="Sandy">Sandy</option>
                            <option value="Alluvial">Alluvial</option>
                            <option value="Black">Black</option>
                            <option value="Red">Red</option>
                        </select>
                    </div>
                     {/* Water Requirement Filter */}
                     <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Water Need</label>
                        <select 
                            value={waterRequirement} 
                            onChange={(e) => setWaterRequirement(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl p-3.5 focus:outline-none focus:border-[#22C55E] focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-bold appearance-none cursor-pointer"
                        >
                            <option value="">Any Need</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {error && <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg">{error}</div>}
            
            {loading ? (
                <div className="flex justify-center items-center py-20">
                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#22C55E]"></div>
                </div>
            ) : crops.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-xl text-gray-600 dark:text-slate-400">No crops found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {crops.map((crop) => (
                        <CropCard 
                            key={crop._id} 
                            crop={crop}
                            compareMode={compareMode}
                            isSelected={selectedCrops.some(c => c._id === crop._id)}
                            onSelect={() => handleSelectForCompare(crop)}
                        />
                    ))}
                </div>
            )}

            {/* Comparison Modal */}
            {showModal && selectedCrops.length === 2 && (
                <CropComparisonModal 
                    crop1Id={selectedCrops[0]._id} 
                    crop2Id={selectedCrops[1]._id} 
                    onClose={() => setShowModal(false)} 
                />
            )}

        </div>
    );
};

export default CropLibrary;
