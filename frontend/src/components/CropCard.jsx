import React from 'react';
import { Link } from 'react-router-dom';

const CropCard = ({ crop, compareMode, isSelected, onSelect }) => {
    return (
        <div 
            className={`group bg-white dark:bg-[#1E293B] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl shadow-black/5 transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full ${
                isSelected 
                ? 'border-[#22C55E] ring-4 ring-[#22C55E]/20' 
                : 'hover:border-[#22C55E]/50 hover:shadow-2xl hover:shadow-green-500/10'
            }`}
        >
            {/* Top Section: Crop Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                <img 
                    src={crop.image || '/images/crops/placeholder.jpg'} 
                    alt={crop.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { 
                        e.target.src = '/images/crops/placeholder.jpg';
                        e.target.onerror = null;
                    }}
                />
                
                {/* Season Badge */}
                <div className="absolute top-4 left-4">
                    <div className="bg-white/90 dark:bg-[#0F172A]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">{crop.season}</span>
                    </div>
                </div>

                {compareMode && (
                     <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        onClick={onSelect}
                     >
                         <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-300 transform ${isSelected ? 'bg-[#22C55E] border-white text-white scale-110' : 'border-white text-white hover:bg-[#22C55E] hover:border-[#22C55E]'}`}>
                             {isSelected ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                             ) : (
                                <span className="font-bold text-2xl">+</span>
                             )}
                         </div>
                     </div>
                )}
            </div>
            
            {/* Bottom Section: Details */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#22C55E] transition-colors truncate">{crop.name}</h3>
                </div>
                
                <div className="space-y-3 md:space-y-4 mb-6">
                    <div className="flex items-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                        <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase font-bold text-blue-600/70 dark:text-blue-400 mt-0.5">Water</p>
                            <p className="text-sm font-bold text-gray-700 dark:text-slate-200 truncate">{crop.waterRequirement}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <div className="min-w-0">
                                <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400">Temp</p>
                                <p className="text-[11px] md:text-xs font-bold dark:text-slate-300 truncate">{crop.temperatureRange}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-[#22C55E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div className="min-w-0">
                                <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400">Days</p>
                                <p className="text-[11px] md:text-xs font-bold dark:text-slate-300 truncate">{crop.growthDuration}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {!compareMode && (
                    <Link 
                        to={`/crop-guide/${crop._id}`}
                        className="flex items-center justify-center w-full min-h-[44px] py-3 px-4 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                    >
                        View Full Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default CropCard;
