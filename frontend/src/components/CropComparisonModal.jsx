import React, { useState, useEffect } from 'react';
import cropService from '../services/cropService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ROWS = [
  { label: 'Season', key: 'season', render: (v) => <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-xs font-bold">{v}</span> },
  { label: 'Growth Duration', key: 'growthDuration' },
  { label: 'Water Requirement', key: 'waterRequirement' },
  { label: 'Soil Type', key: 'soilType' },
  { label: 'Temperature', key: 'temperatureRange' },
  { label: 'Expected Yield', key: 'expectedYield', render: (v) => <span className="font-black text-[#22C55E]">{v || 'N/A'}</span> },
];

const CropComparisonModal = ({ crop1Id, crop2Id, onClose }) => {
  const [crop1, setCrop1] = useState(null);
  const [crop2, setCrop2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const data = await cropService.compareCrops(crop1Id, crop2Id);
        setCrop1(data.crop1);
        setCrop2(data.crop2);
      } catch (err) {
        setError('Failed to fetch crop comparison data.');
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [crop1Id, crop2Id]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1E293B] w-full sm:rounded-3xl sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col sm:border sm:border-gray-100 dark:border-slate-700 rounded-t-3xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1E293B] flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-slate-700 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#22C55E]/10 p-2.5 rounded-xl">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">Crop Comparison</h2>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors active:scale-90">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-16 font-bold">{error}</div>
          ) : (
            <div className="p-4 sm:p-6">
              {/* Crop Headers (Mobile Card Layout & Desktop) */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[crop1, crop2].map((crop, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-slate-800">
                    <img src={crop.image} alt={crop.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-lg mb-3" />
                    <span className="text-sm sm:text-lg font-black text-gray-900 dark:text-white leading-tight">{crop.name}</span>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="space-y-2">
                {ROWS.map((row, idx) => (
                  <div key={idx} className={`rounded-2xl p-4 ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-[#0F172A]' : 'bg-white dark:bg-[#1E293B]'} border border-gray-100 dark:border-slate-800/50`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{row.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[crop1, crop2].map((crop, i) => (
                        <div key={i} className="text-sm font-bold text-gray-900 dark:text-white">
                          {row.render ? row.render(crop[row.key]) : (crop[row.key] || <span className="text-gray-400 font-normal text-xs italic">N/A</span>)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-slate-700 shrink-0">
          <button onClick={onClose} className="w-full py-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-black text-sm rounded-2xl transition-all active:scale-[0.98] uppercase tracking-widest">
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropComparisonModal;
