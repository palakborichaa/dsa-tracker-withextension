// Signup.js
import React, { useState } from 'react';
import './Signup.css';
import { signup } from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use API module for signup
      await signup(form);

      setSuccess('Account created successfully! Please sign in.');
      setForm({ username: '', email: '', password: '' });

      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-split">
        <aside className="auth-panel auth-panel--visual">
          <div className="brand-block">
            <div className="brand-icon">DS</div>
            <div>
              <p className="brand-label">DSA Tracker</p>
            </div>
          </div>

          <div className="panel-hero">
            <h1>Start your journey today.</h1>
            <p>Track, analyze and improve your DSA skills consistently.</p>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card analytics-card--heatmap">
              <div className="analytics-card__title">Activity heatmap</div>
              <div className="analytics-card__preview heatmap-grid" />
            </div>
            <div className="analytics-card analytics-card--stats">
              <div className="analytics-card__title">Weekly trends</div>
              <div className="analytics-card__preview bar-chart" />
            </div>
            <div className="analytics-card analytics-card--score">
              <div className="analytics-card__title">Skill score</div>
              <div className="analytics-card__preview score-pill" />
            </div>
          </div>
        </aside>

        <main className="auth-panel auth-panel--form">
          <div className="auth-card">
            <div className="auth-card__header">
              <p className="auth-eyebrow">Create your account</p>
              <h2>Create your account</h2>
            </div>

            {error && <div className="auth-alert auth-alert--error">{error}</div>}
            {success && <div className="auth-alert auth-alert--success">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="username">Full Name</label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter your full name"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-primary-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="auth-card__bottom">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
