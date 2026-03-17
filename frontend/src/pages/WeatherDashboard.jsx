import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Icons using Heroicons SVG strings for simplicity
const icons = {
  sun: <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  cloudy: <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
  rain: <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> // Substitute with actual rain icon structure if needed, using clock as placeholder here temporarily
};

const getWeatherIcon = (condition) => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('rain') || c.includes('thunderstorm')) return icons.rain;
    if (c.includes('cloud')) return icons.cloudy;
    return icons.sun;
};

const WeatherDashboard = () => {
    const [locationInput, setLocationInput] = useState('New Delhi');
    const [activeLocation, setActiveLocation] = useState('New Delhi');
    
    const [current, setCurrent] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourly, setHourly] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeatherData = useCallback(async (loc) => {
        setLoading(true);
        setError(null);
        try {
            const [currentRes, forecastRes, hourlyRes] = await Promise.all([
                api.get(`weather/current?location=${loc}`),
                api.get(`weather/forecast?location=${loc}`),
                api.get(`weather/hourly?location=${loc}`)
            ]);

            setCurrent(currentRes.data.data);
            setForecast(forecastRes.data.data);
            setHourly(hourlyRes.data.data);
            setActiveLocation(loc);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWeatherData(activeLocation);
    }, [fetchWeatherData, activeLocation]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (locationInput.trim()) {
            fetchWeatherData(locationInput.trim());
        }
    };

    // Derived logic for Farming Alerts based on Current & Hourly data
    const generateAlerts = () => {
        if (!current) return [];
        const alerts = [];
        
        if (current.rainChance > 70 || current.condition.includes('Rain')) {
            alerts.push({
                type: 'warning',
                title: 'Heavy Rain Expected',
                message: 'Avoid pesticide spraying today. Ensure proper drainage in fields.'
            });
        }
        
        if (current.temperature > 38) {
            alerts.push({
                type: 'danger',
                title: 'Heat Wave Alert',
                message: 'Extremely high temperatures. Increase irrigation frequency to prevent crop stress.'
            });
        } else if (current.temperature < 5) {
            alerts.push({
                type: 'info',
                title: 'Frost Warning',
                message: 'Temperatures dropping significantly. Protect sensitive crops tonight.'
            });
        }

        if (current.windSpeed > 20) {
            alerts.push({
               type: 'warning',
               title: 'High Winds',
               message: 'Strong winds detected. Secure temporary structures and avoid foliar spraying.'
            });
        }

        if (alerts.length === 0) {
            alerts.push({
                type: 'success',
                title: 'Favorable Conditions',
                message: 'Current weather is optimal for general farming activities.'
            });
        }
        
        return alerts;
    };

    const alerts = generateAlerts();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-slate-200 py-10 px-4 md:px-8 lg:px-16 font-sans transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-[#1E293B] p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-700/60 gap-6">
                     <div className="flex items-center gap-4">
                         <div className="bg-[#22C55E]/10 p-4 rounded-2xl shrink-0">
                            <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                         </div>
                         <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">Weather <span className="text-[#22C55E]">Intelligence</span></h1>
                            <p className="mt-1 text-gray-500 dark:text-slate-400 font-medium">Hyper-localized forecasts and farming advisories.</p>
                         </div>
                     </div>
                     <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="District or state..."
                                className="w-full lg:w-72 px-5 py-4 pl-12 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#22C55E]/10 transition-all font-medium"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <button 
                            type="submit"
                            className="bg-[#22C55E] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-95 shrink-0"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Search
                        </button>
                     </form>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-8 rounded-3xl text-center font-bold">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        
                        {/* Left Column: Current & Alerts */}
                        <div className="lg:col-span-1 space-y-8">
                            
                            {/* Current Weather Card */}
                            {current && (
                                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-700/50 text-white relative overflow-hidden transition-all">
                                     {/* Decorative Blur */}
                                     <div className="absolute top-0 right-0 -mr-20 -mt-20 w-56 h-56 bg-[#22C55E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                                     
                                     <div className="relative">
                                         <h2 className="text-xl font-bold text-slate-300 mb-1">{current.location.charAt(0).toUpperCase() + current.location.slice(1)}</h2>
                                         <p className="text-sm font-medium text-slate-400 mb-8">{new Date(current.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                         
                                         <div className="flex items-center justify-between mb-8">
                                             <div className="text-5xl md:text-7xl font-black tracking-tighter">{current.temperature}°<span className="text-2xl md:text-4xl text-[#22C55E] ml-1">C</span></div>
                                             <div className="drop-shadow-[0_10px_10px_rgba(34,197,94,0.3)]">{getWeatherIcon(current.condition)}</div>
                                         </div>
                                         
                                         <div className="text-2xl font-black mb-10 text-[#22C55E] tracking-tight">{current.condition}</div>
                                         
                                         <div className="grid grid-cols-2 gap-3 sm:gap-6 border-t border-slate-700/50 pt-6 mt-auto">
                                             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Humidity</p>
                                                <p className="font-black text-xl flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" /></svg>
                                                    {current.humidity}%
                                                </p>
                                             </div>
                                             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Wind Speed</p>
                                                <p className="font-black text-xl flex items-center">
                                                    <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    {current.windSpeed} <span className="text-xs text-slate-400 ml-1">km/h</span>
                                                </p>
                                             </div>
                                             <div className="col-span-2 pt-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Rain Probability</p>
                                                    <p className="font-black text-[#22C55E]">{current.rainChance}%</p>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-3 mb-1 overflow-hidden">
                                                    <div className="bg-[#22C55E] h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.5)]" style={{ width: `${current.rainChance}%` }}></div>
                                                </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            )}

                            {/* Farming Alerts */}
                            <div className="space-y-4">
                                <h3 className="font-black text-gray-900 dark:text-white flex items-center text-lg ml-2 uppercase tracking-widest text-xs opacity-60">
                                    <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Farming Advisory
                                </h3>
                                <div className="space-y-4">
                                    {alerts.map((alert, idx) => {
                                        let uiConfig = {};
                                        if (alert.type === 'danger') uiConfig = { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-900/30', text: 'text-red-700 dark:text-red-400', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
                                        else if (alert.type === 'warning') uiConfig = { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
                                        else if (alert.type === 'info') uiConfig = { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
                                        else uiConfig = { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-900/30', text: 'text-green-700 dark:text-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };

                                        return (
                                            <div key={idx} className={`p-6 rounded-3xl border ${uiConfig.bg} ${uiConfig.border} transition-all active:scale-[0.98]`}>
                                                <div className="flex items-start">
                                                    <div className={`p-2 rounded-xl bg-white dark:bg-[#0F172A] shadow-sm mr-4 ${uiConfig.text}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={uiConfig.icon} />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-black mb-1 uppercase tracking-tight text-base ${uiConfig.text}`}>{alert.title}</h4>
                                                        <p className={`text-sm font-medium leading-relaxed opacity-80 ${uiConfig.text}`}>{alert.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Charts & Forecasts */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Hourly Chart */}
                            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 transition-all">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">24-Hour <span className="text-[#22C55E]">Trends</span></h3>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <div className="flex items-center">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] mr-2"></span> Temp
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-2.5 h-0.5 bg-blue-500 mr-2"></span> Rain
                                        </div>
                                    </div>
                                </div>
                                <div className="h-64 sm:h-80 w-full mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" dark:stroke="#334155" opacity={0.5} />
                                            <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} fontStyle="bold" tickLine={false} axisLine={false} tickMargin={15} />
                                            <YAxis stroke="#94A3B8" fontSize={10} fontStyle="bold" tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}°`} />
                                            <Tooltip 
                                                cursor={{ stroke: '#22C55E', strokeWidth: 1 }}
                                                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px', padding: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                                                labelStyle={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                                                itemStyle={{ color: '#22C55E', fontWeight: '900', fontSize: '14px' }}
                                                formatter={(value, name) => [name === 'temperature' ? `${value}°C` : `${value}%`, name === 'temperature' ? 'Temp' : 'Rain']}
                                            />
                                            <Area type="monotone" dataKey="temperature" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                                            <Line type="monotone" dataKey="rainChance" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="8 4" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 7-Day Forecast */}
                            <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 px-2">7-Day <span className="text-[#22C55E]">Outlook</span></h3>
                                <div className="flex overflow-x-auto pb-6 -mx-2 px-2 gap-4 snap-x hide-scrollbar scroll-smooth">
                                    {forecast.map((day, idx) => (
                                        <div key={idx} className="flex-none w-[140px] snap-start bg-gray-50 dark:bg-[#0F172A] p-6 rounded-3xl border border-gray-100 dark:border-slate-800/50 flex flex-col items-center hover:border-[#22C55E] transition-all duration-300 group cursor-pointer active:scale-95 shadow-sm hover:shadow-lg hover:shadow-black/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-3 py-1 bg-gray-200/50 dark:bg-slate-800 rounded-full group-hover:bg-[#22C55E]/10 group-hover:text-[#22C55E] transition-colors">{idx === 0 ? 'Today' : day.day}</span>
                                            <div className="transform group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-500 drop-shadow-md">
                                                {getWeatherIcon(day.condition)}
                                            </div>
                                            <span className="text-3xl font-black text-gray-900 dark:text-white mt-6 mb-1 tracking-tighter">{day.temperature}°</span>
                                            <div className="flex items-center text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 whitespace-nowrap">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6z" clipRule="evenodd" /></svg>
                                                {day.rainChance}% Rain
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-2 lg:hidden">
                                     <div className="flex gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-full">
                                         {[...Array(3)].map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i===0 ? 'bg-[#22C55E]' : 'bg-gray-300 dark:bg-slate-600'}`}></div>)}
                                     </div>
                                </div>
                                <style dangerouslySetInnerHTML={{__html: `
                                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                                `}} />
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;
