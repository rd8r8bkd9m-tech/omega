import React, { useState, useEffect } from 'react';
import './ClusterManager.css';
import { StatusDisplay } from './common/UIComponents';

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

  const utilization = Math.floor((metrics.busy / metrics.total) * 100);

  return (
    <div>
      <h2>Cluster Manager</h2>
      
      <div className="kolibri-card cluster-config">
        <h3>Configuration</h3>
        <div className="config-controls">
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
        
        <div className="cluster-actions">
          <button 
            className="kolibri-button" 
            onClick={startCluster}
            disabled={isRunning}
          >
            ▶️ Start Cluster
          </button>
          <button 
            className="kolibri-button stop-button" 
            onClick={stopCluster}
            disabled={!isRunning}
          >
            ⏹️ Stop Cluster
          </button>
        </div>
      </div>

      <div className="kolibri-card">
        <h3>Status</h3>
        <div className="status-panel">
          <StatusDisplay 
            label="Status" 
            value={isRunning ? '🟢 Running' : '🔴 Stopped'} 
          />
          <StatusDisplay 
            label="Workers" 
            value={`${metrics.busy} busy / ${metrics.total} total`} 
          />
          <StatusDisplay 
            label="Utilization" 
            value={`${utilization}%`} 
          />
        </div>
        
        <div className="activity-visualization">
          Worker activity visualization
        </div>
      </div>
    </div>
  );
}

export default ClusterManager;
