import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Building, 
  Filter, 
  MessageSquare,
  AlertCircle,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { APPLICATION_STAGES } from '../data/franchisesData';

export const BrandPortalPage = () => {
  const { 
    applications, 
    updateApplicationStatus, 
    franchises, 
    addToast 
  } = useFranchises();

  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (selectedBrandFilter !== 'all' && app.franchiseId !== selectedBrandFilter) return false;
    if (selectedStageFilter !== 'all' && app.status !== selectedStageFilter) return false;
    return true;
  });

  const handleAdvanceStage = (app) => {
    const nextStageIdx = Math.min((app.stageIndex || 1) + 1, 5);
    const nextStage = APPLICATION_STAGES.find((s) => s.step === nextStageIdx);
    if (!nextStage) return;

    updateApplicationStatus(
      app.id, 
      nextStage.label, 
      nextStageIdx, 
      `Candidate advanced to ${nextStage.label} by Brand Director.`
    );
  };

  const handleDecline = (app) => {
    updateApplicationStatus(
      app.id,
      'Declined',
      app.stageIndex,
      'Candidate did not meet required liquid capital or territory constraints.'
    );
  };

  return (
    <div className="brand-portal-page site-wrap-wide">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <span className="badge badge-lavender">Franchisor Brand Hub</span>
          <h1 className="page-title">Candidate Pipeline & Development Console</h1>
          <p className="page-desc">
            Review incoming franchisee qualification dossiers, advance candidates across verification milestones, and manage territory allocations.
          </p>
        </div>

        <div className="header-badge-summary">
          <span className="badge badge-green">Pipeline Active</span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="brand-kpi-grid">
        <div className="card brand-kpi-card">
          <span className="b-kpi-label">Active Candidate Dossiers</span>
          <span className="b-kpi-val">{applications.length}</span>
          <span className="b-kpi-hint">Applications under review</span>
        </div>

        <div className="card brand-kpi-card">
          <span className="b-kpi-label">Qualification Review</span>
          <span className="b-kpi-val">
            {applications.filter((a) => a.stageIndex === 2).length}
          </span>
          <span className="b-kpi-hint">FDD item evaluation</span>
        </div>

        <div className="card brand-kpi-card">
          <span className="b-kpi-label">Territory Diligence</span>
          <span className="b-kpi-val">
            {applications.filter((a) => a.stageIndex === 4).length}
          </span>
          <span className="b-kpi-hint">Site feasibility audit</span>
        </div>

        <div className="card brand-kpi-card">
          <span className="b-kpi-label">Average Qualification Rate</span>
          <span className="b-kpi-val">76.4%</span>
          <span className="b-kpi-hint">Meets minimum liquid cash</span>
        </div>
      </div>

      {/* Filters & Pipeline Table Card */}
      <div className="card brand-pipeline-card">
        <div className="pipeline-controls-bar flex-between">
          <div className="pipeline-title-group">
            <h3 className="pipeline-title">Candidate Review Queue</h3>
            <span className="pipeline-count">{filteredApps.length} candidates in view</span>
          </div>

          <div className="pipeline-filters-group">
            <select
              className="form-select filter-select-sm"
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
            >
              <option value="all">All Brands</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>

            <select
              className="form-select filter-select-sm"
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              {APPLICATION_STAGES.map((s) => (
                <option key={s.step} value={s.label}>{s.label}</option>
              ))}
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="empty-state" style={{ margin: '24px 0' }}>
            <Users size={24} />
            <h4 className="empty-state-title">No candidates match filters</h4>
            <p className="empty-state-desc">Try clearing selected brand or stage filters to view all dossiers.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Candidate</th>
                  <th>Franchise Concept</th>
                  <th>Target Market</th>
                  <th>Reported Capital</th>
                  <th>Current Stage</th>
                  <th>Last Update</th>
                  <th style={{ textAlign: 'right' }}>Candidate Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const stageIdx = app.stageIndex || 1;
                  const isFinal = stageIdx >= 5;
                  return (
                    <tr key={app.id}>
                      <td><strong>{app.id}</strong></td>
                      <td>
                        <div className="candidate-cell">
                          <strong>{app.applicantName}</strong>
                          <span className="candidate-email">{app.applicantEmail}</span>
                        </div>
                      </td>
                      <td>{app.franchiseName}</td>
                      <td>{app.targetLocation}</td>
                      <td><strong>{app.liquidCapital}</strong></td>
                      <td>
                        <span className="status-pill info">
                          Stage {stageIdx}: {app.status}
                        </span>
                      </td>
                      <td>{app.lastUpdated}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="pipeline-btn-group">
                          {!isFinal && app.status !== 'Declined' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAdvanceStage(app)}
                              title="Advance Candidate to Next Review Milestone"
                            >
                              <span>Advance Stage</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                          {app.status !== 'Declined' && !isFinal && (
                            <button
                              type="button"
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleDecline(app)}
                              title="Decline Candidate Dossier"
                              style={{ color: 'var(--status-danger-text)' }}
                            >
                              Decline
                            </button>
                          )}
                          {isFinal && (
                            <span className="badge badge-green">Ready to Sign</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Brand Development Guidance */}
      <div className="alert-box alert-info" style={{ marginTop: 24 }}>
        <Briefcase size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Brand Franchise Development Workflow Notice:</strong>
          <p style={{ marginTop: 4, fontSize: '13px' }}>
            Advancing a candidate automatically logs the milestone transition in real-time, syncs state to the candidate's investor dashboard, and appends a verified audit log entry.
          </p>
        </div>
      </div>
    </div>
  );
};
