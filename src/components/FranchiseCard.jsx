import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Scale, ArrowUpRight, Check, MapPin, Building, TrendingUp } from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const FranchiseCard = ({ franchise, onOpenApply }) => {
  const { favorites, toggleFavorite, compareList, addToCompare, removeFromCompare } = useFranchises();

  const isFavorited = favorites.includes(franchise.id);
  const isInCompare = compareList.includes(franchise.id);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'blue': return 'badge-blue';
      case 'beige': return 'badge-beige';
      case 'lavender': return 'badge-lavender';
      default: return 'badge-green';
    }
  };

  return (
    <div className="card franchise-card card-hover">
      {/* Header section */}
      <div className="franchise-card-head">
        <div className="franchise-card-meta">
          <span className="badge badge-neutral">{franchise.category}</span>
          {franchise.badge && (
            <span className={`badge ${getBadgeClass(franchise.badgeType)}`}>
              {franchise.badge}
            </span>
          )}
        </div>
        <button
          type="button"
          className={`card-bookmark-btn ${isFavorited ? 'bookmarked' : ''}`}
          onClick={() => toggleFavorite(franchise.id)}
          title={isFavorited ? 'Remove from Saved' : 'Save to Favorites'}
          aria-label={isFavorited ? 'Remove from Saved' : 'Save to Favorites'}
        >
          <Bookmark size={16} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Brand Title and Tagline */}
      <div className="franchise-card-title-wrap">
        <h3 className="franchise-card-name">
          <Link to={`/franchise/${franchise.id}`}>{franchise.name}</Link>
        </h3>
        <p className="franchise-card-tagline">{franchise.tagline}</p>
      </div>

      {/* Financials & Key Unit Economics Grid */}
      <div className="franchise-card-stats-grid">
        <div className="stat-cell">
          <span className="stat-label">Initial Investment</span>
          <span className="stat-value">
            {formatCurrency(franchise.initialInvestment.min)} - {formatCurrency(franchise.initialInvestment.max)}
          </span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Min Liquid Cash</span>
          <span className="stat-value">{formatCurrency(franchise.minLiquidCapital)}</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Royalty Fee</span>
          <span className="stat-value">{franchise.royaltyFeePercent}%</span>
        </div>
        <div className="stat-cell">
          <span className="stat-label">Est. Payback</span>
          <span className="stat-value">{franchise.paybackPeriodMonths} mos</span>
        </div>
      </div>

      {/* Supporting details pills */}
      <div className="franchise-card-details">
        <div className="detail-pill" title="Active operating units">
          <Building size={13} />
          <span>{franchise.unitsOperating} units operating</span>
        </div>
        <div className="detail-pill" title="Headquarters location">
          <MapPin size={13} />
          <span>HQ: {franchise.headquarters}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="franchise-card-actions">
        <button
          type="button"
          className={`btn btn-sm ${isInCompare ? 'btn-soft' : 'btn-secondary'} compare-btn`}
          onClick={() => isInCompare ? removeFromCompare(franchise.id) : addToCompare(franchise.id)}
          title={isInCompare ? 'Remove from comparison' : 'Add to side-by-side comparison'}
        >
          {isInCompare ? <Check size={14} /> : <Scale size={14} />}
          <span>{isInCompare ? 'Comparing' : 'Compare'}</span>
        </button>

        <div className="card-primary-actions">
          {onOpenApply && (
            <button
              type="button"
              className="btn btn-sm btn-soft"
              onClick={() => onOpenApply(franchise)}
            >
              Apply
            </button>
          )}
          <Link
            to={`/franchise/${franchise.id}`}
            className="btn btn-sm btn-primary"
          >
            <span>View Details</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
