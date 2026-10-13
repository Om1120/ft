import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Building, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { FranchiseCard } from '../components/FranchiseCard';

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { categories, franchises } = useFranchises();

  return (
    <div className="categories-page site-wrap-wide">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <span className="badge badge-neutral">Industry Intelligence</span>
          <h1 className="page-title">Franchise Industry Sectors & Benchmarks</h1>
          <p className="page-desc">
            Explore sector-wide capital dynamics, historical growth velocity, and unit economics across core franchise categories.
          </p>
        </div>

        <Link to="/franchises" className="btn btn-secondary btn-sm">
          <span>All Opportunities</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Categories Detailed Sections */}
      <div className="categories-detailed-list">
        {categories.map((cat) => {
          const categoryFranchises = franchises.filter((f) => f.category === cat.name);
          return (
            <div key={cat.id} className="card category-section-card">
              <div className="cat-section-header flex-between">
                <div>
                  <div className="cat-section-tags">
                    <span className={`badge badge-${cat.colorAccent}`}>{cat.growthRate}</span>
                    <span className="badge badge-neutral">{categoryFranchises.length} Brands Available</span>
                  </div>
                  <h2 className="cat-section-title">{cat.name}</h2>
                  <p className="cat-section-desc">{cat.description}</p>
                </div>

                <div className="cat-section-fin-summary">
                  <div className="cat-stat-box">
                    <span className="stat-label">Capital Range</span>
                    <span className="stat-val">{cat.avgInvestment}</span>
                  </div>
                  <Link 
                    to={`/franchises?category=${encodeURIComponent(cat.name)}`}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Sub-grid of Franchises in this sector */}
              <div className="cat-franchises-subgrid">
                {categoryFranchises.slice(0, 3).map((f) => (
                  <div key={f.id} className="cat-mini-brand-card card-soft">
                    <div className="flex-between">
                      <span className="mini-brand-name">
                        <Link to={`/franchise/${f.id}`}>{f.name}</Link>
                      </span>
                      <span className="badge badge-green">${(f.initialInvestment.min / 1000).toFixed(0)}k entry</span>
                    </div>
                    <p className="mini-brand-tagline">{f.tagline}</p>
                    <div className="mini-brand-footer flex-between">
                      <span className="mini-brand-stats">{f.unitsOperating} units • {f.royaltyFeePercent}% royalty</span>
                      <Link to={`/franchise/${f.id}`} className="mini-brand-link">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
