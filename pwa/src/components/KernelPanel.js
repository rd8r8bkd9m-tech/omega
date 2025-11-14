import React, { useState } from 'react';
import './KernelPanel.css';

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
      <div className="roles-grid">
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            className={`role-button ${activeRole === role.id ? 'active' : ''}`}
          >
            <div className="role-icon">{role.icon}</div>
            <div className="role-id">{role.id}</div>
            <div className="role-name">{role.name}</div>
          </button>
        ))}
      </div>
      
      <div className="kolibri-card role-details">
        <h3>{ROLES[activeRole].icon} Role {activeRole}: {ROLES[activeRole].name}</h3>
        <p>{ROLES[activeRole].desc}</p>
        <div className="role-metrics">
          <p>Metrics: Active | Status: Running | Load: {Math.floor(Math.random() * 100)}%</p>
        </div>
      </div>
    </div>
  );
}

export default KernelPanel;
