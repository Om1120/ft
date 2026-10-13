import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  X, 
  Plus, 
  ArrowRight, 
  Check, 
  Building, 
  DollarSign, 
  Clock, 
  Maximize2,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { ApplicationModal } from '../components/ApplicationModal';

export const ComparePage = () => {
  const { 
    franchises, 
    compareList, 
    addToCompare, 
    removeFromCompare, 
    clearCompare 
  } = useFranchises();

  const [addFranchiseSelectId, setAddFranchiseSelectId] = useState('');
  const [activeApplyFranchise, setActiveApplyFranchise] = useState(null);

  // Selected franchises
  const comparedFranchises = franchises.filter((f) => compareList.includes(f.id));

  // Available to add (not yet in compare)
  const availableToAdd = franchises.filter((f) => !compareList.includes(f.id));

  const handleAddSelect = (e) => {
    const id = e.target.value;
    if (id) {
      addToCompare(id);
      setAddFranchiseSelectId('');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="compare-page site-wrap-wide">
      {/* Page Header */}
      <div className="page-header flex-between">
        <div>
          <span className="badge badge-neutral">Side-by-Side Analysis</span>
          <h1 className="page-title">Franchise Comparison Matrix</h1>
          <p className="page-desc">
            Compare unit economics, fee structures, square footage footprints, and estimated payback timelines across selected brands.
          </p>
        </div>

        {comparedFranchises.length > 0 && (
          <div className="compare-header-controls">
            {availableToAdd.length > 0 && comparedFranchises.length < 4 && (
              <div className="add-compare-dropdown-wrap">
                <select
                  className="form-select add-compare-select"
                  value={addFranchiseSelectId}
                  onChange={handleAddSelect}
                >
                  <option value="">+ Add Another Franchise...</option>
                  {availableToAdd.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={clearCompare}
              title="Clear all compared items"
            >
              <RotateCcw size={14} />
              <span>Clear Matrix</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {comparedFranchises.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Scale size={28} />
          </div>
          <h3 className="empty-state-title">No franchises in comparison</h3>
          <p className="empty-state-desc">
            Select 2 to 4 franchise opportunities from the directory to analyze their fees, capital requirements, and pro-forma projections side by side.
          </p>
          <div className="empty-state-actions">
            <Link to="/franchises" className="btn btn-primary">
              Browse Franchise Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="compare-table-wrapper card">
          <div className="table-responsive">
            <table className="compare-matrix-table">
              <thead>
                <tr>
                  <th className="feature-col-header">Comparison Metric</th>
                  {comparedFranchises.map((f) => (
                    <th key={f.id} className="franchise-col-header">
                      <div className="matrix-brand-head">
                        <button
                          type="button"
                          className="matrix-remove-btn"
                          onClick={() => removeFromCompare(f.id)}
                          title={`Remove ${f.name} from comparison`}
                        >
                          <X size={14} />
                        </button>
                        <span className="badge badge-neutral">{f.category}</span>
                        <h4 className="matrix-brand-title">
                          <Link to={`/franchise/${f.id}`}>{f.name}</Link>
                        </h4>
                        <span className="matrix-units-tag">{f.unitsOperating} units</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Total Investment */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Total Initial Investment</strong>
                    <span className="metric-hint">Buildout, equipment & working capital</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell highlight">
                      {formatCurrency(f.initialInvestment.min)} - {formatCurrency(f.initialInvestment.max)}
                    </td>
                  ))}
                </tr>

                {/* Initial Franchise Fee */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Franchise Fee</strong>
                    <span className="metric-hint">Paid at agreement execution</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {formatCurrency(f.franchiseFee)}
                    </td>
                  ))}
                </tr>

                {/* Royalty Fee % */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Ongoing Royalty Fee</strong>
                    <span className="metric-hint">% of gross monthly revenues</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      <strong>{f.royaltyFeePercent}%</strong>
                    </td>
                  ))}
                </tr>

                {/* Marketing / Ad Fund % */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Brand Ad / Marketing Fund</strong>
                    <span className="metric-hint">Brand marketing contribution</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {f.marketingFeePercent}%
                    </td>
                  ))}
                </tr>

                {/* Min Liquid Capital */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Min Liquid Capital</strong>
                    <span className="metric-hint">Required cash/marketable reserves</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {formatCurrency(f.minLiquidCapital)}
                    </td>
                  ))}
                </tr>

                {/* Net Worth */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Net Worth Requirement</strong>
                    <span className="metric-hint">Minimum net assets</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {formatCurrency(f.netWorthRequired)}
                    </td>
                  ))}
                </tr>

                {/* Estimated Payback Horizon */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Est. Payback Horizon</strong>
                    <span className="metric-hint">Average historical unit breakeven</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell highlight">
                      <strong>{f.paybackPeriodMonths} Months</strong>
                    </td>
                  ))}
                </tr>

                {/* Avg Gross Sales */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Avg. Annual Unit Sales</strong>
                    <span className="metric-hint">Representative unit gross sales</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {formatCurrency(f.avgAnnualGrossSales)}
                    </td>
                  ))}
                </tr>

                {/* Space & Footprint */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Space Requirement</strong>
                    <span className="metric-hint">Real estate footprint</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {f.spaceRequiredSqFt}
                    </td>
                  ))}
                </tr>

                {/* Facility Format */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Real Estate Format</strong>
                    <span className="metric-hint">Site & building characteristics</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {f.spaceType}
                    </td>
                  ))}
                </tr>

                {/* Training Days */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Initial Training</strong>
                    <span className="metric-hint">Classroom & on-site prep</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {f.trainingAndSupport.initialDays} Days
                    </td>
                  ))}
                </tr>

                {/* Financing Support */}
                <tr>
                  <td className="metric-title-cell">
                    <strong>Financing Assistance</strong>
                    <span className="metric-hint">SBA lender partnerships</span>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-val-cell">
                      {f.financingAvailable ? 'Yes (3rd-Party SBA)' : 'No'}
                    </td>
                  ))}
                </tr>

                {/* Action CTA Row */}
                <tr className="matrix-action-row">
                  <td className="metric-title-cell">
                    <strong>Candidate Actions</strong>
                  </td>
                  {comparedFranchises.map((f) => (
                    <td key={f.id} className="metric-action-cell">
                      <div className="matrix-btn-group">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveApplyFranchise(f)}
                        >
                          Apply Now
                        </button>
                        <Link
                          to={`/franchise/${f.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Full Profile
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {activeApplyFranchise && (
        <ApplicationModal
          franchise={activeApplyFranchise}
          isOpen={!!activeApplyFranchise}
          onClose={() => setActiveApplyFranchise(null)}
        />
      )}
    </div>
  );
};
