import React, { useState } from 'react';
import './Dashboard.css';
import { useDataLoader } from '../hooks/useDataLoader';
import { LoadingState, MetricCard, EmptyState } from './common/UIComponents';

function Dashboard({ db }) {
  const [recentFormulas, setRecentFormulas] = useState([]);

  const { data: metrics, loading } = useDataLoader(
    async () => {
      const m = await db.getMetrics();
      const formulas = await db.listFormulas();
      setRecentFormulas(formulas.slice(-5).reverse());
      return m;
    },
    [db],
    5000 // Refresh every 5 seconds
  );

  if (loading || !metrics) {
    return <LoadingState />;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="metrics-grid">
        <MetricCard icon="📊" value={metrics.formulaCount} label="Formulas" />
        <MetricCard icon="⚡" value={metrics.executionCount} label="Executions" />
        <MetricCard icon="🧬" value={metrics.mutationCount} label="Mutations" />
        <MetricCard icon="📈" value={metrics.avgFitness.toFixed(2)} label="Avg Fitness" />
      </div>

      <div className="recent-section">
        <h3>Recent Formulas</h3>
        {recentFormulas.length === 0 ? (
          <EmptyState 
            message="No formulas yet. Create your first formula!"
            icon="📝"
          />
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
