import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import cropService from '../services/cropService';

const CropDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [guideData, setGuideData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCropDetails = async () => {
             try {
                const response = await cropService.getCropById(id);
                setData(response);
                
                // Fetch the new detailed guide data
                if (response?.crop?.name) {
                    try {
                        const guideResponse = await cropService.getCropGuideByName(response.crop.name);
                        setGuideData(guideResponse);
                    } catch (err) {
                        console.log('No guide data found for this crop');
                    }
                }
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

    const { crop } = data;
    
    // Derived values from guide data or fallback to crop basic data
    const overviewText = guideData?.overview || crop.description;
    const seasonText = guideData?.season || crop.season;
    const tempText = guideData?.temperature || crop.temperatureRange;
    const soilText = guideData?.soilType || crop.soilType;
    const waterText = guideData?.waterRequirement || crop.waterRequirement;
    const durationText = guideData?.growthDuration || crop.growthDuration;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-slate-200 py-10 px-4 md:px-8 lg:px-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
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
                        <div className="absolute top-6 left-6 bg-[#22C55E] text-white px-5 py-2 rounded-2xl text-[10px] font-black shadow-xl shadow-green-500/20 uppercase tracking-widest flex items-center gap-2">
                            <span>🌱</span> {seasonText} Season
                        </div>
                     </div>
                     <div className="p-8 md:p-12 lg:p-16 md:w-3/5 lg:w-2/3 flex flex-col">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-main dark:text-white mb-6 tracking-tighter leading-none">{crop.name}</h1>
                        <p className="text-gray-500 dark:text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-medium max-w-2xl">
                            {overviewText}
                        </p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                              {[
                                {label: 'Water', value: waterText, color: 'blue', icon: '💧'},
                                {label: 'Temp', value: tempText, color: 'yellow', icon: '🌡'},
                                {label: 'Soil', value: soilText, color: 'amber', icon: '🌱'},
                                {label: 'Days', value: durationText, color: 'green', icon: '⏱'}
                              ].map((stat, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-[#0F172A] p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-all hover:scale-105 group">
                                    <span className={`text-4xl mb-3 transform transition-transform group-hover:scale-125`}>{stat.icon}</span>
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
                        {id: 'overview', label: 'Overview & Tips', icon: '💡'},
                        {id: 'fertilizers', label: 'Nutrition Plan', icon: '🧪'},
                        {id: 'diseases', label: 'Disease Control', icon: '🦠'}
                     ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#22C55E] text-white shadow-xl shadow-green-500/20 active:scale-95' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#0F172A]'}`}
                        >
                            <span className="text-xl">{tab.icon}</span> {tab.label}
                        </button>
                     ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 min-h-[500px]">
                     
                     {/* OVERVIEW & TIPS TAB */}
                     {activeTab === 'overview' && (
                         <div className="space-y-12 animate-fadeIn">
                             <div>
                                 <h3 className="text-3xl font-black text-text-main dark:text-white mb-8 flex items-center tracking-tight uppercase">
                                     <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mr-4 text-2xl">
                                        💡
                                     </div>
                                     Farming Tips
                                 </h3>
                                 {guideData?.tips?.length > 0 ? (
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {guideData.tips.map((tip, index) => (
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
                         </div>
                     )}

                     {/* NUTRITION PLAN TAB */}
                     {activeTab === 'fertilizers' && (
                         <div className="animate-fadeIn">
                             <h3 className="text-3xl font-black text-text-main dark:text-white mb-10 tracking-tight uppercase flex items-center">
                                 <span className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mr-4 text-2xl">🧪</span>
                                 Nutrition Base Plan
                             </h3>
                             
                             {!guideData?.nutritionPlan ? (
                                 <div className="text-center py-20 bg-gray-50 dark:bg-[#0F172A] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                     No nutrition data available yet.
                                 </div>
                             ) : (
                                 <div className="space-y-10">
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                         {guideData.nutritionPlan.fertilizers.map((fert, idx) => (
                                             <div key={idx} className="bg-[#0F172A] border border-slate-700 rounded-3xl p-8 flex flex-col justify-between items-center text-center hover:scale-[1.02] transition-all shadow-xl shadow-green-900/10">
                                                 <h4 className="text-2xl font-black text-[#22C55E] mb-4 uppercase tracking-tight">{fert.name}</h4>
                                                 <div className="bg-[#1E293B] px-8 py-4 rounded-[2rem] border border-slate-700 shadow-inner">
                                                     <span className="text-white font-black text-2xl">{fert.amount}</span>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>

                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                                            <h4 className="text-xl font-black text-gray-800 dark:text-slate-200 mb-6 uppercase tracking-widest border-b border-gray-200 dark:border-slate-700 pb-4">Application Stages</h4>
                                            <ul className="space-y-4">
                                                {guideData.nutritionPlan.applicationStages.map((stage, i) => (
                                                    <li key={i} className="flex items-center text-gray-700 dark:text-slate-300 font-medium">
                                                        <span className="w-2 h-2 rounded-full bg-[#22C55E] mr-4 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                                                        {stage}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-[#f0fdf4] dark:bg-green-900/10 p-8 rounded-[2.5rem] border border-green-100 dark:border-green-900/30">
                                            <h4 className="text-xl font-black text-green-700 dark:text-green-400 mb-6 uppercase tracking-widest border-b border-green-200 dark:border-green-900/50 pb-4">Organic Options</h4>
                                            <ul className="space-y-4">
                                                {guideData.nutritionPlan.organicOptions.map((opt, i) => (
                                                    <li key={i} className="flex items-center text-green-800 dark:text-green-300 font-medium">
                                                        <span className="mr-3 text-lg">🌿</span>
                                                        {opt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                     </div>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* DISEASES TAB */}
                     {activeTab === 'diseases' && (
                         <div className="animate-fadeIn">
                             <h3 className="text-3xl font-black text-text-main dark:text-white mb-10 tracking-tight uppercase flex items-center">
                                 <span className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center mr-4 text-2xl">🦠</span>
                                 Common Diseases
                             </h3>
                             
                             {!guideData?.diseases?.length ? (
                                 <div className="text-center py-20 bg-gray-50 dark:bg-[#0F172A] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">
                                     No disease records found yet.
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                     {guideData.diseases.map((disease, idx) => (
                                         <div key={idx} className="bg-gray-50 dark:bg-[#0F172A] rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 relative overflow-hidden group hover:border-red-500/30 transition-all shadow-lg hover:shadow-red-500/5">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[5rem] transition-all group-hover:bg-red-500/10 group-hover:scale-110 flex items-start justify-end p-6 text-4xl opacity-50">
                                                🦠
                                            </div>
                                            <h4 className="text-2xl font-black text-red-600 dark:text-red-400 mb-6 uppercase tracking-tight">{disease.diseaseName}</h4>
                                            
                                            <div className="space-y-6 relative z-10">
                                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span>🔍</span> Symptoms</p>
                                                    <p className="text-gray-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{disease.symptoms}</p>
                                                </div>
                                                
                                                <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><span>🛡️</span> Control Method</p>
                                                    <p className="text-gray-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{disease.control}</p>
                                                </div>
                                            </div>

                                            {disease.pesticide && (
                                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mr-4 text-blue-600 dark:text-blue-400 text-xl">
                                                            🧪
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mb-2">Recommended Treatment</p>
                                                            <span className="text-blue-700 dark:text-blue-300 font-extrabold text-sm uppercase tracking-wider">{disease.pesticide}</span>
                                                        </div>
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
