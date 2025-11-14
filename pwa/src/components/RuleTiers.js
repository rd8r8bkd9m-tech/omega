import React, { useState } from 'react';
import './RuleTiers.css';

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
      
      <div className="rule-tiers-container">
        {rules.map(rule => (
          <div key={rule.id} className="kolibri-card rule-tier-card">
            <div className="rule-tier-content">
              <div className="rule-info">
                <h3>Priority: {rule.priority}</h3>
                <p>{rule.description}</p>
              </div>
              <div className="rule-controls">
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
                  className="budget-slider"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="kolibri-button add-tier-button">
        ➕ Add Rule Tier
      </button>
    </div>
  );
}

export default RuleTiers;
