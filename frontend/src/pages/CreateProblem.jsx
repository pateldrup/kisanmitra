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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-main dark:text-text-inverse mb-2">
          Post a <span className="text-brand-secondary">Problem</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe your farming problem and get help from the community.
        </p>
      </div>

      <Card hoverEffect={false} className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/40 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Problem Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Yellow leaves on tomato plant"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none transition-all text-text-main dark:text-text-inverse placeholder-gray-400"
            />
          </div>

          {/* Crop Type */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Crop Type <span className="text-red-400">*</span>
            </label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              required
              className="w-full appearance-none px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse cursor-pointer"
            >
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your problem in detail. What symptoms are you seeing? When did it start? What treatments have you tried?"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none transition-all text-text-main dark:text-text-inverse placeholder-gray-400 resize-none"
            />
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none transition-all text-text-main dark:text-text-inverse placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Posting...' : 'Post Problem'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
