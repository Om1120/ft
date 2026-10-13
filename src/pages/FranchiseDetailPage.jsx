import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Scale, 
  Bookmark, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  FileText, 
  Calculator,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { ApplicationModal } from '../components/ApplicationModal';
import { InquiryModal } from '../components/InquiryModal';
import { FranchiseCard } from '../components/FranchiseCard';

export const FranchiseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    franchises, 
    favorites, 
    toggleFavorite, 
    compareList, 
    addToCompare, 
    removeFromCompare 
  } = useFranchises();

  const franchise = franchises.find((f) => f.id === id);

  // Modal states
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Pro-Forma Unit Economics Interactive Slider State
  const defaultMonthlyGross = franchise ? Math.round(franchise.avgAnnualGrossSales / 12) : 50000;
  const [projectedMonthlyRevenue, setProjectedMonthlyRevenue] = useState(defaultMonthlyGross);

  if (!franchise) {
    return (
      <div className="site-wrap section-padded">
        <div className="empty-state">
          <Building size={32} />
          <h2 className="empty-state-title">Franchise Profile Not Found</h2>
          <p className="empty-state-desc">
            The franchise opportunity you are trying to view does not exist or was removed from the active directory.
          </p>
          <Link to="/franchises" className="btn btn-primary">
            Back to Franchise Directory
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = favorites.includes(franchise.id);
  const isInCompare = compareList.includes(franchise.id);

  // Dynamic calculations for pro-forma engine
  const monthlyRoyaltyFee = projectedMonthlyRevenue * (franchise.royaltyFeePercent / 100);
  const monthlyMarketingFee = projectedMonthlyRevenue * (franchise.marketingFeePercent / 100);
  // Estimated COGS & operational overhead based on net margin
  const estimatedCostRatio = 1 - (franchise.avgNetProfitMargin / 100);
  const baseOpExAndCogs = projectedMonthlyRevenue * (estimatedCostRatio - (franchise.royaltyFeePercent + franchise.marketingFeePercent) / 100);
  const monthlyNetCashflow = projectedMonthlyRevenue - baseOpExAndCogs - monthlyRoyaltyFee - monthlyMarketingFee;
  const annualNetCashflow = monthlyNetCashflow * 12;
  const midInvestment = (franchise.initialInvestment.min + franchise.initialInvestment.max) / 2;
  const calculatedPaybackMonths = monthlyNetCashflow > 0 ? Math.max(8, Math.round(midInvestment / monthlyNetCashflow)) : 0;

  // Similar franchises in sector
  const similarFranchises = franchises
    .filter((f) => f.category === franchise.category && f.id !== franchise.id)
    .slice(0, 3);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="franchise-detail-page site-wrap-wide">
      {/* Navigation Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link to="/franchises" className="breadcrumb-back-link">
          <ArrowLeft size={14} />
          <span>Back to Directory</span>
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-category">{franchise.category}</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{franchise.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="card detail-hero-card">
        <div className="detail-hero-top flex-between">
          <div className="detail-hero-badges">
            <span className="badge badge-neutral">{franchise.category}</span>
            {franchise.badge && <span className="badge badge-green">{franchise.badge}</span>}
            <span className="badge badge-blue">Item 19 Verified</span>
          </div>

          <div className="detail-top-actions">
            <button
              type="button"
              className={`btn btn-sm ${isFavorited ? 'btn-soft' : 'btn-secondary'}`}
              onClick={() => toggleFavorite(franchise.id)}
            >
              <Bookmark size={14} fill={isFavorited ? 'currentColor' : 'none'} />
              <span>{isFavorited ? 'Saved to Portfolio' : 'Save Franchise'}</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${isInCompare ? 'btn-soft' : 'btn-secondary'}`}
              onClick={() => isInCompare ? removeFromCompare(franchise.id) : addToCompare(franchise.id)}
            >
              <Scale size={14} />
              <span>{isInCompare ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>
        </div>

        <div className="detail-hero-body">
          <div className="detail-hero-info">
            <h1 className="detail-brand-name">{franchise.name}</h1>
            <p className="detail-brand-tagline">{franchise.tagline}</p>

            <div className="detail-meta-row">
              <span className="meta-item">
                <MapPin size={14} />
                <span>HQ: {franchise.headquarters}</span>
              </span>
              <span className="meta-item">
                <Building size={14} />
                <span>{franchise.unitsOperating} Operating Units</span>
              </span>
              <span className="meta-item">
                <Calendar size={14} />
                <span>Est. {franchise.establishedYear} (Franchising {franchise.franchisingSince})</span>
              </span>
              <span className="meta-item">
                <Users size={14} />
                <span>Rating: {franchise.rating} / 5.0 ({franchise.reviewCount} Reviews)</span>
              </span>
            </div>
          </div>

          <div className="detail-hero-cta-box">
            <button 
              type="button" 
              className="btn btn-primary btn-lg" 
              onClick={() => setIsApplyOpen(true)}
            >
              <span>Apply for Franchise</span>
              <ArrowRight size={16} />
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-lg"
              onClick={() => setIsInquiryOpen(true)}
            >
              <MessageSquare size={16} />
              <span>Request Info Packet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Financial Overview & Specifications */}
      <div className="detail-content-grid">
        {/* Left Column: Comprehensive Financials & Details */}
        <div className="detail-main-col">
          {/* Financial Breakdown Card */}
          <div className="card detail-section-card">
            <div className="section-card-head">
              <DollarSign size={20} className="section-head-icon" />
              <div>
                <h3 className="section-card-title">Standardized Financial Requirements</h3>
                <p className="section-card-sub">Accredited capital figures based on current franchise disclosure filings.</p>
              </div>
            </div>

            <div className="financial-metrics-grid">
              <div className="fin-card">
                <span className="fin-metric-label">Total Initial Investment</span>
                <span className="fin-metric-val">
                  {formatCurrency(franchise.initialInvestment.min)} - {formatCurrency(franchise.initialInvestment.max)}
                </span>
                <span className="fin-metric-hint">Includes buildout, equipment & working capital</span>
              </div>

              <div className="fin-card">
                <span className="fin-metric-label">Initial Franchise Fee</span>
                <span className="fin-metric-val">{formatCurrency(franchise.franchiseFee)}</span>
                <span className="fin-metric-hint">Paid upon signing Franchise Agreement</span>
              </div>

              <div className="fin-card">
                <span className="fin-metric-label">Ongoing Royalty Fee</span>
                <span className="fin-metric-val">{franchise.royaltyFeePercent}%</span>
                <span className="fin-metric-hint">Percentage of gross monthly sales</span>
              </div>

              <div className="fin-card">
                <span className="fin-metric-label">Marketing & Brand Ad Fund</span>
                <span className="fin-metric-val">{franchise.marketingFeePercent}%</span>
                <span className="fin-metric-hint">National marketing & localized brand digital spend</span>
              </div>

              <div className="fin-card">
                <span className="fin-metric-label">Minimum Liquid Capital</span>
                <span className="fin-metric-val">{formatCurrency(franchise.minLiquidCapital)}</span>
                <span className="fin-metric-hint">Cash, marketable securities or cash-equivalent</span>
              </div>

              <div className="fin-card">
                <span className="fin-metric-label">Minimum Net Worth</span>
                <span className="fin-metric-val">{formatCurrency(franchise.netWorthRequired)}</span>
                <span className="fin-metric-hint">Total assets minus personal liabilities</span>
              </div>
            </div>
          </div>

          {/* Business Model & Value Propositions */}
          <div className="card detail-section-card">
            <h3 className="section-card-title">Concept & Business Model Overview</h3>
            <p className="detail-long-desc">{franchise.description}</p>

            <div className="why-choose-list-wrap">
              <h4 className="sub-section-title">Key Competitive Advantages</h4>
              <div className="why-choose-grid">
                {franchise.whyChoose.map((point, index) => (
                  <div key={index} className="advantage-point">
                    <CheckCircle2 size={16} color="var(--color-primary)" className="advantage-icon" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pro-Forma Unit Economics Interactive Calculator */}
          <div className="card detail-section-card proforma-card">
            <div className="section-card-head">
              <Calculator size={20} className="section-head-icon" />
              <div>
                <h3 className="section-card-title">Interactive Pro-Forma Cashflow Modeler</h3>
                <p className="section-card-sub">
                  Adjust monthly revenue to simulate net owner cashflow and projected breakeven timeline.
                </p>
              </div>
            </div>

            <div className="proforma-slider-wrap">
              <div className="slider-header flex-between">
                <label className="slider-label">Projected Monthly Gross Revenue:</label>
                <span className="slider-value-display">{formatCurrency(projectedMonthlyRevenue)}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={150000}
                step={5000}
                className="custom-range-slider"
                value={projectedMonthlyRevenue}
                onChange={(e) => setProjectedMonthlyRevenue(parseInt(e.target.value, 10))}
              />
              <div className="slider-ticks flex-between">
                <span>$25k / mo</span>
                <span>$50k / mo</span>
                <span>$100k / mo</span>
                <span>$150k / mo</span>
              </div>
            </div>

            <div className="proforma-outputs-grid">
              <div className="proforma-output-cell">
                <span className="p-out-label">Estimated Monthly Net Cashflow</span>
                <span className="p-out-val highlight">{formatCurrency(monthlyNetCashflow)}</span>
                <span className="p-out-hint">After COGS, labor, rent & brand fees</span>
              </div>

              <div className="proforma-output-cell">
                <span className="p-out-label">Annualized Net Cashflow</span>
                <span className="p-out-val">{formatCurrency(annualNetCashflow)}</span>
                <span className="p-out-hint">Projected pre-tax owner earnings</span>
              </div>

              <div className="proforma-output-cell">
                <span className="p-out-label">Estimated Payback Horizon</span>
                <span className="p-out-val">{calculatedPaybackMonths} Months</span>
                <span className="p-out-hint">To recover initial mid-point investment</span>
              </div>
            </div>

            <div className="proforma-breakdown-table">
              <div className="p-row flex-between">
                <span>Monthly Royalty ({franchise.royaltyFeePercent}%)</span>
                <strong>- {formatCurrency(monthlyRoyaltyFee)}</strong>
              </div>
              <div className="p-row flex-between">
                <span>Monthly Brand Marketing ({franchise.marketingFeePercent}%)</span>
                <strong>- {formatCurrency(monthlyMarketingFee)}</strong>
              </div>
              <div className="p-row flex-between">
                <span>Estimated Operating Overhead & Direct COGS</span>
                <strong>- {formatCurrency(baseOpExAndCogs)}</strong>
              </div>
            </div>
          </div>

          {/* Training, Support & Supply Chain */}
          <div className="card detail-section-card">
            <h3 className="section-card-title">Training, Support & Site Selection</h3>
            <div className="training-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Initial Training Program</span>
                <span className="spec-val">{franchise.trainingAndSupport.initialDays} Days</span>
                <p className="spec-desc">Classroom instruction, leadership manuals, and in-store apprenticeship.</p>
              </div>

              <div className="spec-card">
                <span className="spec-label">Site Selection Support</span>
                <span className="spec-val">Turnkey Assistance</span>
                <p className="spec-desc">{franchise.trainingAndSupport.siteAssistance}</p>
              </div>

              <div className="spec-card">
                <span className="spec-label">Ongoing Operations</span>
                <span className="spec-val">Dedicated Coaching</span>
                <p className="spec-desc">{franchise.trainingAndSupport.ongoingSupport}</p>
              </div>

              <div className="spec-card">
                <span className="spec-label">Centralized Supply Chain</span>
                <span className="spec-val">Pre-negotiated</span>
                <p className="spec-desc">{franchise.trainingAndSupport.supplyChain}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Real Estate Specs & Territory Map */}
        <aside className="detail-sidebar-col">
          {/* Quick Apply Card */}
          <div className="card sidebar-cta-card">
            <h4 className="cta-card-title">Take the Next Step</h4>
            <p className="cta-card-desc">
              Submit your candidate application or connect directly with our franchise advisory desk.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={() => setIsApplyOpen(true)}
            >
              Apply for {franchise.name}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setIsInquiryOpen(true)}
            >
              Inquire / Request Packet
            </button>
          </div>

          {/* Real Estate Footprint Specs */}
          <div className="card detail-side-card">
            <h4 className="side-card-title">Space & Facility Criteria</h4>
            <div className="side-spec-item">
              <span className="side-spec-label">Square Footage Needed</span>
              <span className="side-spec-val">{franchise.spaceRequiredSqFt}</span>
            </div>
            <div className="side-spec-item">
              <span className="side-spec-label">Facility Format</span>
              <span className="side-spec-val">{franchise.spaceType}</span>
            </div>
            <div className="side-spec-item">
              <span className="side-spec-label">Financing Assistance</span>
              <span className="side-spec-val">
                {franchise.financingAvailable ? 'Available via 3rd Party SBA Lenders' : 'Not Provided'}
              </span>
            </div>
          </div>

          {/* Active Development Territories */}
          <div className="card detail-side-card">
            <h4 className="side-card-title">Priority Expansion Territories</h4>
            <p className="side-card-text">
              {franchise.name} has active territorial rights available for single-unit and multi-unit development in:
            </p>
            <div className="territories-pills-list">
              {franchise.territoriesAvailable?.map((territory, idx) => (
                <span key={idx} className="territory-tag">
                  <MapPin size={12} />
                  <span>{territory}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="alert-box alert-disclaimer" style={{ marginTop: 16 }}>
            <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '12px' }}>
              Financial figures shown are extracted from representative FDD Item 19 filings for educational simulation.
            </span>
          </div>
        </aside>
      </div>

      {/* Similar Franchises Section */}
      {similarFranchises.length > 0 && (
        <div className="similar-franchises-section section-padded-sm">
          <div className="section-head flex-between">
            <div>
              <span className="badge badge-neutral">Peer Comparison</span>
              <h2 className="section-title">Similar Opportunities in {franchise.category}</h2>
            </div>
            <Link to={`/franchises?category=${encodeURIComponent(franchise.category)}`} className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="franchises-grid">
            {similarFranchises.map((sim) => (
              <FranchiseCard
                key={sim.id}
                franchise={sim}
                onOpenApply={() => {
                  navigate(`/franchise/${sim.id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplicationModal
        franchise={franchise}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

      <InquiryModal
        franchiseName={franchise.name}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </div>
  );
};
