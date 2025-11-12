import React from 'react';
import { useDataLoader } from '../hooks/useDataLoader';
import { LoadingState } from './common/UIComponents';

function FormulaGraph({ db }) {
  const { data: formulas, loading } = useDataLoader(
    () => db.listFormulas(),
    [db]
  );

  if (loading || !formulas) {
    return <LoadingState message="Loading graph..." />;
  }

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
