import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api';
import Loading from './Loading';
import './Profile.css';

const PAGE_SIZE = 10;

function SolvedHistory() {
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(parseInt(searchParams.get('page'), 10) || 1, 1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await API.get(`/dsa/history?page=${page}&limit=${PAGE_SIZE}`);
        setProblems(res.data.problems);
        setPagination(res.data.pagination);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Unable to load solved problem history.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate, page]);

  const goToPage = (nextPage) => {
    setSearchParams({ page: String(nextPage) });
  };

  if (loading) return <Loading message="Loading solved history..." />;

  return (
    <div className="profile-page history-page">
      <aside className="profile-sidebar">
        <div className="sidebar-brand">DT</div>
        <nav className="sidebar-menu">
          <button type="button" className="sidebar-menu-item" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button type="button" className="sidebar-menu-item" onClick={() => navigate('/add')}>
            Add Problem
          </button>
          <button type="button" className="sidebar-menu-item" onClick={() => navigate('/analytics')}>
            Analytics
          </button>
          <button type="button" className="sidebar-menu-item active" onClick={() => navigate('/history')}>
            Solved History
          </button>
        </nav>
      </aside>

      <main className="profile-content">
        <section className="profile-panel">
          <div className="history-header">
            <div>
              <p className="history-eyebrow">Complete history</p>
              <h1>Solved Problems</h1>
              <p>{pagination.total} problem{pagination.total === 1 ? '' : 's'} solved, newest first.</p>
            </div>
            <button className="edit-profile-btn" type="button" onClick={() => navigate('/profile')}>
              Back to Profile
            </button>
          </div>

          {error ? (
            <div className="profile-error">{error}</div>
          ) : (
            <>
              <div className="activity-table-wrapper">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Platform</th>
                      <th>Difficulty</th>
                      <th>Date solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.length ? (
                      problems.map((problem) => {
                        const solvedDate = new Date(problem.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });

                        return (
                          <tr key={problem._id}>
                            <td className="activity-cell-title">{problem.problemName}</td>
                            <td><span className="platform-pill">{problem.platform || 'Unknown'}</span></td>
                            <td>{problem.difficulty || 'Unknown'}</td>
                            <td>{solvedDate}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="activity-empty">
                          No solved problems yet. Add a problem and it will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={pagination.page <= 1}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default SolvedHistory;
