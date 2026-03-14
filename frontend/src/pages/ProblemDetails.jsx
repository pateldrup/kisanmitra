import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solutionText, setSolutionText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblemDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      const [probRes, solRes] = await Promise.all([
        api.get(`/problems/${id}`),
        api.get(`/solutions/${id}`)
      ]);
      setProblem(probRes.data);
      setSolutions(solRes.data);
    } catch (err) {
      setError('Failed to fetch problem details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;
    
    setPosting(true);
    try {
      const { data } = await api.post('/solutions', {
        solutionText,
        problemId: id
      });
      setSolutions([...solutions, data]);
      setSolutionText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post solution');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await api.delete(`/problems/${id}`);
        navigate('/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete problem');
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading problem...</div>;
  if (error || !problem) return <div className="text-center py-20 text-red-500 font-bold">{error || 'Problem not found'}</div>;

  const isOwner = user && user._id === problem.createdBy?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Problem Section */}
      <div className="card-bg p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
              {problem.cropType}
            </span>
            <h1 className="text-3xl font-bold">{problem.title}</h1>
          </div>
          
          {isOwner && (
            <div className="flex items-start gap-2">
              <Link to={`/edit-problem/${problem._id}`} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition">
                Edit
              </Link>
              <button onClick={handleDelete} className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 transition">
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <span>Posted by: <span className="font-semibold">{problem.createdBy?.name || 'Unknown'}</span></span>
          {problem.createdBy?.location && <span>📍 {problem.createdBy.location}</span>}
          <span>📅 {new Date(problem.createdAt).toLocaleString()}</span>
        </div>

        {problem.image && (
          <img src={problem.image} alt={problem.title} className="w-full max-h-96 object-cover rounded-lg mb-6 shadow-sm" />
        )}

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line text-lg leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Solutions Section */}
      <div className="card-bg p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Expert Solutions ({solutions.length})</h2>
        
        {solutions.length === 0 ? (
          <p className="text-gray-500 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded text-center">No solutions yet. Be the first to help!</p>
        ) : (
          <div className="space-y-6 mb-8">
            {solutions.map(solution => (
              <div key={solution._id} className="p-5 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-semibold text-primary">{solution.postedBy?.name || 'Expert'}</span>
                  <span className="text-xs text-gray-400">{new Date(solution.createdAt).toLocaleString()}</span>
                </div>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{solution.solutionText}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Solution Form */}
        {user ? (
          <form onSubmit={handleSolutionSubmit} className="mt-8 border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-3">Add Your Solution</h3>
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 outline-none mb-3"
              placeholder="Share your expertise or helpful advice to solve this problem..."
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className={`px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow transition ${posting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-hover'}`}
              >
                {posting ? 'Posting...' : 'Post Solution'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded border border-yellow-200 dark:border-yellow-800 text-center">
            Log in to help your fellow farmer by posting a solution.
            <Link to="/login" className="ml-2 font-bold underline hover:text-yellow-900">Login here</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;
