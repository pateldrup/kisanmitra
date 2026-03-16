import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { CalendarIcon, MapPinIcon, UserIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [solutionText, setSolutionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [probRes, solRes] = await Promise.all([
        api.get(`/problems/${id}`),
        api.get(`/solutions/${id}`)
      ]);
      setProblem(probRes.data);
      setSolutions(solRes.data);
    } catch {
      setError('Problem not found or has been removed.');
    } finally {
      setLoadingProblem(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]); // eslint-disable-line

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete problem.');
    }
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/solutions', { solutionText, problemId: id });
      setSolutions(prev => [...prev, data]);
      setSolutionText('');
    } catch {
      setError('Failed to post solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const imageUrl = problem?.image || 'https://images.unsplash.com/photo-1592982537447-6f2ecdd2fcc5?w=800&q=80';

  if (loadingProblem) return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    </div>
  );

  if (error && !problem) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg mb-6">{error}</p>
      <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
    </div>
  );

  const isOwner = user && problem?.createdBy?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto space-y-10 px-4 md:px-8 transition-all duration-300 pb-20">
      {/* Back Link */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22C55E] font-black uppercase tracking-widest text-xs transition-colors group">
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Community
      </Link>

      {/* Problem Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img src={imageUrl} alt={problem?.cropType} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 md:left-10">
            <span className="bg-[#22C55E] text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-green-500/20 uppercase tracking-widest">
              {problem?.cropType} Issue
            </span>
          </div>
          {isOwner && (
            <div className="absolute top-6 right-6 flex gap-3">
              <Link to={`/edit-problem/${id}`}>
                <button className="p-4 rounded-2xl bg-white/95 hover:bg-white text-gray-700 shadow-xl backdrop-blur-sm transition-all active:scale-95 group/edit">
                  <PencilIcon className="w-5 h-5 group-hover/edit:text-[#22C55E] transition-colors" />
                </button>
              </Link>
              <button 
                onClick={handleDelete} 
                className="p-4 rounded-2xl bg-white/95 hover:bg-red-50 text-red-500 shadow-xl backdrop-blur-sm transition-all active:scale-95 group/trash"
              >
                <TrashIcon className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>

        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-main dark:text-text-inverse mb-6 tracking-tight leading-tight">
            {problem?.title}
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 font-medium">
            {problem?.description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-50 dark:border-slate-800/50">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center group-hover:bg-[#22C55E]/10 transition-colors">
                <UserIcon className="w-5 h-5 text-gray-400 group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Posted By</span>
                <span className="font-bold text-gray-700 dark:text-slate-200 leading-none">{problem?.createdBy?.name || 'Local Farmer'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center group-hover:bg-[#22C55E]/10 transition-colors">
                <MapPinIcon className="w-5 h-5 text-gray-400 group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Location</span>
                <span className="font-bold text-gray-700 dark:text-slate-200 leading-none">{problem?.createdBy?.location || 'Gujarat, India'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center group-hover:bg-[#22C55E]/10 transition-colors">
                <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-[#22C55E] transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Posted On</span>
                <span className="font-bold text-gray-700 dark:text-slate-200 leading-none">{new Date(problem?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-text-main dark:text-text-inverse uppercase tracking-tight">
                {solutions.length} community <span className="text-[#22C55E]">Expertises</span>
            </h2>
        </div>

        {solutions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-[#1E293B]/30 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-widest text-sm">
            No solutions yet. Be the first to help!
          </div>
        ) : (
          <div className="space-y-6">
            {solutions.map(sol => (
              <div key={sol._id} className="bg-white dark:bg-[#1E293B] p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 dark:border-slate-800 transition-all hover:scale-[1.01]">
                <p className="text-text-main dark:text-slate-200 text-lg leading-relaxed mb-6 font-medium font-sans">
                    {sol.solutionText}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] font-black text-xs uppercase shadow-inner">
                        {sol.postedBy?.name?.charAt(0) || 'F'}
                    </div>
                    <span className="font-black text-sm text-gray-700 dark:text-slate-200">{sol.postedBy?.name || 'Local Expert'}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{new Date(sol.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Solution Form */}
      {user ? (
        <div className="bg-white dark:bg-[#1E293B] p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 group">
          <h3 className="text-2xl font-black text-text-main dark:text-text-inverse mb-8 uppercase tracking-tighter">
            Share <span className="text-[#22C55E]">Wisdom</span>
          </h3>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold">{error}</div>}
          <form onSubmit={handleSolutionSubmit} className="space-y-6">
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={5}
              placeholder="Provide symptoms, organic treatments, or professional advice to help this farmer..."
              required
              className="w-full px-8 py-6 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-text-inverse font-medium placeholder-gray-400 resize-none leading-relaxed shadow-inner"
            />
            <button 
                type="submit" 
                disabled={submitting}
                className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#22C55E] hover:bg-green-600 text-white font-black text-lg transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              {submitting ? 'Posting...' : 'Post Expert Opinion'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-100/50 dark:bg-[#1E293B]/50 p-10 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-gray-500 font-bold mb-6 text-lg uppercase tracking-tight">Log in to help your community</p>
          <Link to="/login">
            <button className="px-12 py-5 rounded-2xl bg-[#22C55E] text-white font-black text-lg shadow-xl shadow-green-500/20 active:scale-95">
                Join the Discussion
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
