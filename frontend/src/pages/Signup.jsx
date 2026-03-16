import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password.length < 6) {
        return setError("Password must be at least 6 characters.");
    }
    setError(null);
    setLoading(true);
    
    try {
      await signup(formData.name, formData.email, formData.password, formData.location);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 transition-all duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-[#1E293B] p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 dark:border-slate-800 animate-fade-in relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#22C55E]/5 rounded-bl-[6rem] -mr-20 -mt-20 transition-all group-hover:scale-110"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-text-main dark:text-white mb-2 tracking-tighter uppercase">Join Our <span className="text-[#22C55E]">Community</span></h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Empowering farmers with AI intelligence</p>
        </div>
        
        {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-black rounded-2xl flex items-center uppercase tracking-wider">
                <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-white font-bold placeholder-gray-400 shadow-inner"
                    required
                    placeholder="Ramesh Kumar"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-white font-bold placeholder-gray-400 shadow-inner"
                    required
                    placeholder="ramesh@gmail.com"
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-white font-bold placeholder-gray-400 shadow-inner"
              required
              placeholder="••••••••"
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-2 opacity-60">Minimum 6 characters required</p>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-[#22C55E]/10 outline-none transition-all text-text-main dark:text-white font-bold placeholder-gray-400 shadow-inner"
              placeholder="e.g. Anand, Gujarat"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-xl shadow-green-500/20 transition-all uppercase tracking-widest active:scale-95 mt-4 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#22C55E] hover:bg-green-600'}`}
          >
            {loading ? 'Creating Account...' : 'Register as Farmer'}
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-gray-50 dark:border-slate-800/50 text-center">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">
                Already part of KisanMitra? <br/>
                <Link to="/login" className="text-[#22C55E] hover:underline decoration-2 underline-offset-4">Sign in to Account</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
