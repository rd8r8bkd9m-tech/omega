import React, { useState } from 'react';

const ROLES = [
  { id: 0, name: 'Arbiter', icon: '⚖️', desc: 'Decision/Aggregation' },
  { id: 1, name: 'Perception', icon: '👁️', desc: 'Tokenization/Signals' },
  { id: 2, name: 'Active Memory', icon: '🧠', desc: 'Formula Cache' },
  { id: 3, name: 'Long-term Memory', icon: '💾', desc: 'Persistent Storage' },
  { id: 4, name: 'Analytics', icon: '🔍', desc: 'Pattern Matching' },
  { id: 5, name: 'Mutation', icon: '🧬', desc: 'Formula Generation' },
  { id: 6, name: 'Execution', icon: '⚡', desc: 'Sandbox Runtime' },
  { id: 7, name: 'Goals', icon: '🎯', desc: 'Rules/Policies' },
  { id: 8, name: 'Federation', icon: '🌐', desc: 'Node Communication' },
  { id: 9, name: 'Audit', icon: '🔐', desc: 'Integrity/Signatures' }
];

function KernelPanel({ db }) {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div>
      <h2>Kernel Panel (0-9 Roles)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            style={{
              padding: '1rem',
              background: activeRole === role.id ? 'var(--primary)' : 'var(--surface)',
              color: activeRole === role.id ? 'white' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '2rem' }}>{role.icon}</div>
            <div style={{ fontWeight: 'bold' }}>{role.id}</div>
            <div style={{ fontSize: '0.75rem' }}>{role.name}</div>
          </button>
        ))}
      </div>
      
      <div className="kolibri-card">
        <h3>{ROLES[activeRole].icon} Role {activeRole}: {ROLES[activeRole].name}</h3>
        <p>{ROLES[activeRole].desc}</p>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '0.5rem' }}>
          <p>Metrics: Active | Status: Running | Load: {Math.floor(Math.random() * 100)}%</p>
        </div>
      </div>
    </div>
  );
}

export default KernelPanel;
