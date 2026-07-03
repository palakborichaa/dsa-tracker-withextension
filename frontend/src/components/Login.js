// Login.js
import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { publishExtensionAuth } from '../extensionAuth';
import './Login.css';

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use API module for login
      const res = await login(form);

      const token = res.token; // API already returns res.data
      localStorage.setItem('token', token); // Save JWT for authenticated requests
      publishExtensionAuth(token);
      setIsLoggedIn(true);
      navigate('/profile'); // Redirect to the primary user page

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-split">
        <aside className="auth-panel auth-panel--visual">
          <div className="brand-block">
            <div className="brand-icon">DS</div>
            <div>
              <p className="brand-label">DSA Tracker</p>
            </div>
          </div>

          <div className="panel-hero">
            <h1>Welcome back!</h1>
            <p>Log in to continue tracking your progress.</p>
          </div>

          <div className="analytics-grid">
            <div className="analytics-card analytics-card--heatmap">
              <div className="analytics-card__title">Activity heatmap</div>
              <div className="analytics-card__preview heatmap-grid" />
            </div>
            <div className="analytics-card analytics-card--stats">
              <div className="analytics-card__title">Weekly progress</div>
              <div className="analytics-card__preview bar-chart" />
            </div>
            <div className="analytics-card analytics-card--score">
              <div className="analytics-card__title">Challenge score</div>
              <div className="analytics-card__preview score-pill" />
            </div>
          </div>
        </aside>

        <main className="auth-panel auth-panel--form">
          <div className="auth-card">
            <div className="auth-card__header">
              <p className="auth-eyebrow">Secure access</p>
              <h2>Login to your account</h2>
            </div>

            {error && <div className="auth-alert auth-alert--error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-card__bottom">
              <span>Don’t have an account?</span>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
