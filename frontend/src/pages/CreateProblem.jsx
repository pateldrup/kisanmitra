import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const CROP_TYPES = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other'];

export default function CreateProblem() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', description: '', cropType: 'Wheat', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/problems', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 transition-all duration-300 pb-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-main dark:text-text-inverse leading-tight">
          Post a <span className="text-[#22C55E]">Problem</span>
        </h1>
        <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium">
          Describe your farming issue and let the community help you find a solution.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E293B] p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800">
        {error && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl flex items-center">
            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-text-main dark:text-text-inverse uppercase tracking-widest opacity-60 ml-1">
              Problem Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Yellowing of young wheat leaves"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#22C55E] outline-none transition-all text-text-main dark:text-text-inverse font-bold placeholder-gray-400"
            />
          </div>

          {/* Crop Type */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-text-main dark:text-text-inverse uppercase tracking-widest opacity-60 ml-1">
              Affected Crop <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                required
                className="w-full appearance-none px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-text-inverse font-bold cursor-pointer"
              >
                {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-text-main dark:text-text-inverse uppercase tracking-widest opacity-60 ml-1">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe symptoms, when it started, and any interventions tried..."
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#22C55E] outline-none transition-all text-text-main dark:text-text-inverse font-medium placeholder-gray-400 resize-none leading-relaxed"
            />
          </div>

          {/* Image URL (optional) */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-text-main dark:text-text-inverse uppercase tracking-widest opacity-60 ml-1">
              Image Reference URL <span className="text-gray-400 font-normal normal-case italic">(optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/leaf-photo.jpg"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 focus:border-[#22C55E] outline-none transition-all text-text-main dark:text-text-inverse font-bold placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              disabled={loading} 
              className={`flex-1 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-[0.98] ${loading ? 'bg-gray-100 text-gray-400' : 'bg-[#22C55E] hover:bg-green-600 text-white shadow-green-500/20'}`}
            >
              {loading ? 'Posting...' : 'Share Problem'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="flex-1 py-5 rounded-2xl bg-gray-100 dark:bg-[#0F172A] hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 font-black text-lg transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
