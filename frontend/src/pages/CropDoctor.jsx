import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  CloudArrowUpIcon, 
  BeakerIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CropDoctor = () => {
    const { user } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosis, setDiagnosis] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('diagnose'); // 'diagnose' or 'history'
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && activeTab === 'history') {
            fetchHistory();
        }
    }, [user, activeTab]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('crop-doctor/history');
            if (res.data.success) {
                setHistory(Array.isArray(res.data.data) ? res.data.data : []);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setDiagnosis(null);
            setError(null);
        }
    };

    const handleDiagnose = async () => {
        if (!selectedImage) {
            setError('Please upload an image first.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        // Simulate a delay for "AI Analysis"
        await new Promise(resolve => setTimeout(resolve, 2500));

        try {
            // Since we don't have a real image storage service here, 
            // we'll send the previewUrl as a placeholder.
            // In a real app, this would be a FormData upload.
            const res = await api.post('crop-doctor/diagnose', {
                cropName: '', // Let the backend guess or provide a dropdown
                imageUrl: previewUrl 
            });

            if (res.data.success) {
                setDiagnosis(res.data.data);
                if (user) fetchHistory();
            }
        } catch (err) {
            console.error('Diagnosis failed:', err);
            setError('Something went wrong during analysis. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-slate-200 py-10 px-4 md:px-8 lg:px-16 font-sans transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#22C55E]/10 p-4 rounded-2xl shrink-0">
                            <BeakerIcon className="w-8 h-8 text-[#22C55E]" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">Crop <span className="text-[#22C55E]">Doctor</span></h1>
                            <p className="mt-1 text-gray-500 dark:text-slate-400 font-medium">Detect crop diseases in seconds using advanced AI.</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-gray-100 dark:bg-[#0F172A] p-1.5 rounded-2xl w-full lg:w-auto">
                        <button 
                            onClick={() => setActiveTab('diagnose')}
                            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'diagnose' ? 'bg-white dark:bg-[#1E293B] text-[#22C55E] shadow-lg shadow-black/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
                        >
                            Diagnose
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-white dark:bg-[#1E293B] text-[#22C55E] shadow-lg shadow-black/5' : 'text-gray-500 hover:text-gray-700 dark:hover:text-slate-300'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                {activeTab === 'diagnose' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Upload Section */}
                        <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 overflow-hidden relative group">
                             {/* AI Grid Background */}
                             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
                                <svg width="100%" height="100%">
                                    <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="currentColor" strokeWidth="1" fill="none" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#pattern)" />
                                </svg>
                             </div>

                             <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight">Diagnostic <span className="text-[#22C55E]">Center</span></h2>
                             
                             <div 
                                className={`relative border-2 border-dashed rounded-[2rem] p-6 md:p-10 transition-all duration-300 flex flex-col items-center justify-center text-center group/uploader ${
                                    previewUrl ? 'border-transparent bg-gray-50 dark:bg-[#0F172A]' : 'border-gray-200 dark:border-slate-700 hover:border-[#22C55E] dark:hover:border-[#22C55E] bg-gray-50/50 dark:bg-slate-900/50'
                                }`}
                             >
                                 {previewUrl ? (
                                     <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                         <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/uploader:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button 
                                                onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                                                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                         </div>
                                     </div>
                                 ) : (
                                     <label className="cursor-pointer w-full py-10 flex flex-col items-center">
                                         <div className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-6 group-hover/uploader:scale-110 group-hover/uploader:bg-[#22C55E]/20 transition-all">
                                            <CloudArrowUpIcon className="w-12 h-12 text-[#22C55E] animate-bounce" />
                                         </div>
                                         <p className="text-xl font-black text-gray-900 dark:text-white mb-2">Capture or Upload Image</p>
                                         <p className="text-sm font-medium text-gray-400">PNG, JPG or JPEG • Max 5MB</p>
                                         <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                     </label>
                                 )}
                             </div>

                             {error && (
                                 <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl flex items-center">
                                     <ExclamationTriangleIcon className="w-5 h-5 mr-3 shrink-0" />
                                     {error}
                                 </div>
                             )}

                             <button 
                                onClick={handleDiagnose}
                                disabled={!selectedImage || isAnalyzing}
                                className={`w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center shadow-xl active:scale-[0.98] ${
                                    !selectedImage || isAnalyzing 
                                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed' 
                                    : 'bg-[#22C55E] hover:bg-green-600 text-white shadow-green-500/20'
                                }`}
                             >
                                 {isAnalyzing ? (
                                     <div className="flex items-center gap-3">
                                         <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                         AI Scanning...
                                     </div>
                                 ) : (
                                     'Run AI Diagnostics'
                                 )}
                             </button>
                        </div>

                        {/* Result Section */}
                        <div className="space-y-8">
                            {!diagnosis && !isAnalyzing && (
                                <div className="bg-white dark:bg-[#1E293B] p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-[#0F172A] rounded-full flex items-center justify-center shadow-inner">
                                        <InformationCircleIcon className="w-12 h-12 text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter">Awaiting Scan</h3>
                                        <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2">Upload an image to identify diseases and get organic treatments.</p>
                                    </div>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="bg-white dark:bg-[#1E293B] p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="w-40 h-40 relative flex items-center justify-center">
                                         <div className="absolute inset-0 bg-[#22C55E]/10 rounded-full animate-ping"></div>
                                         <div className="absolute inset-4 bg-[#22C55E]/10 rounded-full animate-pulse delay-75"></div>
                                         <div className="absolute inset-8 bg-[#22C55E]/20 rounded-full animate-bounce"></div>
                                         <BeakerIcon className="w-16 h-16 text-[#22C55E] relative z-10" />
                                    </div>
                                    <div className="w-full max-w-sm space-y-4">
                                        <h3 className="text-2xl font-black tracking-tighter uppercase">AI Pattern <span className="text-[#22C55E]">Analysis</span></h3>
                                        <div className="w-full bg-gray-100 dark:bg-[#0F172A] rounded-full h-4 relative overflow-hidden">
                                            <div className="bg-[#22C55E] h-full rounded-full animate-ai-progress"></div>
                                        </div>
                                        <p className="text-sm font-black text-[#22C55E] uppercase tracking-widest animate-pulse">Scanning 300+ Plant Pathogens...</p>
                                    </div>
                                </div>
                            )}

                            {diagnosis && (
                                <div className="animate-fade-in space-y-6">
                                    {/* Main Result Card */}
                                    <div className="bg-white dark:bg-[#1E293B] p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-l-[12px] border-[#22C55E] dark:border-l-[#22C55E] border-gray-100 dark:border-slate-800">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                                            <div>
                                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{diagnosis.diseaseName}</h3>
                                                <p className="text-[#22C55E] font-black uppercase tracking-widest text-xs mt-1">{diagnosis.cropName} Crop Diagnostic</p>
                                            </div>
                                            <div className="bg-[#22C55E] text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 shrink-0">
                                                {diagnosis.confidence}% Confidence
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-black flex items-center text-gray-400 uppercase tracking-widest text-xs">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Key Symptoms
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {(Array.isArray(diagnosis.symptoms) ? diagnosis.symptoms : []).map((s, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                                        <div className="w-2 h-2 bg-[#22C55E] rounded-full shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                        <span className="text-sm font-bold text-gray-600 dark:text-slate-300">{s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Treatment & Pesticide */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-[#1E293B] p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800">
                                            <h4 className="font-black text-[#22C55E] mb-4 flex items-center uppercase tracking-widest text-xs">
                                                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                                Recommended Treatment
                                            </h4>
                                            <p className="text-sm font-medium dark:text-slate-300 leading-relaxed opacity-90">{diagnosis.treatment}</p>
                                        </div>
                                        <div className="bg-[#1E293B] dark:bg-[#0F172A] p-8 rounded-[2.5rem] shadow-xl border border-slate-700/50">
                                            <h4 className="font-black text-blue-400 mb-4 flex items-center uppercase tracking-widest text-xs">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 001.022.547l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022l-1.428-1.428z" /></svg>
                                                Pesticide / Chemicals
                                            </h4>
                                            <p className="font-black text-2xl text-white tracking-tight">{diagnosis.pesticide}</p>
                                            <p className="text-xs text-slate-500 mt-4 italic">Note: Use organic alternatives when possible.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* History View - Enhanced Mobile Cards */
                    <div className="space-y-6">
                        {!user ? (
                            <div className="bg-white dark:bg-[#1E293B] py-20 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 text-center">
                                <ClockIcon className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Login Required</h3>
                                <p className="text-gray-400 font-medium">Please sign in to save your diagnostic history.</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="bg-white dark:bg-[#1E293B] py-20 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 text-center">
                                <ClockIcon className="w-16 h-16 mx-auto mb-6 text-gray-200" />
                                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">No History</h3>
                                <p className="text-gray-400 font-medium">Your diagnostic reports will appear here automatically.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(Array.isArray(history) ? history : []).map((item) => (
                                    <div key={item._id} className="bg-white dark:bg-[#1E293B] p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800 hover:border-[#22C55E]/30 transition-all group flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-gray-100 dark:bg-[#0F172A] px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                                {new Date(item.date).toLocaleDateString()}
                                            </div>
                                            <div className="bg-[#22C55E]/10 text-[#22C55E] px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {item.confidence}% Match
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                                                <img src={item.imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-gray-900 dark:text-white leading-tight">{item.diseaseName}</h4>
                                                <p className="text-sm font-bold text-[#22C55E] uppercase tracking-widest text-[10px]">{item.cropName}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { setDiagnosis(item); setActiveTab('diagnose'); setPreviewUrl(item.imageUrl); }}
                                            className="mt-auto w-full py-4 bg-gray-50 dark:bg-white/5 hover:bg-[#22C55E] dark:hover:bg-[#22C55E] text-gray-600 dark:text-white hover:text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            View Report
                                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes ai-progress {
                    0% { width: 0; }
                    50% { width: 70%; }
                    100% { width: 95%; }
                }
                .animate-ai-progress { animation: ai-progress 2s cubic-bezier(0.1, 0, 0.45, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.6s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
                .animate-blob { animation: blob 7s infinite alternate; }
            `}} />
        </div>
    );
};

export default CropDoctor;
