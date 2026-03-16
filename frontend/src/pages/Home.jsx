import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 md:p-12 text-center transition-all duration-300 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#22C55E]/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10 delay-1000"></div>

      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in relative">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-slate-800 shadow-xl shadow-black/5 mb-4 group hover:scale-105 transition-transform cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E] mr-3 animate-ping"></span>
            <span className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-[0.2em]">Next-Gen Farming Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-main dark:text-white tracking-tighter leading-[0.9] mb-6">
          Cultivating <span className="text-[#22C55E] relative italic">Success
             <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#22C55E]/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5 L 100 10 L 0 10 Z" fill="currentColor"/></svg>
          </span> <br className="hidden md:block"/> with Every Click.
        </h1>

        <p className="text-lg md:text-2xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering modern agriculture with AI-driven insights, community wisdom, and real-time market data. Join the revolution in smart farming.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full px-10 py-5 bg-[#22C55E] hover:bg-green-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-green-500/30 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
              Get Started
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full px-10 py-5 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-slate-800 text-text-main dark:text-white font-black text-lg rounded-2xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
              Login Account
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-20 border-t border-gray-100 dark:border-slate-800/50">
             {[
                {label: 'Modules', value: '4+'},
                {label: 'Accuracy', value: '98%'},
                {label: 'Support', value: '24/7'},
                {label: 'Insights', value: 'Live'}
             ].map((stat, i) => (
                <div key={i} className="text-center">
                    <p className="text-2xl md:text-4xl font-black text-text-main dark:text-white mb-1 uppercase tracking-tighter">{stat.value}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
