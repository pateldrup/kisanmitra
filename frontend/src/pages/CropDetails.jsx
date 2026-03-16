import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import cropService from '../services/cropService';

const CropDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCropDetails = async () => {
             try {
                const response = await cropService.getCropById(id);
                setData(response);
             } catch (err) {
                 setError('Failed to fetch crop details.');
             } finally {
                 setLoading(false);
             }
        };
        fetchCropDetails();
    }, [id]);

    if (loading) {
         return (
             <div className="flex justify-center items-center h-screen bg-[#0F172A]">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#22C55E]"></div>
             </div>
         );
    }

    if (error || !data || !data.crop) {
         return (
             <div className="flex flex-col items-center justify-center p-20 bg-[#0F172A] text-white min-h-screen">
                 <h2 className="text-3xl text-red-500 mb-4">{error || 'Crop not found'}</h2>
                 <Link to="/crop-guide" className="px-6 py-2 bg-[#22C55E] rounded-lg text-white font-semibold">Back to Library</Link>
             </div>
         );
    }

    const { crop, fertilizers, diseases } = data;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-slate-200 py-10 px-4 md:px-8 lg:px-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Back Link */}
                <Link to="/crop-guide" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22C55E] font-black uppercase tracking-widest text-xs transition-colors group mb-8">
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Library Overview
                </Link>

                {/* Hero Section */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 mb-10 border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row">
                     <div className="md:w-2/5 lg:w-1/3 relative h-72 md:h-auto overflow-hidden">
                        <img 
                            src={crop.image} 
                            alt={crop.name}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Crop+Image+Missing' }}
                        />
                        <div className="absolute top-6 left-6 bg-[#22C55E] text-white px-5 py-2 rounded-2xl text-[10px] font-black shadow-xl shadow-green-500/20 uppercase tracking-widest">
                            {crop.season} Season
                        </div>
                     </div>
                     <div className="p-8 md:p-12 lg:p-16 md:w-3/5 lg:w-2/3 flex flex-col">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-main dark:text-white mb-6 tracking-tighter leading-none">{crop.name}</h1>
                        <p className="text-gray-500 dark:text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-medium max-w-2xl">
                            {crop.description}
                        </p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                              {[
                                {label: 'Water', value: crop.waterRequirement, color: 'blue', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'},
                                {label: 'Temp', value: crop.temperatureRange, color: 'yellow', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'},
                                {label: 'Soil', value: crop.soilType, color: 'amber', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'},
                                {label: 'Days', value: crop.growthDuration, color: 'green', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'}
                              ].map((stat, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-[#0F172A] p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-all hover:scale-105 group">
                                    <svg className={`w-8 h-8 text-${stat.color}-500 mb-3 transform transition-transform group-hover:scale-125`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon}></path></svg>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className="font-black text-gray-900 dark:text-white leading-none whitespace-nowrap">{stat.value}</span>
                                </div>
                              ))}
                        </div>
                     </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto space-x-2 mb-8 no-scrollbar scroll-smooth p-1 bg-white/50 dark:bg-[#1E293B]/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                     {[
                        {id: 'overview', label: 'Overview & Tips'},
                        {id: 'fertilizers', label: 'Nutrition Plan'},
                        {id: 'diseases', label: 'Disease Control'}
                     ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#22C55E] text-white shadow-xl shadow-green-500/20 active:scale-95' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#0F172A]'}`}
                        >
                            {tab.label}
                        </button>
                     ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 min-h-[500px]">
                     {/* Overview Tab */}
                     {activeTab === 'overview' && (
                         <div className="space-y-12 animate-fadeIn">
                             <div>
                                 <h3 className="text-3xl font-black text-text-main dark:text-white mb-8 flex items-center tracking-tight uppercase">
                                     <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                     </div>
                                     Farming Excellence
                                 </h3>
                                 {crop.farmingTips?.bestPractices?.length > 0 ? (
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {crop.farmingTips.bestPractices.map((tip, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-[#0F172A] p-6 rounded-[2rem] flex items-start border border-gray-100/50 dark:border-slate-800/50 transition-all hover:scale-[1.02]">
                                                <div className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0 mr-4 font-black shadow-lg shadow-green-500/20">{index + 1}</div>
                                                <span className="text-gray-700 dark:text-slate-300 font-medium leading-relaxed">{tip}</span>
                                            </div>
                                        ))}
                                     </div>
                                 ) : (
                                     <div className="text-center py-20 bg-gray-50 dark:bg-[#0F172A] rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">No specific practices listed yet.</div>
                                 )}
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                 <div className="bg-red-50/30 dark:bg-red-900/5 p-8 md:p-10 rounded-[2.5rem] border border-red-50 dark:border-red-900/20">
                                     <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-8 flex items-center tracking-tight uppercase">
                                         <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                         Pitfalls to Avoid
                                     </h3>
                                     {crop.farmingTips?.commonMistakes?.length > 0 ? (
                                        <ul className="space-y-4">
                                            {crop.farmingTips.commonMistakes.map((mistake, index) => (
                                                <li key={index} className="flex items-start text-gray-700 dark:text-slate-300 font-medium">
                                                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-6 h-6 rounded-lg flex items-center justify-center mr-3 mt-1 shrink-0 font-black">!</span> 
                                                    {mistake}
                                                </li>
                                            ))}
                                        </ul>
                                     ) : (
                                         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No common mistakes listed.</p>
                                     )}
                                 </div>
                                  <div className="bg-amber-50/30 dark:bg-amber-900/5 p-8 md:p-10 rounded-[2.5rem] border border-amber-50 dark:border-amber-900/20">
                                     <h3 className="text-2xl font-black text-amber-600 dark:text-yellow-500 mb-8 flex items-center tracking-tight uppercase">
                                         <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                         Yield Boosters
                                     </h3>
                                     {crop.farmingTips?.yieldTips?.length > 0 ? (
                                        <ul className="space-y-4">
                                            {crop.farmingTips.yieldTips.map((tip, index) => (
                                                <li key={index} className="flex items-start text-gray-700 dark:text-slate-300 font-medium">
                                                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-yellow-500 w-6 h-6 rounded-lg flex items-center justify-center mr-3 mt-1 shrink-0 font-black">↑</span> 
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                     ) : (
                                         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No yield tips available.</p>
                                     )}
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Fertilizers Tab */}
                     {activeTab === 'fertilizers' && (
                         <div className="animate-fadeIn">
                             <h3 className="text-3xl font-black text-text-main dark:text-white mb-10 tracking-tight uppercase">Nutrient <span className="text-[#22C55E]">Roadmap</span></h3>
                             {fertilizers.length === 0 ? (
                                 <div className="text-center py-20 bg-gray-50 dark:bg-[#0F172A] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                     No nutrition data available yet.
                                 </div>
                             ) : (
                                 <div className="grid gap-6">
                                     {fertilizers.map((fert) => (
                                         <div key={fert._id} className="bg-gray-50 dark:bg-[#0F172A] border border-gray-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:scale-[1.01] transition-all group">
                                             <div className="mb-6 sm:mb-0">
                                                 <h4 className="text-2xl font-black text-[#22C55E] mb-2 uppercase tracking-tight">{fert.fertilizerType}</h4>
                                                 <div className="flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                     Optimal Time: {fert.usageTime}
                                                 </div>
                                             </div>
                                             <div className="bg-white dark:bg-[#1E293B] px-8 py-4 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-xl shadow-black/5">
                                                 <span className="text-gray-900 dark:text-white font-black text-xl">{fert.quantity}</span>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     )}

                     {/* Diseases Tab */}
                     {activeTab === 'diseases' && (
                         <div className="animate-fadeIn">
                             <h3 className="text-3xl font-black text-text-main dark:text-white mb-10 tracking-tight uppercase">Pathogen <span className="text-red-500">Registry</span></h3>
                             {diseases.length === 0 ? (
                                 <div className="text-center py-20 bg-gray-50 dark:bg-[#0F172A] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                     No disease records found yet.
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     {diseases.map((disease) => (
                                         <div key={disease._id} className="bg-gray-50 dark:bg-[#0F172A] rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 relative overflow-hidden group hover:border-red-500/20 transition-all">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[4rem] transition-all group-hover:bg-red-500/10 group-hover:scale-110"></div>
                                            <h4 className="text-2xl font-black text-red-600 dark:text-red-400 mb-6 uppercase tracking-tight">{disease.diseaseName}</h4>
                                            
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 opacity-60">Visual Symptoms</p>
                                                    <p className="text-gray-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{disease.symptoms}</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 opacity-60">Eradication Plan</p>
                                                    <p className="text-gray-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{disease.solution}</p>
                                                </div>
                                            </div>

                                            {disease.pesticide && (
                                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800/50 flex items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 text-blue-500">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Recommended Treatment</p>
                                                        <span className="text-[#22C55E] font-black text-xs uppercase tracking-widest">{disease.pesticide}</span>
                                                    </div>
                                                </div>
                                            )}
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     )}
                </div>
            </div>
            
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default CropDetails;
