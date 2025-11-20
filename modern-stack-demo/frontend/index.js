import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from your backend API
    setTimeout(() => {
      setStatus({
        message: 'Modern Stack Demo Frontend',
        apiStatus: 'Connected',
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>{status.message}</h1>
      </header>
      <main>
        <div className="status-card">
          <h2>System Status</h2>
          <p>API Connection: {status.apiStatus}</p>
          <p>Last Updated: {status.timestamp}</p>
        </div>
      </main>
      <footer>
        <p>Modern Stack Demo Application</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);