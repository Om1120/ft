import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  AlertCircle, 
  DollarSign, 
  MapPin, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';
import { APPLICATION_STAGES } from '../data/franchisesData';
import { FranchiseCard } from '../components/FranchiseCard';

export const DashboardPage = () => {
  const { 
    franchises, 
    applications, 
    favorites, 
    inquiries, 
    toggleFavorite,
    addToast
  } = useFranchises();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'favorites' | 'inquiries' | 'profile'
  const [userProfile, setUserProfile] = useState({
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '(512) 892-4102',
    targetLocation: 'Austin / Central Texas Metro',
    availableLiquid: '$100,000 - $250,000',
    netWorth: '$250,000 - $500,000',
    primaryGoal: 'Semi-Absentee Portfolio Development'
  });

  const savedFranchises = franchises.filter((f) => favorites.includes(f.id));

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your investor readiness criteria have been saved.'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted': return 'status-pill info';
      case 'Qualification Review': return 'status-pill warning';
      case 'Discovery Day & Interview': return 'status-pill warning';
      case 'Territory Due Diligence': return 'status-pill info';
      case 'Agreement & Onboarding': return 'status-pill success';
      default: return 'status-pill success';
    }
  };

  return (
    <div className="dashboard-page site-wrap-wide">
      {/* Top Welcome Card */}
      <div className="card dashboard-welcome-card">
        <div className="dash-welcome-left">
          <div className="user-avatar-box">
            <User size={24} />
          </div>
          <div>
            <span className="badge badge-green">Candidate Portal</span>
            <h1 className="dash-welcome-title">Welcome back, {userProfile.name}</h1>
            <p className="dash-welcome-sub">
              Monitor active franchise candidate dossiers, track due diligence milestones, and manage your portfolio bookmarks.
            </p>
          </div>
        </div>

        <div className="dash-top-metrics">
          <div className="dash-metric-card">
            <span className="dash-metric-num">{applications.length}</span>
            <span className="dash-metric-label">Applications</span>
          </div>
          <div className="dash-metric-card">
            <span className="dash-metric-num">{favorites.length}</span>
            <span className="dash-metric-label">Saved Brands</span>
          </div>
          <div className="dash-metric-card">
            <span className="dash-metric-num">{inquiries.length}</span>
            <span className="dash-metric-label">Inquiries</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dash-tabs-bar">
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileText size={16} />
          <span>Active Applications ({applications.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Bookmark size={16} />
          <span>Saved Franchises ({favorites.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <Clock size={16} />
          <span>Advisory Inquiries ({inquiries.length})</span>
        </button>

        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} />
          <span>Investor Profile</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS TRACKER */}
      {activeTab === 'applications' && (
        <div className="dash-tab-content">
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={24} />
              </div>
              <h3 className="empty-state-title">No Active Franchise Applications</h3>
              <p className="empty-state-desc">
                You haven't submitted any candidate dossiers yet. Discover top franchise opportunities and apply directly through our verified portal.
              </p>
              <Link to="/franchises" className="btn btn-primary btn-sm">
                Explore Franchise Directory
              </Link>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => {
                const currentStageIdx = app.stageIndex || 1;
                return (
                  <div key={app.id} className="card application-item-card">
                    <div className="app-card-header flex-between">
                      <div className="app-brand-info">
                        <span className="app-ref-id">{app.id}</span>
                        <h3 className="app-brand-title">
                          <Link to={`/franchise/${app.franchiseId}`}>{app.franchiseName}</Link>
                        </h3>
                        <div className="app-meta-pills">
                          <span className="app-pill">
                            <MapPin size={12} />
                            <span>Target: {app.targetLocation || 'Open Market'}</span>
                          </span>
                          <span className="app-pill">
                            <span>Submitted: {app.submittedDate}</span>
                          </span>
                          <span className="app-pill">
                            <span>Last Updated: {app.lastUpdated}</span>
                          </span>
                        </div>
                      </div>

                      <div className="app-status-badge-wrap">
                        <span className={getStatusBadgeClass(app.status)}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* 5-Step Visual Progress Stepper */}
                    <div className="app-progress-timeline">
                      <div className="timeline-steps-track">
                        {APPLICATION_STAGES.map((st) => {
                          const isDone = st.step < currentStageIdx;
                          const isCurrent = st.step === currentStageIdx;
                          return (
                            <div 
                              key={st.step} 
                              className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                              <div className="timeline-circle">
                                {isDone ? <Check size={12} /> : st.step}
                              </div>
                              <span className="timeline-label">{st.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress Notes & Brand Feedback */}
                    <div className="app-notes-box">
                      <div className="notes-header flex-between">
                        <strong>Franchise Brand Review Notes & Milestones:</strong>
                        <span className="notes-stage-tag">Stage {currentStageIdx} of 5</span>
                      </div>
                      <p className="notes-text">{app.notes || 'Application logged. Brand team reviewing candidate credentials.'}</p>
                    </div>

                    {/* Bottom Action bar */}
                    <div className="app-card-footer flex-between">
                      <div className="app-applicant-summary">
                        <span>Applicant: <strong>{app.applicantName}</strong></span>
                        <span className="divider">•</span>
                        <span>Liquid Capital: <strong>{app.liquidCapital}</strong></span>
                      </div>
                      <div className="app-action-links">
                        <Link to={`/franchise/${app.franchiseId}`} className="btn btn-secondary btn-sm">
                          <span>View Brand Profile</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED FRANCHISES */}
      {activeTab === 'favorites' && (
        <div className="dash-tab-content">
          {savedFranchises.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Bookmark size={24} />
              </div>
              <h3 className="empty-state-title">No Saved Franchises</h3>
              <p className="empty-state-desc">
                You haven't bookmarked any opportunities yet. Click the bookmark icon on any franchise card in the directory to save it to your portfolio.
              </p>
              <Link to="/franchises" className="btn btn-primary btn-sm">
                Browse Directory
              </Link>
            </div>
          ) : (
            <div>
              <div className="tab-actions-bar flex-between" style={{ marginBottom: 16 }}>
                <span className="tab-summary-text">
                  You have saved <strong>{savedFranchises.length}</strong> franchise opportunities for consideration.
                </span>
                <Link to="/compare" className="btn btn-secondary btn-sm">
                  <span>Compare All Saved</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="franchises-grid">
                {savedFranchises.map((f) => (
                  <FranchiseCard key={f.id} franchise={f} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADVISORY INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="dash-tab-content">
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Clock size={24} />
              </div>
              <h3 className="empty-state-title">No Inquiries Submitted</h3>
              <p className="empty-state-desc">
                Submit questions regarding territory availability or commercial terms using our inquiry tools.
              </p>
              <Link to="/contact" className="btn btn-primary btn-sm">
                Request Advisory Consultation
              </Link>
            </div>
          ) : (
            <div className="card inquiries-table-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Inquiry ID</th>
                      <th>Target Brand / Subject</th>
                      <th>Market Location</th>
                      <th>Message Snippet</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td><strong>{inq.id}</strong></td>
                        <td>{inq.franchiseName}</td>
                        <td>{inq.location || 'General'}</td>
                        <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {inq.message}
                        </td>
                        <td>{inq.date}</td>
                        <td>
                          <span className={`status-pill ${inq.status === 'Replied' ? 'success' : 'info'}`}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INVESTOR PROFILE */}
      {activeTab === 'profile' && (
        <div className="dash-tab-content">
          <div className="card profile-card" style={{ maxWidth: 720 }}>
            <h3 className="profile-card-title">Investor Readiness & Financial Profile</h3>
            <p className="profile-card-desc">
              Your profile coordinates are automatically attached to candidate disclosures when you apply for franchise opportunities.
            </p>

            <form onSubmit={handleProfileSave} className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Target Expansion Market</label>
                <input
                  type="text"
                  className="form-input"
                  value={userProfile.targetLocation}
                  onChange={(e) => setUserProfile({ ...userProfile, targetLocation: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Available Liquid Assets</label>
                  <select
                    className="form-select"
                    value={userProfile.availableLiquid}
                    onChange={(e) => setUserProfile({ ...userProfile, availableLiquid: e.target.value })}
                  >
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                    <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                    <option value="$250,000+">$250,000+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Net Worth Tier</label>
                  <select
                    className="form-select"
                    value={userProfile.netWorth}
                    onChange={(e) => setUserProfile({ ...userProfile, netWorth: e.target.value })}
                  >
                    <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                    <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                    <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                    <option value="$1,000,000+">$1,000,000+</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Investment Objectives</label>
                <input
                  type="text"
                  className="form-input"
                  value={userProfile.primaryGoal}
                  onChange={(e) => setUserProfile({ ...userProfile, primaryGoal: e.target.value })}
                />
              </div>

              <div className="profile-btn-row">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
