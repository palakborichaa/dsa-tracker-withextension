// AddProblem.js
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './AddProblem.css';

function AddProblem() {
  const [form, setForm] = useState({
    problemName: '',
    platform: '',
    link: '',
    difficulty: '',
    topic: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Submit new DSA problem
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!form.problemName || !form.platform) {
      setError('Problem Name and Platform are required');
      setLoading(false);
      return;
    }

    try {
      await API.post(`/dsa/add`, form);
      setSuccess('Problem added successfully!');
      setForm({
        problemName: '',
        platform: '',
        link: ''
      });

      // Redirect to profile after 2 seconds
      setTimeout(() => navigate('/profile'), 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add problem. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-problem-container">
      <div className="add-problem-header">
        <h2> Add a DSA Problem</h2>
        <p>Track your problem-solving progress</p>
      </div>

      <div className="add-problem-card">
        {error && <div className="add-error-message">{error}</div>}
        {success && <div className="add-success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="add-problem-form">
          <div className="add-form-group">
            <label htmlFor="problemName">Problem Name *</label>
            <input
              id="problemName"
              name="problemName"
              placeholder="e.g., Two Sum"
              value={form.problemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-form-group">
            <label htmlFor="platform">Platform *</label>
            <input
              id="platform"
              name="platform"
              placeholder="e.g., LeetCode, CodeForces, HackerRank"
              value={form.platform}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-form-group">
            <label htmlFor="link">Problem Link</label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="https://example.com"
              value={form.link}
              onChange={handleChange}
            />
          </div>

          <div className="add-form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="">Choose difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="add-form-group">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              name="topic"
              placeholder="e.g., Graphs, DP, Arrays"
              value={form.topic}
              onChange={handleChange}
            />
          </div>

          <div className="add-form-buttons">
            <button
              type="submit"
              className="add-submit-btn"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Problem'}
            </button>
            <button
              type="button"
              className="add-cancel-btn"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProblem;
