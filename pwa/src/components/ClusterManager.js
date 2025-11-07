import React, { useState, useEffect } from 'react';

function ClusterManager({ db }) {
  const [workerCount, setWorkerCount] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({ busy: 0, total: 10 });

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setMetrics({
          busy: Math.floor(Math.random() * workerCount),
          total: workerCount
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, workerCount]);

  const startCluster = () => setIsRunning(true);
  const stopCluster = () => setIsRunning(false);

  return (
    <div>
      <h2>Cluster Manager</h2>
      
      <div className="kolibri-card" style={{ marginBottom: '2rem' }}>
        <h3>Configuration</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>Worker Count: </label>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={workerCount} 
            onChange={(e) => setWorkerCount(parseInt(e.target.value))}
            disabled={isRunning}
          />
          <span>{workerCount}</span>
        </div>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button 
            className="kolibri-button" 
            onClick={startCluster}
            disabled={isRunning}
          >
            ▶️ Start Cluster
          </button>
          <button 
            className="kolibri-button" 
            onClick={stopCluster}
            disabled={!isRunning}
            style={{ background: '#ef4444' }}
          >
            ⏹️ Stop Cluster
          </button>
        </div>
      </div>

      <div className="kolibri-card">
        <h3>Status</h3>
        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '0.5rem' }}>
          <div>Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}</div>
          <div>Workers: {metrics.busy} busy / {metrics.total} total</div>
          <div>Utilization: {Math.floor((metrics.busy / metrics.total) * 100)}%</div>
        </div>
        
        <div style={{ marginTop: '1rem', height: '100px', background: 'var(--background)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Worker activity visualization
        </div>
      </div>
    </div>
  );
}

export default ClusterManager;
