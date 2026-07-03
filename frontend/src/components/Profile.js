// Profile.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fetch profile and problems together
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await API.get(`/auth/profile`);
        setUser(profileRes.data.user);

        // Fetch user's DSA problems
        const problemsRes = await API.get(`/dsa`);
        setProblems(problemsRes.data);

      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Unable to load profile data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <div className="profile-error">{error}</div>;

  if (!user) return null; // Just in case

  const displayName = user.name
    ? user.name.split(' ')[0]
    : user.username
      ? user.username
          .replace(/[_\W]+/g, ' ')
          .split(' ')[0]
          .replace(/^./, (char) => char.toUpperCase())
      : 'User';

  const getUTCDateKey = (value) => {
    const date = new Date(value);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      .toISOString()
      .slice(0, 10);
  };

  const todayKey = getUTCDateKey(new Date());
  const solvedDays = Array.from(
    new Set(problems.map((problem) => getUTCDateKey(problem.createdAt)))
  ).sort();

  const calculateStreaks = (days) => {
    if (days.length === 0) {
      return { current: 0, max: 0 };
    }

    let maxStreak = 0;
    let currentStreak = 0;
    let streak = 0;
    let previousDay = null;

    const dayDiff = (a, b) => {
      const utcA = new Date(`${a}T00:00:00Z`).getTime();
      const utcB = new Date(`${b}T00:00:00Z`).getTime();
      return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24));
    };

    for (let i = 0; i < days.length; i += 1) {
      if (previousDay === null || dayDiff(previousDay, days[i]) > 1) {
        streak = 1;
      } else if (dayDiff(previousDay, days[i]) === 1) {
        streak += 1;
      } else {
        streak = 1;
      }

      previousDay = days[i];
      maxStreak = Math.max(maxStreak, streak);
    }

    if (days[days.length - 1] !== todayKey) {
      currentStreak = 0;
    } else {
      currentStreak = 1;
      for (let i = days.length - 2; i >= 0; i -= 1) {
        if (dayDiff(days[i], days[i + 1]) === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }

    return { current: currentStreak, max: maxStreak };
  };

  const { current: currentStreak, max: maxStreak } = calculateStreaks(solvedDays);

  const accountCreatedKey = user.createdAt
    ? getUTCDateKey(user.createdAt)
    : todayKey;

  const activeDays = Math.max(
    Math.round(
      (new Date(`${todayKey}T00:00:00Z`).getTime() - new Date(`${accountCreatedKey}T00:00:00Z`).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1,
    1
  );

  const totalSolved = problems.length;
  const recentActivities = [...problems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const achievements = [
    { title: `${currentStreak} Day Streak`, indicator: 'orange' },
    { title: `${totalSolved} Problems`, indicator: 'green' },
    { title: `${maxStreak} Best Streak`, indicator: 'purple' },
    { title: `${solvedDays.length} Active Days`, indicator: 'gold' },
  ];

  const sidebarItems = [
    { label: 'Add Problem', action: () => navigate('/add') },
    { label: 'Analytics', action: () => navigate('/analytics') },
    { label: 'Profile', action: () => navigate('/profile'), active: true },
    { label: 'Solved History', action: () => navigate('/history') },
  ];

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="sidebar-brand">DT</div>
        <nav className="sidebar-menu">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar-menu-item${item.active ? ' active' : ''}`}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="profile-content">
        <section className="profile-panel">
          <div className="profile-topbar">
            <div className="profile-summary">
              <div className="profile-avatar">{displayName.charAt(0)}</div>
              <div className="profile-text">
                <p className="profile-name">{displayName}</p>
                <p className="profile-handle">@{user.username}</p>
                <p className="profile-bio">
                  DSA enthusiast | Building consistency one problem at a time.
                </p>
              </div>
            </div>
            <button className="edit-profile-btn" type="button">
              Edit Profile
            </button>
          </div>

          <div className="profile-stats-grid">
            <article className="stat-card-1">
              <span className="stat-label-1">Total solved</span>
              <strong className="stat-value-1">{totalSolved}</strong>
            </article>
            <article className="stat-card-1">
              <span className="stat-label-1">Current streak</span>
              <strong className="stat-value-1">{currentStreak}</strong>
            </article>
            <article className="stat-card-1">
              <span className="stat-label-1">Max streak</span>
              <strong className="stat-value-1">{maxStreak}</strong>
            </article>
            <article className="stat-card-1">
              <span className="stat-label-1">Active days</span>
              <strong className="stat-value-1">{activeDays}</strong>
            </article>
          </div>

          <section className="achievements-section">
            <div className="section-header">
              <h3>Achievements</h3>
            </div>
            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div key={achievement.title} className="achievement-pill">
                  <span
                    className={`achievement-indicator achievement-indicator--${achievement.indicator}`}
                  />
                  <span className="achievement-title">{achievement.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="recent-activity-section">
            <div className="section-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-table-wrapper">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Platform</th>
                    <th>Difficulty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length ? (
                    recentActivities.map((problem) => {
                      const created = new Date(problem.createdAt);
                      const date = created.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      return (
                        <tr key={problem._id}>
                          <td className="activity-cell-title">{problem.problemName}</td>
                          <td>
                            <span className="platform-pill">
                              {problem.platform || 'Unknown'}
                            </span>
                          </td>
                          <td>{problem.difficulty || 'Unknown'}</td>
                          <td>{date}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="activity-empty">
                        No solved problems yet. Add your first problem to start building history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {problems.length > 0 && (
              <button
                className="view-more-btn"
                type="button"
                onClick={() => navigate('/history')}
              >
                View More
              </button>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Profile;
