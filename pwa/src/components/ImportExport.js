import React, { useState } from 'react';
import './ImportExport.css';
import { ErrorState } from './common/UIComponents';

function ImportExport({ db }) {
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const showSuccess = (message) => {
    setStatus(message);
    setError(null);
    setTimeout(() => setStatus(''), 3000);
  };

  const showError = (message) => {
    setError(message);
    setStatus('');
  };

  const handleExport = async () => {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kolibri-export-${Date.now()}.kpack`;
      a.click();
      showSuccess('✅ Export successful');
    } catch (err) {
      showError('Export failed: ' + err.message);
    }
  };

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      const text = await file.text();
      const data = JSON.parse(text);
      await db.importData(data);
      showSuccess('✅ Import successful');
    } catch (err) {
      showError('Import failed: ' + err.message);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    try {
      const file = event.dataTransfer.files[0];
      if (file && (file.name.endsWith('.kpack') || file.name.endsWith('.kform'))) {
        const text = await file.text();
        const data = JSON.parse(text);
        await db.importData(data);
        showSuccess('✅ File imported via drag & drop');
      }
    } catch (err) {
      showError('Import failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Import / Export</h2>
      
      {error && <ErrorState message={error} onRetry={() => setError(null)} />}
      
      <div className="kolibri-card export-section">
        <h3>Export Knowledge</h3>
        <p>Export all formulas and blocks as a .kpack file</p>
        <button className="kolibri-button" onClick={handleExport}>
          📦 Export as .kpack
        </button>
      </div>

      <div className="kolibri-card import-section">
        <h3>Import Knowledge</h3>
        <p>Import formulas from .kpack or .kform files</p>
        <input 
          type="file" 
          accept=".kpack,.kform" 
          onChange={handleImport}
          className="file-input"
        />
      </div>

      <div 
        className="kolibri-card drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h3>📁 Drag & Drop Zone</h3>
        <p>Drop .kpack or .kform files here to import</p>
      </div>

      {status && <div className="status-message success">{status}</div>}
    </div>
  );
}

export default ImportExport;
