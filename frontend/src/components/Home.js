import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../api';
import './Home.css';

const features = [
  {
    title: 'Daily Streaks',
    description: 'Maintain a visual streak of daily problem-solving momentum and consistency.',
  },
  {
    title: 'Topic Analytics',
    description: 'See trends across arrays, graphs, dynamic programming, and system design topics.',
  },
  {
    
    title: 'Platform Tracking',
    description: 'Monitor your activity across LeetCode, Codeforces, HackerRank, and other networks.',
  },
  {
    
    title: 'Smart Insights',
    description: 'Receive intelligent progress signals and identify your strongest growth areas.',
  },
  {
   
    title: 'Progress Heatmaps',
    description: 'Use heatmap views to recognize productive windows and optimize practice timing.',
  },
];

function Home({ isLoggedIn }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    if (!isLoggedIn) {
      setAnalytics(null);
      setAnalyticsLoading(false);
      setAnalyticsError('');
      return undefined;
    }

    const fetchPreviewAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');

      try {
        const data = await getAnalytics();
        if (isMounted) {
          setAnalytics(data);
        }
      } catch (err) {
        if (isMounted) {
          setAnalyticsError(err.response?.data?.error || 'Unable to load your analytics.');
        }
      } finally {
        if (isMounted) {
          setAnalyticsLoading(false);
        }
      }
    };

    fetchPreviewAnalytics();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const handleStart = () => {
    navigate(isLoggedIn ? '/profile' : '/signup');
  };

  const previewStats = isLoggedIn && analytics
    ? [
        { label: 'Streak', value: `${analytics.summary.currentStreak}d` },
        { label: 'Solved', value: analytics.summary.totalSolved },
        { label: 'Progress', value: `${analytics.summary.avgPerDay}/day` },
      ]
    : [
        { label: 'Streak', value: '12d' },
        { label: 'Solved', value: '8' },
        { label: 'Progress', value: '92%' },
      ];

  const previewProblems = isLoggedIn && analytics
    ? analytics.recentProblems.slice(0, 3)
    : [
        { _id: 'demo-1', problemName: 'Graph Traversal', platform: 'LeetCode', difficulty: 'Solved' },
        { _id: 'demo-2', problemName: 'Sliding Window', platform: 'Codeforces', difficulty: 'Review' },
        { _id: 'demo-3', problemName: 'DP Path', platform: 'HackerRank', difficulty: 'Solved' },
      ];

  return (
    <main className="home-page">
      <section className="hero-section" id="hero">
        <div className="hero-copy">
          <span className="eyebrow">Premium practice with clarity</span>
          <h1>Track your DSA journey visually.</h1>
          <p>
            Solve problems, build streaks, monitor growth, and stay consistent with a clean
            profile built for focused algorithm practice.
          </p>

          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={handleStart}>
              Start Tracking
            </button>
            
          </div>

          <div className="hero-meta">
            <div className="avatar-stack">
              <span className="avatar">A</span>
              <span className="avatar">M</span>
              <span className="avatar">S</span>
              <span className="avatar">C</span>
            </div>
            <p>Join 10K+ developers improving every day.</p>
          </div>
        </div>

        <div className="hero-preview-card">
          <div className="preview-header">
            <div>
              <p>{isLoggedIn ? 'Live profile preview' : 'Live demo preview'}</p>
              <h2>{isLoggedIn ? 'Your progress' : 'Weekly progress'}</h2>
            </div>
            <div className="preview-chip">{isLoggedIn ? 'Live' : 'Beta'}</div>
          </div>

          <div className="preview-sidebar">
            <span className="sidebar-logo">DT</span>
            <nav className="sidebar-nav">
              <button className="sidebar-link active">Overview</button>
              <button className="sidebar-link">Problems</button>
              <button className="sidebar-link">Insights</button>
            </nav>
          </div>

          <div className="preview-body">
            {analyticsLoading ? (
              <p className="preview-state">Loading your analytics...</p>
            ) : analyticsError ? (
              <p className="preview-state preview-state--error">{analyticsError}</p>
            ) : (
              <>
                <div className="preview-stats-grid">
                  {previewStats.map((item) => (
                    <div key={item.label} className="preview-stat-card">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="preview-table">
                  <div className="table-row table-head">
                    <span>Problem</span>
                    <span>Platform</span>
                    <span>{isLoggedIn ? 'Difficulty' : 'Status'}</span>
                  </div>
                  {previewProblems.length ? (
                    previewProblems.map((problem) => (
                      <div className="table-row" key={problem._id}>
                        <span>{problem.problemName}</span>
                        <span>{problem.platform || 'Unknown'}</span>
                        <span className={`status ${problem.difficulty === 'Review' ? 'pending' : 'completed'}`}>
                          {problem.difficulty || 'Unknown'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="table-row">
                      <span>No solved problems yet</span>
                      <span>Start tracking</span>
                      <span className="status pending">Empty</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <button className="preview-add-button" onClick={() => navigate('/add')}>
              + Add problem
            </button>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <p className="section-label">Core features</p>
          <h2>Everything you need to stay consistent.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      

      <section className="pricing-section" id="pricing">
        <div className="pricing-card">
          <h2>Code. Solve. Repeat.</h2>
          <p>
          Whether you're preparing for interviews, competitive programming, or simply becoming a better problem solver, this platform helps you track your journey, celebrate small wins, and stay motivated every step of the way.</p>
        </div>
      </section>

      {/* <section className="about-section" id="about">
        <div className="about-card">
          <h2>Built for disciplined problem solvers.</h2>
          <p>
            DSA Tracker keeps your coding journey focused with bold simplicity, clear habits,
            and polished analytics that feel premium without the clutter.
          </p>
        </div>
      </section> */}
    </main>
  );
}

export default Home;
