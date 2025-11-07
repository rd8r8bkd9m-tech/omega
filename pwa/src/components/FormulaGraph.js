import React, { useState, useEffect } from 'react';

function FormulaGraph({ db }) {
  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    loadFormulas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const loadFormulas = async () => {
    const data = await db.listFormulas();
    setFormulas(data);
  };

  return (
    <div className="kolibri-card">
      <h2>Formula Graph</h2>
      <p>Interactive graph visualization of {formulas.length} formulas and their dependencies</p>
      <div style={{ minHeight: '500px', background: 'var(--background)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center' }}>
        <p>Graph visualization (vis-network integration)</p>
        <p>Nodes: Formulas | Edges: Dependencies</p>
      </div>
    </div>
  );
}

export default FormulaGraph;
