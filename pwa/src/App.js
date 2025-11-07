import React, { useState, useEffect } from 'react';
import './App.css';
import { KolibriDB } from './services/db';
import Dashboard from './components/Dashboard';
import FormulaGraph from './components/FormulaGraph';
import KernelPanel from './components/KernelPanel';
import ClusterManager from './components/ClusterManager';
import RuleTiers from './components/RuleTiers';
import ImportExport from './components/ImportExport';

function App() {
  const [theme, setTheme] = useState('light');
  const [db] = useState(() => new KolibriDB());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load theme from storage
    const savedTheme = localStorage.getItem('kolibri-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initialize database
    db.init().catch(console.error);

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [db]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('kolibri-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="kolibri-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">KOLIBRI.AI</h1>
            <span className="version">v1.0</span>
            <span className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
          
          <nav className="nav-tabs">
            <button 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={activeTab === 'graph' ? 'active' : ''}
              onClick={() => setActiveTab('graph')}
            >
              Formula Graph
            </button>
            <button 
              className={activeTab === 'kernel' ? 'active' : ''}
              onClick={() => setActiveTab('kernel')}
            >
              Kernel (0-9)
            </button>
            <button 
              className={activeTab === 'cluster' ? 'active' : ''}
              onClick={() => setActiveTab('cluster')}
            >
              Cluster
            </button>
            <button 
              className={activeTab === 'rules' ? 'active' : ''}
              onClick={() => setActiveTab('rules')}
            >
              Rule Tiers
            </button>
            <button 
              className={activeTab === 'import-export' ? 'active' : ''}
              onClick={() => setActiveTab('import-export')}
            >
              Import/Export
            </button>
          </nav>

          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard db={db} />}
        {activeTab === 'graph' && <FormulaGraph db={db} />}
        {activeTab === 'kernel' && <KernelPanel db={db} />}
        {activeTab === 'cluster' && <ClusterManager db={db} />}
        {activeTab === 'rules' && <RuleTiers db={db} />}
        {activeTab === 'import-export' && <ImportExport db={db} />}
      </main>

      <footer className="footer">
        <p>KOLIBRI.AI - Offline-first Knowledge System | Formula-based Intelligence</p>
        <p>Built with ❤️ following the fractal-decimal kernel (0-9) architecture</p>
      </footer>
    </div>
  );
}

export default App;
