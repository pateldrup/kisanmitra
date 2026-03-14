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
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Problem Card */}
      <Card hoverEffect={false} className="overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <img src={imageUrl} alt={problem?.cropType} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="bg-brand-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {problem?.cropType}
            </span>
          </div>
          {isOwner && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Link to={`/edit-problem/${id}`}>
                <button className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </Link>
              <button onClick={handleDelete} className="p-2 rounded-full bg-white/90 hover:bg-red-50 text-red-500 shadow-sm transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-text-main dark:text-text-inverse mb-4">
            {problem?.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {problem?.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-brand-secondary" />
              <span>{problem?.createdBy?.name || 'Local Farmer'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-brand-secondary" />
              <span>{problem?.createdBy?.location || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-brand-secondary" />
              <span>{new Date(problem?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Solutions Section */}
      <div>
        <h2 className="text-xl font-heading font-bold text-text-main dark:text-text-inverse mb-4">
          {solutions.length} {solutions.length === 1 ? 'Solution' : 'Solutions'}
        </h2>

        {solutions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
            No solutions yet. Be the first to help!
          </div>
        ) : (
          <div className="space-y-4">
            {solutions.map(sol => (
              <Card key={sol._id} hoverEffect={false} className="p-5">
                <p className="text-text-main dark:text-text-inverse leading-relaxed mb-3">{sol.solutionText}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-brand-secondary">{sol.postedBy?.name || 'Farmer'}</span>
                  <span>•</span>
                  <span>{new Date(sol.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Post Solution Form */}
      {user ? (
        <Card hoverEffect={false} className="p-6">
          <h3 className="text-lg font-heading font-semibold text-text-main dark:text-text-inverse mb-4">
            Post Your Solution
          </h3>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <form onSubmit={handleSolutionSubmit} className="space-y-4">
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={4}
              placeholder="Share your knowledge or experience to help this farmer..."
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-secondary/50 outline-none transition-all text-text-main dark:text-text-inverse placeholder-gray-400 resize-none"
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Solution'}
            </Button>
          </form>
        </Card>
      ) : (
        <Card hoverEffect={false} className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Log in to post a solution and help fellow farmers.</p>
          <Link to="/login"><Button>Login to Help</Button></Link>
        </Card>
      )}

      <Link to="/dashboard" className="inline-block">
        <Button variant="ghost">← Back to Dashboard</Button>
      </Link>
    </div>
  );
}
