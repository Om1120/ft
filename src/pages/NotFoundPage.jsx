import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page site-wrap section-padded">
      <div className="empty-state">
        <div className="empty-state-icon">
          <Building size={32} />
        </div>
        <h1 className="empty-state-title">404 - Page Not Located</h1>
        <p className="empty-state-desc">
          The requested franchise directory page or candidate application route does not exist.
        </p>
        <div className="empty-state-actions">
          <Link to="/" className="btn btn-primary">
            <span>Return to Homepage</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
