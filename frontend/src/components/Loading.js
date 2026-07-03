import React, { useMemo } from 'react';
import './Loading.css';

function Loading({ message = "Loading..." }) {
  const quote = useMemo(() => {
    const quotes = [
      'Every problem solved is a step forward.',
      'Great coders are built one question at a time.',
      'Consistency beats intensity.',
      'Your next Accepted submission is loading...',
      'Building your coding journey...',
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  return (
    <div className="loading-container" role="status" aria-live="polite" aria-label={message}>
      <div className="loading-card">
        <div className="loading-ring" aria-hidden="true" />
        <div className="loading-copy">
          <p className="loading-kicker">
            Loading<span className="loading-dots" aria-hidden="true" />
          </p>
          <h1>Loading your progress...</h1>
          <p className="loading-subtitle">
            Fetching your DSA journey. This will only take a moment.
          </p>
          <p className="loading-quote">{quote}</p>
        </div>
      </div>
    </div>
  );
}

export default Loading;
