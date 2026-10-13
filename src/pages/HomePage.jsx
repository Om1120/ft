import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Building, 
  Calculator, 
  Scale, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { FranchiseCard } from '../components/FranchiseCard';
import { ApplicationModal } from '../components/ApplicationModal';

export const HomePage = () => {
  const navigate = useNavigate();
  const { franchises, categories } = useFranchises();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFranchiseForApply, setSelectedFranchiseForApply] = useState(null);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim() || selectedCategory !== 'all') {
      const params = new URLSearchParams();
      if (searchKeyword.trim()) params.append('q', searchKeyword.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      navigate(`/franchises?${params.toString()}`);
    } else {
      navigate('/franchises');
    }
  };

  const featuredFranchises = franchises.filter((f) => f.featured).slice(0, 3);
  const trendingFranchises = franchises.slice(0, 6);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="site-wrap hero-content">
          <div className="hero-badge-pill">
            <span className="badge badge-green">
              <Sparkles size={12} />
              <span>Verified Franchise Discovery Platform</span>
            </span>
          </div>

          <h1 className="hero-title">
            Discover, evaluate, and launch high-performance franchise opportunities.
          </h1>

          <p className="hero-subtitle">
            Transparent unit economics, verified FDD Item 19 financial disclosures, and intelligent pro-forma modeling. Find the right franchise for your capital and growth objectives.
          </p>

          {/* Quick Search Card */}
          <div className="hero-search-card">
            <form onSubmit={handleHeroSearch} className="hero-search-form">
              <div className="search-input-group">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search by brand name, industry, or concept..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="search-select-group">
                <select
                  className="hero-category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Sectors</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary hero-submit-btn">
                <span>Explore Opportunities</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="hero-quick-tags">
              <span className="quick-tags-label">Popular Searches:</span>
              <button type="button" className="tag-link" onClick={() => navigate('/franchises?category=Food%20%26%20Beverage')}>Food & Beverage</button>
              <button type="button" className="tag-link" onClick={() => navigate('/franchises?maxInv=100000')}>Under $100k</button>
              <button type="button" className="tag-link" onClick={() => navigate('/franchises?category=Fitness%20%26%20Wellness')}>Semi-Absentee</button>
              <button type="button" className="tag-link" onClick={() => navigate('/franchises?category=Education%20%26%20Tech')}>STEM Education</button>
            </div>
          </div>

          {/* Trust Metric Counters */}
          <div className="hero-metrics-grid">
            <div className="metric-box">
              <span className="metric-num">100%</span>
              <span className="metric-label">Item 19 Disclosures Vetted</span>
            </div>
            <div className="metric-box">
              <span className="metric-num">1,240+</span>
              <span className="metric-label">Operating Franchise Units</span>
            </div>
            <div className="metric-box">
              <span className="metric-num">21 mos</span>
              <span className="metric-label">Average Projected Payback</span>
            </div>
            <div className="metric-box">
              <span className="metric-num">$35k+</span>
              <span className="metric-label">Accessible Entry Points</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES OVERVIEW */}
      <section className="section-padded bg-secondary-wrap">
        <div className="site-wrap">
          <div className="section-head flex-between">
            <div>
              <span className="badge badge-neutral">Market Sectors</span>
              <h2 className="section-title">Explore by Industry Vertical</h2>
              <p className="section-subtitle">
                Compare capital requirements, market demand drivers, and average growth velocity across core franchise industries.
              </p>
            </div>
            <Link to="/categories" className="btn btn-secondary btn-sm">
              <span>View All Sectors</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="category-card card card-hover"
                onClick={() => navigate(`/franchises?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="cat-header flex-between">
                  <span className={`badge badge-${cat.colorAccent}`}>{cat.growthRate}</span>
                  <span className="cat-units">{cat.franchiseCount} Brands</span>
                </div>
                <h3 className="cat-title">{cat.name}</h3>
                <p className="cat-desc">{cat.description}</p>
                <div className="cat-investment-line">
                  <span className="cat-label">Avg. Investment:</span>
                  <span className="cat-val">{cat.avgInvestment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED FRANCHISES SHOWCASE */}
      <section className="section-padded">
        <div className="site-wrap">
          <div className="section-head flex-between">
            <div>
              <span className="badge badge-green">Curated Opportunities</span>
              <h2 className="section-title">Featured High-Growth Franchises</h2>
              <p className="section-subtitle">
                Standardized unit economics, resilient cashflows, and active territory expansion plans.
              </p>
            </div>
            <Link to="/franchises" className="btn btn-secondary btn-sm">
              <span>Browse All ({franchises.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="franchises-grid">
            {featuredFranchises.map((franchise) => (
              <FranchiseCard
                key={franchise.id}
                franchise={franchise}
                onOpenApply={(f) => setSelectedFranchiseForApply(f)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CALCULATOR TEASER */}
      <section className="section-padded bg-secondary-wrap">
        <div className="site-wrap">
          <div className="calculator-teaser-box card">
            <div className="calc-teaser-content">
              <span className="badge badge-blue">Interactive Modeling</span>
              <h2 className="calc-teaser-title">Estimate Your Franchise ROI & Payback</h2>
              <p className="calc-teaser-desc">
                Evaluate prospective returns before signing. Test gross margin variations, royalty overhead, and debt financing scenarios with our pro-forma cashflow engine.
              </p>
              <div className="calc-features-list">
                <div className="calc-feat-item">
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Real-time monthly net cashflow calculation</span>
                </div>
                <div className="calc-feat-item">
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Dynamic royalty & marketing fee deduction</span>
                </div>
                <div className="calc-feat-item">
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Estimated breakeven timeline in months</span>
                </div>
              </div>
              <div className="calc-teaser-cta">
                <Link to="/calculator" className="btn btn-primary btn-lg">
                  <Calculator size={16} />
                  <span>Launch ROI Calculator</span>
                </Link>
                <Link to="/compare" className="btn btn-secondary btn-lg">
                  <Scale size={16} />
                  <span>Compare Top Brands</span>
                </Link>
              </div>
            </div>

            <div className="calc-teaser-preview-card">
              <div className="preview-stat-card">
                <span className="stat-preview-title">Sample Model: Bean & Brew</span>
                <div className="preview-stat-metric">
                  <span className="preview-label">Projected Annual Net Cashflow</span>
                  <span className="preview-val">$145,700</span>
                </div>
                <div className="preview-stat-metric">
                  <span className="preview-label">Estimated Breakeven Horizon</span>
                  <span className="preview-val">20.4 Months</span>
                </div>
                <div className="preview-stat-metric">
                  <span className="preview-label">Net Profit Margin</span>
                  <span className="preview-val">23.5%</span>
                </div>
                <div className="preview-tag">
                  <span>Based on Item 19 Disclosures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS JOURNEY */}
      <section className="section-padded">
        <div className="site-wrap">
          <div className="section-head text-center-wrap">
            <span className="badge badge-neutral">Systematic Process</span>
            <h2 className="section-title">How FranchiseTrack Streamlines Your Journey</h2>
            <p className="section-subtitle">
              From exploratory screening to franchise agreement signing, navigate every due diligence milestone with clarity.
            </p>
          </div>

          <div className="steps-journey-grid">
            <div className="journey-card card">
              <div className="journey-step-num">01</div>
              <h3 className="journey-title">Discover & Screen</h3>
              <p className="journey-desc">
                Filter vetted brands by minimum liquid capital, net worth criteria, territory availability, and operational model.
              </p>
            </div>

            <div className="journey-card card">
              <div className="journey-step-num">02</div>
              <h3 className="journey-title">Compare & Model</h3>
              <p className="journey-desc">
                Inspect side-by-side matrices comparing royalty structures, territory sizes, FDD disclosures, and pro-forma ROI projections.
              </p>
            </div>

            <div className="journey-card card">
              <div className="journey-step-num">03</div>
              <h3 className="journey-title">Apply Seamlessly</h3>
              <p className="journey-desc">
                Submit standardized multi-step candidate applications directly to brand development teams without repetitive paperwork.
              </p>
            </div>

            <div className="journey-card card">
              <div className="journey-step-num">04</div>
              <h3 className="journey-title">Track & Onboard</h3>
              <p className="journey-desc">
                Monitor status across 5 milestones from discovery day to real estate approval and franchise agreement signing in your portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT DISCLOSURE BANNER */}
      <section className="section-padded-sm">
        <div className="site-wrap">
          <div className="alert-box alert-disclaimer">
            <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Sample Modeling & Regulatory Notice:</strong>
              <p style={{ marginTop: 4, fontSize: '13px' }}>
                FranchiseTrack provides standardized analysis based on sample disclosure records and illustrative financial projections. Prospective franchisees should always examine registered Franchise Disclosure Documents (FDD) and retain licensed legal and accounting advisors prior to signing any commercial franchise contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedFranchiseForApply && (
        <ApplicationModal
          franchise={selectedFranchiseForApply}
          isOpen={!!selectedFranchiseForApply}
          onClose={() => setSelectedFranchiseForApply(null)}
        />
      )}
    </div>
  );
};
