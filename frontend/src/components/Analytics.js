import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loading from './Loading';
import './Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/dsa/analytics');
        setAnalytics(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Unable to load analytics at this time.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (loading) return <Loading message="Loading analytics..." />;
  if (error) return <div className="analytics-error">{error}</div>;
  if (!analytics) return null;

  const {
    summary,
    dailyTrend,
    platformDistribution,
    difficultyDistribution,
    topicCounts,
    recentProblems,
  } = analytics;

  const getHeatClass = (count) => {
    if (count === 0) return 'heat-cell--0';
    if (count <= 2) return 'heat-cell--1';
    if (count <= 4) return 'heat-cell--2';
    if (count <= 7) return 'heat-cell--3';
    return 'heat-cell--4';
  };

  const formatTooltip = (dateString, count) => {
    const date = new Date(dateString);
    const label = date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return `${label} — ${count} problem${count === 1 ? '' : 's'} solved`;
  };

  const renderBarRows = (data) => {
    return data.map((item) => (
      <div key={item.label} className="analytics-breakdown-row">
        <div className="breakdown-title">
          <span className="breakdown-label">{item.label}</span>
          <span className="breakdown-value">{item.count} solved</span>
        </div>
        <div className="breakdown-track">
          <div
            className="breakdown-bar"
            style={{ width: `${item.percent}%` }}
          />
        </div>
      </div>
    ));
  };

  return (
    <main className="analytics-page">
      <div className="analytics-header">
        <div>
          <p className="analytics-eyebrow">Premium insights</p>
          <h1 className="analytics-title">Performance analytics</h1>
        </div>

        
      </div>

      <section className="analytics-summary-grid">
        <article className="analytics-card summary-card">
          <p className="card-label">Solved problems</p>
          <strong>{summary.totalSolved}</strong>
          <p className="card-note">Total problems tracked in your workspace.</p>
        </article>
        <article className="analytics-card summary-card">
          <p className="card-label">Current streak</p>
          <strong>{summary.currentStreak}</strong>
          <p className="card-note">Days of consecutive submission activity.</p>
        </article>
        <article className="analytics-card summary-card">
          <p className="card-label">Active days</p>
          <strong>{summary.activeDays}</strong>
          <p className="card-note">Days since you started tracking problems.</p>
        </article>
        <article className="analytics-card summary-card">
          <p className="card-label">Average per day</p>
          <strong>{summary.avgPerDay}</strong>
          <p className="card-note">Problems solved per active day.</p>
        </article>
      </section>

      <section className="analytics-insights-grid">
        <article className="analytics-card highlight-card">
          <p className="card-label">Top platform</p>
          <strong>{summary.topPlatform}</strong>
          <p className="card-note">Your strongest platform by solved submissions.</p>
        </article>
        <article className="analytics-card highlight-card">
          <p className="card-label">Top topic</p>
          <strong>{summary.topTopic}</strong>
          <p className="card-note">This is the topic area where you solve the most problems.</p>
        </article>
      </section>

      <section className="analytics-panel heatmap-panel">
        <div className="section-header">
          <div>
            <h2>Current month activity heatmap</h2>
            <p>Track your consistency with daily problem counts for this calendar month.</p>
          </div>
        </div>

        <div className="heatmap-legend">
          <span>Less</span>
          <span className="heatmap-dot heatmap-dot--0" />
          <span className="heatmap-dot heatmap-dot--1" />
          <span className="heatmap-dot heatmap-dot--2" />
          <span className="heatmap-dot heatmap-dot--3" />
          <span className="heatmap-dot heatmap-dot--4" />
          <span>More</span>
        </div>

        <div className="heatmap-grid-wrapper">
          <div className="heatmap-grid">
            {dailyTrend.map((entry) => (
              <button
                key={entry.date}
                type="button"
                className={`heat-cell ${getHeatClass(entry.count)}`}
                title={formatTooltip(entry.date, entry.count)}
                aria-label={formatTooltip(entry.date, entry.count)}
              />
            ))}
          </div>
        </div>

        {summary.totalSolved === 0 && (
          <p className="heatmap-empty-state">
            No problems solved yet — start logging your first problem to watch this heatmap light up.
          </p>
        )}
      </section>

      <section className="analytics-breakdowns-grid">
        <article className="analytics-card analytics-breakdown-card">
          <div className="section-header">
            <h3>Platform breakdown</h3>
          </div>
          {platformDistribution.length ? (
            renderBarRows(platformDistribution)
          ) : (
            <p className="empty-state">No platform data yet. Add a few problems to analyze your mix.</p>
          )}
        </article>

        <article className="analytics-card analytics-breakdown-card">
          <div className="section-header">
            <h3>Difficulty balance</h3>
          </div>
          {difficultyDistribution.length ? (
            <div className="donut-legend">
              {difficultyDistribution.map((item) => (
                <div key={item.label} className="donut-item">
                  <span className={`donut-color donut-color--${item.label.toLowerCase()}`} />
                  <span>{item.label}</span>
                  <strong>{item.percent}%</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Difficulty data is not available yet.</p>
          )}
        </article>

        <article className="analytics-card analytics-breakdown-card">
          <div className="section-header">
            <h3>Topic discovery</h3>
          </div>
          {topicCounts.length ? (
            renderBarRows(topicCounts.slice(0, 5))
          ) : (
            <p className="empty-state">Add problem topics to watch your area coverage grow.</p>
          )}
        </article>
      </section>

      <section className="analytics-panel recent-panel">
        <div className="section-header">
          <div>
            <h2>Recent submissions</h2>
            <p>Quick access to your most recent problem entries.</p>
          </div>
        </div>

        {recentProblems.length ? (
          <div className="recent-table-wrapper">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Platform</th>
                  <th>Difficulty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentProblems.map((problem) => {
                  const created = new Date(problem.createdAt);
                  const date = created.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                  return (
                    <tr key={problem._id}>
                      <td>{problem.problemName}</td>
                      <td>{problem.platform || 'Unknown'}</td>
                      <td>{problem.difficulty || 'Unknown'}</td>
                      <td>{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No recent problems to display yet.</p>
        )}
      </section>
    </main>
  );
}

export default Analytics;
