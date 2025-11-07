import React, { useState } from 'react';

function ImportExport({ db }) {
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kolibri-export-${Date.now()}.kpack`;
      a.click();
      setStatus('✅ Export successful');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Export failed: ' + error.message);
    }
  };

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      const text = await file.text();
      const data = JSON.parse(text);
      await db.importData(data);
      setStatus('✅ Import successful');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Import failed: ' + error.message);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.kpack') || file.name.endsWith('.kform'))) {
      const text = await file.text();
      const data = JSON.parse(text);
      await db.importData(data);
      setStatus('✅ File imported via drag & drop');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div>
      <h2>Import / Export</h2>
      
      <div className="kolibri-card" style={{ marginBottom: '2rem' }}>
        <h3>Export Knowledge</h3>
        <p>Export all formulas and blocks as a .kpack file</p>
        <button className="kolibri-button" onClick={handleExport}>
          📦 Export as .kpack
        </button>
      </div>

      <div className="kolibri-card" style={{ marginBottom: '2rem' }}>
        <h3>Import Knowledge</h3>
        <p>Import formulas from .kpack or .kform files</p>
        <input 
          type="file" 
          accept=".kpack,.kform" 
          onChange={handleImport}
          style={{ marginBottom: '1rem' }}
        />
      </div>

      <div 
        className="kolibri-card"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ 
          border: '2px dashed var(--border)', 
          padding: '3rem', 
          textAlign: 'center',
          cursor: 'pointer' 
        }}
      >
        <h3>📁 Drag & Drop Zone</h3>
        <p>Drop .kpack or .kform files here to import</p>
      </div>

      {status && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: status.startsWith('✅') ? '#10b981' : '#ef4444',
          color: 'white',
          borderRadius: '0.5rem'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default ImportExport;
