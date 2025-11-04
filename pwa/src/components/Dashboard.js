import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ db }) {
  const [metrics, setMetrics] = useState({
    formulaCount: 0,
    executionCount: 0,
    mutationCount: 0,
    avgFitness: 0
  });
  const [recentFormulas, setRecentFormulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const loadData = async () => {
    try {
      const m = await db.getMetrics();
      setMetrics(m);

      const formulas = await db.listFormulas();
      setRecentFormulas(formulas.slice(-5).reverse());
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.formulaCount}</div>
            <div className="metric-label">Formulas</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.executionCount}</div>
            <div className="metric-label">Executions</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🧬</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.mutationCount}</div>
            <div className="metric-label">Mutations</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.avgFitness.toFixed(2)}</div>
            <div className="metric-label">Avg Fitness</div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Formulas</h3>
        {recentFormulas.length === 0 ? (
          <p className="empty-state">No formulas yet. Create your first formula!</p>
        ) : (
          <div className="formula-list">
            {recentFormulas.map(formula => (
              <div key={formula.id} className="formula-item">
                <div className="formula-header">
                  <span className="formula-id">#{formula.id}</span>
                  <span className="formula-version">v{formula.version}</span>
                  <span className="formula-fitness">
                    Fitness: {formula.fitness?.toFixed(2) || 0}
                  </span>
                </div>
                <div className="formula-tags">
                  {formula.tags && formula.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-button">
            ➕ Create Formula
          </button>
          <button className="action-button">
            🔄 Run Mutation
          </button>
          <button className="action-button">
            📦 Export Knowledge
          </button>
          <button className="action-button">
            🔍 Search Formulas
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
