import React, { useState } from 'react';

function RuleTiers({ db }) {
  const [rules, setRules] = useState([
    { id: 1, priority: 'High', budget: 80, description: 'Critical operations' },
    { id: 2, priority: 'Medium', budget: 50, description: 'Standard processing' },
    { id: 3, priority: 'Low', budget: 20, description: 'Background tasks' }
  ]);

  return (
    <div>
      <h2>Rule Tiers</h2>
      <p>Define policies and priorities for formula execution</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {rules.map(rule => (
          <div key={rule.id} className="kolibri-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>Priority: {rule.priority}</h3>
                <p>{rule.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>CPU Budget: {rule.budget}%</div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={rule.budget}
                  onChange={(e) => {
                    const newRules = [...rules];
                    newRules[rule.id - 1].budget = parseInt(e.target.value);
                    setRules(newRules);
                  }}
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="kolibri-button" style={{ marginTop: '1rem' }}>
        ➕ Add Rule Tier
      </button>
    </div>
  );
}

export default RuleTiers;
