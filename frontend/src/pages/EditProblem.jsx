import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const CROP_TYPES = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 'Other'];

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', cropType: 'Wheat', image: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/problems/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          cropType: data.cropType,
          image: data.image || ''
        });
      } catch {
        setError('Failed to load problem. It may not exist or you may not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/problems/${id}`, formData);
      navigate(`/problem/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-main dark:text-text-inverse mb-2">
          Edit <span className="text-brand-secondary">Problem</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Update the details of your farming problem.</p>
      </div>

      <Card hoverEffect={false} className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/40 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Problem Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary outline-none transition-all text-text-main dark:text-text-inverse"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">Crop Type</label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full appearance-none px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse cursor-pointer"
            >
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-text-inverse mb-2">
              Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link to={`/problem/${id}`} className="flex-1">
              <Button type="button" variant="secondary" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
