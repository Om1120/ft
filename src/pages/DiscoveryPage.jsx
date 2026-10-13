import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  Building, 
  ChevronDown, 
  Check, 
  X,
  ArrowUpDown
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { FranchiseCard } from '../components/FranchiseCard';
import { ApplicationModal } from '../components/ApplicationModal';

export const DiscoveryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { franchises, categories } = useFranchises();

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [maxInvestment, setMaxInvestment] = useState(searchParams.get('maxInv') || 'all');
  const [maxLiquidCapital, setMaxLiquidCapital] = useState('all');
  const [maxRoyaltyFee, setMaxRoyaltyFee] = useState('all');
  const [maxPaybackMonths, setMaxPaybackMonths] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Application Modal state
  const [applyingFranchise, setApplyingFranchise] = useState(null);

  // Synchronize URL params if they change
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const maxInv = searchParams.get('maxInv');
    if (q !== null) setSearchTerm(q);
    if (cat !== null) setSelectedCategory(cat);
    if (maxInv !== null) setMaxInvestment(maxInv);
  }, [searchParams]);

  // Handle Search Input Change
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName !== 'All') {
      newParams.set('category', catName);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxInvestment('all');
    setMaxLiquidCapital('all');
    setMaxRoyaltyFee('all');
    setMaxPaybackMonths('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Filtered and Sorted Franchises
  const filteredFranchises = useMemo(() => {
    return franchises.filter((item) => {
      // Keyword search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesTagline = item.tagline.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesHQ = item.headquarters.toLowerCase().includes(query);
        const matchesTerritory = item.territoriesAvailable?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesTagline && !matchesCategory && !matchesHQ && !matchesTerritory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Max Investment filter
      if (maxInvestment !== 'all') {
        const maxVal = parseInt(maxInvestment, 10);
        if (item.initialInvestment.min > maxVal) return false;
      }

      // Max Liquid Capital filter
      if (maxLiquidCapital !== 'all') {
        const liquidVal = parseInt(maxLiquidCapital, 10);
        if (item.minLiquidCapital > liquidVal) return false;
      }

      // Max Royalty Fee %
      if (maxRoyaltyFee !== 'all') {
        const royaltyVal = parseFloat(maxRoyaltyFee);
        if (item.royaltyFeePercent > royaltyVal) return false;
      }

      // Max Payback Months
      if (maxPaybackMonths !== 'all') {
        const paybackVal = parseInt(maxPaybackMonths, 10);
        if (item.paybackPeriodMonths > paybackVal) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'payback-fast') {
        return a.paybackPeriodMonths - b.paybackPeriodMonths;
      }
      if (sortBy === 'investment-low') {
        return a.initialInvestment.min - b.initialInvestment.min;
      }
      if (sortBy === 'investment-high') {
        return b.initialInvestment.max - a.initialInvestment.max;
      }
      if (sortBy === 'units-high') {
        return b.unitsOperating - a.unitsOperating;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'recommended': featured first, then rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [
    franchises, 
    searchTerm, 
    selectedCategory, 
    maxInvestment, 
    maxLiquidCapital, 
    maxRoyaltyFee, 
    maxPaybackMonths, 
    sortBy
  ]);

  const activeFiltersCount = [
    selectedCategory !== 'All',
    maxInvestment !== 'all',
    maxLiquidCapital !== 'all',
    maxRoyaltyFee !== 'all',
    maxPaybackMonths !== 'all',
    searchTerm.trim() !== ''
  ].filter(Boolean).length;

  return (
    <div className="discovery-page site-wrap-wide">
      {/* Header Bar */}
      <div className="page-header discovery-header">
        <div className="page-header-text">
          <span className="badge badge-neutral">Franchise Directory</span>
          <h1 className="page-title">Explore Verified Franchise Opportunities</h1>
          <p className="page-desc">
            Filter by sector, capital requirements, royalty terms, and payback velocity to find the ideal business match.
          </p>
        </div>

        <div className="discovery-header-stats">
          <div className="stat-pill-item">
            <span className="stat-pill-num">{franchises.length}</span>
            <span className="stat-pill-label">Total Brands</span>
          </div>
          <div className="stat-pill-item">
            <span className="stat-pill-num">{categories.length}</span>
            <span className="stat-pill-label">Active Sectors</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Results Area) */}
      <div className="discovery-layout">
        {/* FILTERS SIDEBAR */}
        <aside className={`discovery-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header flex-between">
            <div className="flex-align-gap">
              <SlidersHorizontal size={16} />
              <h3 className="sidebar-title">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="badge badge-green">{activeFiltersCount}</span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button 
                type="button" 
                className="btn btn-ghost btn-sm reset-filter-btn" 
                onClick={handleResetFilters}
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            <button 
              type="button" 
              className="mobile-close-filter-btn" 
              onClick={() => setMobileFilterOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search by Keyword */}
          <div className="filter-group">
            <label className="filter-label">Keyword Search</label>
            <div className="search-box-wrap">
              <Search size={15} className="search-icon-sm" />
              <input
                type="text"
                className="form-input search-input-sm"
                placeholder="Brand, concept, or city..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="clear-search-btn" onClick={() => handleSearchChange('')}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Industry Sector</label>
            <div className="filter-options-list">
              <button
                type="button"
                className={`filter-option-btn ${selectedCategory === 'All' ? 'selected' : ''}`}
                onClick={() => handleCategorySelect('All')}
              >
                <span>All Sectors</span>
                <span className="option-count">{franchises.length}</span>
              </button>
              {categories.map((c) => {
                const count = franchises.filter((f) => f.category === c.name).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`filter-option-btn ${selectedCategory === c.name ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(c.name)}
                  >
                    <span>{c.name}</span>
                    <span className="option-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Investment Filter */}
          <div className="filter-group">
            <label className="filter-label">Maximum Initial Capital</label>
            <select
              className="form-select filter-select"
              value={maxInvestment}
              onChange={(e) => setMaxInvestment(e.target.value)}
            >
              <option value="all">Any Initial Capital</option>
              <option value="60000">Under $60,000</option>
              <option value="100000">Under $100,000</option>
              <option value="150000">Under $150,000</option>
              <option value="250000">Under $250,000</option>
            </select>
          </div>

          {/* Min Liquid Capital Filter */}
          <div className="filter-group">
            <label className="filter-label">Liquid Capital Requirement</label>
            <select
              className="form-select filter-select"
              value={maxLiquidCapital}
              onChange={(e) => setMaxLiquidCapital(e.target.value)}
            >
              <option value="all">Any Liquid Capital</option>
              <option value="35000">Under $35,000</option>
              <option value="50000">Under $50,000</option>
              <option value="75000">Under $75,000</option>
            </select>
          </div>

          {/* Max Royalty Fee % */}
          <div className="filter-group">
            <label className="filter-label">Ongoing Royalty Fee</label>
            <select
              className="form-select filter-select"
              value={maxRoyaltyFee}
              onChange={(e) => setMaxRoyaltyFee(e.target.value)}
            >
              <option value="all">Any Royalty Rate</option>
              <option value="5.0">5.0% or Less</option>
              <option value="5.5">5.5% or Less</option>
              <option value="6.0">6.0% or Less</option>
            </select>
          </div>

          {/* Payback Months */}
          <div className="filter-group">
            <label className="filter-label">Est. Payback Horizon</label>
            <select
              className="form-select filter-select"
              value={maxPaybackMonths}
              onChange={(e) => setMaxPaybackMonths(e.target.value)}
            >
              <option value="all">Any Payback Period</option>
              <option value="18">Within 18 Months</option>
              <option value="22">Within 22 Months</option>
              <option value="26">Within 26 Months</option>
            </select>
          </div>

          {/* Apply button on mobile */}
          <div className="mobile-filter-apply-btn">
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setMobileFilterOpen(false)}
            >
              Show {filteredFranchises.length} Results
            </button>
          </div>
        </aside>

        {/* RESULTS AREA */}
        <main className="discovery-main">
          {/* Top Control Bar */}
          <div className="results-control-bar card">
            <div className="results-count-wrap">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm mobile-filter-trigger"
                onClick={() => setMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={14} />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>
              <span className="results-count">
                Showing <strong>{filteredFranchises.length}</strong> of {franchises.length} opportunities
              </span>
            </div>

            <div className="results-sort-and-view">
              <div className="sort-group">
                <span className="sort-label">Sort:</span>
                <select
                  className="form-select sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended & Featured</option>
                  <option value="payback-fast">Fastest Payback Horizon</option>
                  <option value="investment-low">Initial Capital: Low to High</option>
                  <option value="investment-high">Initial Capital: High to Low</option>
                  <option value="units-high">Most Operating Units</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Compact List View"
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges Pills */}
          {activeFiltersCount > 0 && (
            <div className="active-filters-strip">
              <span className="active-filter-title">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="filter-tag">
                  Sector: {selectedCategory}
                  <button type="button" onClick={() => handleCategorySelect('All')}><X size={11} /></button>
                </span>
              )}
              {maxInvestment !== 'all' && (
                <span className="filter-tag">
                  Capital ≤ ${parseInt(maxInvestment, 10).toLocaleString()}
                  <button type="button" onClick={() => setMaxInvestment('all')}><X size={11} /></button>
                </span>
              )}
              {maxLiquidCapital !== 'all' && (
                <span className="filter-tag">
                  Liquid ≤ ${parseInt(maxLiquidCapital, 10).toLocaleString()}
                  <button type="button" onClick={() => setMaxLiquidCapital('all')}><X size={11} /></button>
                </span>
              )}
              {maxRoyaltyFee !== 'all' && (
                <span className="filter-tag">
                  Royalty ≤ {maxRoyaltyFee}%
                  <button type="button" onClick={() => setMaxRoyaltyFee('all')}><X size={11} /></button>
                </span>
              )}
              {maxPaybackMonths !== 'all' && (
                <span className="filter-tag">
                  Payback ≤ {maxPaybackMonths} mos
                  <button type="button" onClick={() => setMaxPaybackMonths('all')}><X size={11} /></button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  Keyword: "{searchTerm}"
                  <button type="button" onClick={() => handleSearchChange('')}><X size={11} /></button>
                </span>
              )}
              <button 
                type="button" 
                className="clear-all-text-btn" 
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* RESULTS DISPLAY */}
          {filteredFranchises.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Building size={24} />
              </div>
              <h3 className="empty-state-title">No matching franchises found</h3>
              <p className="empty-state-desc">
                No opportunities meet all your selected filter criteria. Try expanding your capital range or resetting selected sector filters.
              </p>
              <button 
                type="button" 
                className="btn btn-primary btn-sm" 
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="franchises-grid">
              {filteredFranchises.map((franchise) => (
                <FranchiseCard
                  key={franchise.id}
                  franchise={franchise}
                  onOpenApply={(f) => setApplyingFranchise(f)}
                />
              ))}
            </div>
          ) : (
            /* Compact List View */
            <div className="franchises-list-view">
              {filteredFranchises.map((franchise) => (
                <div key={franchise.id} className="card list-row-card card-hover">
                  <div className="list-row-main">
                    <div className="list-row-head">
                      <span className="badge badge-neutral">{franchise.category}</span>
                      {franchise.badge && <span className="badge badge-green">{franchise.badge}</span>}
                    </div>
                    <h3 className="list-row-title">
                      <Link to={`/franchise/${franchise.id}`}>{franchise.name}</Link>
                    </h3>
                    <p className="list-row-desc">{franchise.tagline}</p>
                    <div className="list-row-sub">
                      <span>HQ: {franchise.headquarters}</span>
                      <span>•</span>
                      <span>{franchise.unitsOperating} operating units</span>
                      <span>•</span>
                      <span>Est. Payback: {franchise.paybackPeriodMonths} mos</span>
                    </div>
                  </div>

                  <div className="list-row-financials">
                    <div className="list-fin-col">
                      <span className="fin-label">Investment</span>
                      <span className="fin-val">
                        ${(franchise.initialInvestment.min / 1000).toFixed(0)}k - ${(franchise.initialInvestment.max / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="list-fin-col">
                      <span className="fin-label">Min Liquid</span>
                      <span className="fin-val">${(franchise.minLiquidCapital / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="list-fin-col">
                      <span className="fin-label">Royalty</span>
                      <span className="fin-val">{franchise.royaltyFeePercent}%</span>
                    </div>
                  </div>

                  <div className="list-row-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-soft"
                      onClick={() => setApplyingFranchise(franchise)}
                    >
                      Apply
                    </button>
                    <Link
                      to={`/franchise/${franchise.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Application Modal */}
      {applyingFranchise && (
        <ApplicationModal
          franchise={applyingFranchise}
          isOpen={!!applyingFranchise}
          onClose={() => setApplyingFranchise(null)}
        />
      )}
    </div>
  );
};
