import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const PAGE_INFO = {
  '/crop-guide':    { icon: '📖', title: 'Crop Guide',     desc: 'Get expert guidance on growing different crops, best practices, soil requirements, and seasonal tips.' },
  '/mandi-prices':  { icon: '💰', title: 'Mandi Prices',   desc: 'Live market prices for your crops from mandis across the country, updated daily.' },
  '/weather':       { icon: '⛅', title: 'Weather',         desc: 'Hyperlocal weather forecasts tailored for farmers — rain, humidity, wind speed and more.' },
  '/crop-doctor':   { icon: '🩺', title: 'Crop Doctor',    desc: 'AI-powered crop disease detection. Upload a photo of your crop and get instant diagnosis.' },
  '/create-problem':{ icon: '📝', title: 'Post a Problem', desc: 'Post your farming problems and get solutions from experts and fellow farmers in the community.' },
};

export default function ComingSoon() {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] || { icon: '🚧', title: 'Coming Soon', desc: 'This feature is under development and will be available soon.' };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4 animate-fade-in transition-all duration-300">
      <div className="max-w-xl w-full mx-auto text-center p-10 md:p-16 bg-white dark:bg-[#1E293B] rounded-[3rem] shadow-2xl shadow-black/5 border-2 border-dashed border-gray-100 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-bl-[4rem] transition-all group-hover:scale-110"></div>
        
        <span className="text-7xl md:text-8xl mb-8 block transform group-hover:rotate-12 transition-transform duration-500">{info.icon}</span>
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          🚧 Engineering in Progress
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-white mb-6 tracking-tighter uppercase leading-none">
          {info.title}
        </h1>
        
        <p className="text-gray-500 dark:text-slate-400 mb-10 leading-relaxed font-medium text-sm md:text-base">
          {info.desc}
        </p>
        
        <Link to="/dashboard">
           <button className="px-8 py-4 bg-gray-50 dark:bg-[#0F172A] hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-gray-100 dark:border-slate-800 shadow-xl shadow-black/5">
                ← Return to Hub
           </button>
        </Link>
      </div>
    </div>
  );
}
