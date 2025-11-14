import React from 'react';
import './UIComponents.css';

/**
 * Shared loading state component
 */
export function LoadingState({ message = 'Loading...' }) {
  return <div className="loading">{message}</div>;
}

/**
 * Shared error state component
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <p>❌ {message}</p>
      {onRetry && (
        <button onClick={onRetry} className="kolibri-button retry-button">
          🔄 Retry
        </button>
      )}
    </div>
  );
}

/**
 * Shared empty state component
 */
export function EmptyState({ message, icon = '📭', action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{message}</p>
      {action && actionLabel && (
        <button onClick={action} className="kolibri-button empty-action">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Metric card component for displaying key metrics
 */
export function MetricCard({ icon, value, label }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );
}

/**
 * Status display component
 */
export function StatusDisplay({ label, value, className = '' }) {
  return (
    <div className={`status-item ${className}`}>
      <span className="status-label">{label}:</span>
      <span className="status-value">{value}</span>
    </div>
  );
}

