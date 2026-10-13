import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Download, 
  Building, 
  FileText, 
  Check, 
  X, 
  DollarSign, 
  Percent,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const AdminPage = () => {
  const { 
    franchises, 
    categories, 
    applications, 
    inquiries, 
    addFranchise, 
    updateFranchise, 
    deleteFranchise, 
    updateApplicationStatus, 
    resetToDefaultData,
    addToast
  } = useFranchises();

  // Search in Admin
  const [adminSearch, setAdminSearch] = useState('');

  // Modals for CRUD
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState(null);
  const [deletingFranchiseId, setDeletingFranchiseId] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Food & Beverage',
    badge: 'New Opportunity',
    badgeType: 'green',
    headquarters: 'Austin, TX',
    unitsOperating: 25,
    minInv: 50000,
    maxInv: 120000,
    franchiseFee: 25000,
    royaltyFeePercent: 5.0,
    marketingFeePercent: 2.0,
    minLiquidCapital: 40000,
    netWorthRequired: 150000,
    spaceRequiredSqFt: '800 - 1,500 sq.ft.',
    spaceType: 'Retail Strip / Inline',
    paybackPeriodMonths: 20,
    avgAnnualGrossSales: 550000,
    avgNetProfitMargin: 22.0,
    description: '',
    whyChoose1: '',
    whyChoose2: '',
    territoriesAvailable: 'Dallas, Houston, Austin'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      tagline: '',
      category: 'Food & Beverage',
      badge: 'New Opportunity',
      badgeType: 'green',
      headquarters: 'Austin, TX',
      unitsOperating: 30,
      minInv: 60000,
      maxInv: 130000,
      franchiseFee: 28000,
      royaltyFeePercent: 5.0,
      marketingFeePercent: 2.0,
      minLiquidCapital: 45000,
      netWorthRequired: 150000,
      spaceRequiredSqFt: '800 - 1,400 sq.ft.',
      spaceType: 'Strip Center / Suburban High-Street',
      paybackPeriodMonths: 21,
      avgAnnualGrossSales: 580000,
      avgNetProfitMargin: 22.5,
      description: 'Comprehensive business model with strong market retention and lean staffing requirements.',
      whyChoose1: 'High consumer repeat rate and proprietary supply chain',
      whyChoose2: 'Turnkey site selection and commercial training',
      territoriesAvailable: 'Austin, Dallas, Denver, Phoenix'
    });
    setEditingFranchise(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFranchise(f);
    setFormData({
      name: f.name,
      tagline: f.tagline,
      category: f.category,
      badge: f.badge || '',
      badgeType: f.badgeType || 'green',
      headquarters: f.headquarters,
      unitsOperating: f.unitsOperating,
      minInv: f.initialInvestment.min,
      maxInv: f.initialInvestment.max,
      franchiseFee: f.franchiseFee,
      royaltyFeePercent: f.royaltyFeePercent,
      marketingFeePercent: f.marketingFeePercent,
      minLiquidCapital: f.minLiquidCapital,
      netWorthRequired: f.netWorthRequired,
      spaceRequiredSqFt: f.spaceRequiredSqFt,
      spaceType: f.spaceType,
      paybackPeriodMonths: f.paybackPeriodMonths,
      avgAnnualGrossSales: f.avgAnnualGrossSales,
      avgNetProfitMargin: f.avgNetProfitMargin,
      description: f.description,
      whyChoose1: f.whyChoose?.[0] || 'High repeat margins',
      whyChoose2: f.whyChoose?.[1] || 'Comprehensive training',
      territoriesAvailable: f.territoriesAvailable?.join(', ') || 'Nationwide'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveFranchise = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      category: formData.category,
      badge: formData.badge,
      badgeType: formData.badgeType,
      headquarters: formData.headquarters,
      unitsOperating: parseInt(formData.unitsOperating, 10) || 1,
      initialInvestment: {
        min: parseInt(formData.minInv, 10) || 50000,
        max: parseInt(formData.maxInv, 10) || 120000
      },
      franchiseFee: parseInt(formData.franchiseFee, 10) || 25000,
      royaltyFeePercent: parseFloat(formData.royaltyFeePercent) || 5.0,
      marketingFeePercent: parseFloat(formData.marketingFeePercent) || 2.0,
      minLiquidCapital: parseInt(formData.minLiquidCapital, 10) || 40000,
      netWorthRequired: parseInt(formData.netWorthRequired, 10) || 150000,
      spaceRequiredSqFt: formData.spaceRequiredSqFt,
      spaceType: formData.spaceType,
      paybackPeriodMonths: parseInt(formData.paybackPeriodMonths, 10) || 22,
      avgAnnualGrossSales: parseInt(formData.avgAnnualGrossSales, 10) || 500000,
      avgNetProfitMargin: parseFloat(formData.avgNetProfitMargin) || 20.0,
      description: formData.description,
      whyChoose: [formData.whyChoose1, formData.whyChoose2].filter(Boolean),
      territoriesAvailable: formData.territoriesAvailable.split(',').map((t) => t.trim()).filter(Boolean),
      trainingAndSupport: {
        initialDays: 14,
        siteAssistance: 'Turnkey demographic location assessment',
        ongoingSupport: 'Dedicated operations director and supply logistics',
        supplyChain: 'Centralized wholesale purchasing contracts'
      }
    };

    if (editingFranchise) {
      updateFranchise(editingFranchise.id, payload);
    } else {
      addFranchise(payload);
    }

    setIsAddModalOpen(false);
    setEditingFranchise(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingFranchiseId) {
      deleteFranchise(deletingFranchiseId);
      setDeletingFranchiseId(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(franchises, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'franchisetrack_catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast({
      type: 'success',
      title: 'Catalog Exported',
      message: 'Franchise directory downloaded as JSON.'
    });
  };

  const filteredFranchises = franchises.filter((f) => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="admin-page site-wrap-wide">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <span className="badge badge-green">Administrative Hub</span>
          <h1 className="page-title">Franchise Platform Management Console</h1>
          <p className="page-desc">
            Directly manage directory listings, create new franchise concepts (CRUD), update candidate review statuses, and export catalog records.
          </p>
        </div>

        <div className="admin-header-actions">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleExportJson}
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleOpenAdd}
          >
            <Plus size={14} />
            <span>Add New Franchise</span>
          </button>
        </div>
      </div>

      {/* Overview Metric KPIs */}
      <div className="admin-kpi-grid">
        <div className="card admin-kpi-card">
          <span className="a-kpi-label">Total Listed Franchises</span>
          <span className="a-kpi-val">{franchises.length}</span>
          <span className="a-kpi-hint">Active directory records</span>
        </div>

        <div className="card admin-kpi-card">
          <span className="a-kpi-label">Active Candidate Dossiers</span>
          <span className="a-kpi-val">{applications.length}</span>
          <span className="a-kpi-hint">Applications logged</span>
        </div>

        <div className="card admin-kpi-card">
          <span className="a-kpi-label">Pending Inquiries</span>
          <span className="a-kpi-val">{inquiries.length}</span>
          <span className="a-kpi-hint">Advisory messages</span>
        </div>

        <div className="card admin-kpi-card">
          <span className="a-kpi-label">Est. Capital in Pipeline</span>
          <span className="a-kpi-val">$2.85M</span>
          <span className="a-kpi-hint">Reported liquid capital</span>
        </div>
      </div>

      {/* Directory CRUD Table Card */}
      <div className="card admin-table-card">
        <div className="admin-table-head flex-between">
          <div className="table-head-info">
            <h3 className="admin-table-title">Franchise Catalog Management</h3>
            <span className="admin-table-sub">Manage, edit, or remove published brands from the active catalog</span>
          </div>

          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              type="text"
              className="form-input admin-search-input"
              placeholder="Filter brand by name..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Category</th>
                <th>Investment Range</th>
                <th>Royalty</th>
                <th>Liquid Req.</th>
                <th>Units</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranchises.map((f) => (
                <tr key={f.id}>
                  <td>
                    <div className="admin-brand-cell">
                      <strong>{f.name}</strong>
                      <span className="admin-brand-tagline">{f.tagline}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{f.category}</span>
                  </td>
                  <td>
                    {formatCurrency(f.initialInvestment.min)} - {formatCurrency(f.initialInvestment.max)}
                  </td>
                  <td><strong>{f.royaltyFeePercent}%</strong></td>
                  <td>{formatCurrency(f.minLiquidCapital)}</td>
                  <td>{f.unitsOperating}</td>
                  <td>
                    <span className="status-pill success">{f.status || 'Active'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => handleOpenEdit(f)}
                        title="Edit Franchise Listing"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={() => setDeletingFranchiseId(f.id)}
                        title="Delete Franchise"
                        style={{ color: 'var(--status-danger-text)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Applications Quick Status Manager */}
      <div className="card admin-table-card" style={{ marginTop: 24 }}>
        <div className="admin-table-head flex-between">
          <div>
            <h3 className="admin-table-title">Global Candidate Applications Status Manager</h3>
            <span className="admin-table-sub">Directly adjust candidate status across all brands</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate</th>
                <th>Target Franchise</th>
                <th>Market Territory</th>
                <th>Current Status</th>
                <th style={{ textAlign: 'right' }}>Quick Update Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td><strong>{app.id}</strong></td>
                  <td>{app.applicantName}</td>
                  <td>{app.franchiseName}</td>
                  <td>{app.targetLocation}</td>
                  <td>
                    <span className="status-pill info">{app.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      className="form-select"
                      style={{ width: 'auto', display: 'inline-block', fontSize: '13px', padding: '4px 10px' }}
                      value={app.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        let stIdx = 1;
                        if (val === 'Qualification Review') stIdx = 2;
                        if (val === 'Discovery Day & Interview') stIdx = 3;
                        if (val === 'Territory Due Diligence') stIdx = 4;
                        if (val === 'Agreement & Onboarding') stIdx = 5;
                        updateApplicationStatus(app.id, val, stIdx, 'Admin updated status via platform console.');
                      }}
                    >
                      <option value="Submitted">Submitted (Stage 1)</option>
                      <option value="Qualification Review">Qualification Review (Stage 2)</option>
                      <option value="Discovery Day & Interview">Discovery Day (Stage 3)</option>
                      <option value="Territory Due Diligence">Territory Diligence (Stage 4)</option>
                      <option value="Agreement & Onboarding">Agreement & Onboarding (Stage 5)</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Reset Box */}
      <div className="card admin-maintenance-card" style={{ marginTop: 24 }}>
        <div className="maintenance-content flex-between">
          <div>
            <h4>Prototype Dataset Maintenance</h4>
            <p>Restore the directory catalog, applications, and saved bookmarks back to pristine default state.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={resetToDefaultData}
          >
            <RotateCcw size={14} />
            <span>Restore Default Sample Data</span>
          </button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog admin-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <div>
                <span className="badge badge-green">{editingFranchise ? 'Edit Listing' : 'New Listing'}</span>
                <h3 className="modal-title">
                  {editingFranchise ? `Edit: ${editingFranchise.name}` : 'Add Franchise to Directory'}
                </h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFranchise} className="modal-body">
              <div className="form-group">
                <label className="form-label form-label-required">Franchise Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. BlueSky Solar Cleaners"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Short Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="One sentence value proposition..."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category Sector</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Tag Badge</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. High Cashflow, Fast Payback"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Headquarters Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Active Operating Units</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.unitsOperating}
                    onChange={(e) => setFormData({ ...formData, unitsOperating: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Min Investment ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minInv}
                    onChange={(e) => setFormData({ ...formData, minInv: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Investment ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.maxInv}
                    onChange={(e) => setFormData({ ...formData, maxInv: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Initial Franchise Fee ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.franchiseFee}
                    onChange={(e) => setFormData({ ...formData, franchiseFee: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Royalty Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={formData.royaltyFeePercent}
                    onChange={(e) => setFormData({ ...formData, royaltyFeePercent: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Min Liquid Capital ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minLiquidCapital}
                    onChange={(e) => setFormData({ ...formData, minLiquidCapital: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Est. Payback Months</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.paybackPeriodMonths}
                    onChange={(e) => setFormData({ ...formData, paybackPeriodMonths: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Concept Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Target Territories (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.territoriesAvailable}
                  onChange={(e) => setFormData({ ...formData, territoriesAvailable: e.target.value })}
                />
              </div>

              <div className="modal-footer-nav flex-between">
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={14} />
                  <span>{editingFranchise ? 'Update Listing' : 'Publish Franchise'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingFranchiseId && (
        <div className="modal-overlay" onClick={() => setDeletingFranchiseId(null)}>
          <div className="modal-dialog" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h3 className="modal-title">Confirm Deletion</h3>
              <button type="button" className="modal-close-btn" onClick={() => setDeletingFranchiseId(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                Are you sure you want to remove this franchise from the catalog? It will be removed from directory search, comparison, and saved lists immediately.
              </p>
              <div className="modal-footer-nav flex-between">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setDeletingFranchiseId(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--status-danger-text)' }}
                  onClick={handleDeleteConfirm}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
