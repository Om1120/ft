import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, User, DollarSign, MapPin, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFranchises } from '../context/FranchiseContext';

export const ApplicationModal = ({ franchise, isOpen, onClose }) => {
  const { submitApplication } = useFranchises();
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    currentLocation: '',
    liquidCapital: '$50,000 - $100,000',
    netWorth: '$200,000 - $500,000',
    fundingSource: 'Personal Savings / Home Equity',
    targetLocation: '',
    timeline: '3 to 6 months',
    involvementModel: 'Active Owner-Operator',
    hasCommercialRealEstate: 'No',
    experience: '',
    disclaimerAgreed: false
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !franchise) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.applicantName.trim()) newErrors.applicantName = 'Full legal name is required';
      if (!formData.applicantEmail.trim() || !formData.applicantEmail.includes('@')) {
        newErrors.applicantEmail = 'A valid email address is required';
      }
      if (!formData.applicantPhone.trim() || formData.applicantPhone.length < 7) {
        newErrors.applicantPhone = 'A valid phone number is required';
      }
      if (!formData.currentLocation.trim()) {
        newErrors.currentLocation = 'Current residence city/state is required';
      }
    } else if (step === 2) {
      if (!formData.liquidCapital) newErrors.liquidCapital = 'Please select available liquid capital';
      if (!formData.fundingSource) newErrors.fundingSource = 'Please specify primary funding source';
    } else if (step === 3) {
      if (!formData.targetLocation.trim()) {
        newErrors.targetLocation = 'Target franchise development territory is required';
      }
      if (!formData.experience.trim()) {
        newErrors.experience = 'Please provide brief operational or business management background';
      }
    } else if (step === 4) {
      if (!formData.disclaimerAgreed) {
        newErrors.disclaimerAgreed = 'You must acknowledge the disclosure statement to proceed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const payload = {
      franchiseId: franchise.id,
      franchiseName: franchise.name,
      ...formData
    };

    const created = submitApplication(payload);
    setSubmittedApp(created);

    // Micro-interaction: celebratory confetti burst
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#668575', '#E8F0EA', '#E8EFF7', '#F5EFE5']
      });
    } catch {
      // safe fallback
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setSubmittedApp(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-dialog application-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header flex-between">
          <div>
            <span className="badge badge-green">Candidate Application Flow</span>
            <h3 className="modal-title">Apply for {franchise.name}</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={handleResetAndClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {submittedApp ? (
          /* Confirmation Success Screen */
          <div className="application-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={48} color="var(--color-primary)" />
            </div>
            <h3>Application Successfully Registered</h3>
            <p className="app-ref-line">
              Reference Identifier: <strong>{submittedApp.id}</strong>
            </p>
            <p className="app-success-text">
              Thank you, <strong>{submittedApp.applicantName}</strong>. Your franchise qualification dossier for{' '}
              <strong>{franchise.name}</strong> has been logged into the candidate review pipeline. You can follow each milestone of your application through the Investor Dashboard.
            </p>

            <div className="next-steps-card">
              <h4>Review Timeline & Next Steps</h4>
              <ul>
                <li>
                  <strong>1. Preliminary FDD Packet:</strong> Standard regulatory disclosure materials are being prepared for your target territory: <em>{submittedApp.targetLocation}</em>.
                </li>
                <li>
                  <strong>2. Qualification Evaluation:</strong> Brand development directors review liquid capital verification within 2 business days.
                </li>
                <li>
                  <strong>3. Introductory Discovery Call:</strong> You will be notified via email ({submittedApp.applicantEmail}) to select an interview slot.
                </li>
              </ul>
            </div>

            <div className="modal-footer-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleResetAndClose}
              >
                Close & Continue Browsing
              </button>
              <a 
                href="/dashboard" 
                className="btn btn-primary"
                onClick={handleResetAndClose}
              >
                Go to Investor Dashboard
              </a>
            </div>
          </div>
        ) : (
          /* Step-by-Step Application Form */
          <div className="modal-body">
            {/* Step Indicators */}
            <div className="stepper-bar">
              <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStep > 1 ? <Check size={12} /> : 1}</div>
                <span className="step-label">Contact</span>
              </div>
              <div className="step-connector" />
              <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStep > 2 ? <Check size={12} /> : 2}</div>
                <span className="step-label">Financials</span>
              </div>
              <div className="step-connector" />
              <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStep > 3 ? <Check size={12} /> : 3}</div>
                <span className="step-label">Territory</span>
              </div>
              <div className="step-connector" />
              <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span className="step-label">Review</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="step-form-content">
              {/* STEP 1: Personal Contact */}
              {currentStep === 1 && (
                <div className="form-step-section">
                  <div className="step-header">
                    <h4>Personal Information & Contact</h4>
                    <p>Provide your primary contact coordinates for official franchise disclosures.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Full Legal Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.applicantName}
                      onChange={(e) => handleChange('applicantName', e.target.value)}
                    />
                    {errors.applicantName && <span className="form-error">{errors.applicantName}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label form-label-required">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. eleanor@example.com"
                        value={formData.applicantEmail}
                        onChange={(e) => handleChange('applicantEmail', e.target.value)}
                      />
                      {errors.applicantEmail && <span className="form-error">{errors.applicantEmail}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-required">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. (555) 234-5678"
                        value={formData.applicantPhone}
                        onChange={(e) => handleChange('applicantPhone', e.target.value)}
                      />
                      {errors.applicantPhone && <span className="form-error">{errors.applicantPhone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Current City & State</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Denver, CO"
                      value={formData.currentLocation}
                      onChange={(e) => handleChange('currentLocation', e.target.value)}
                    />
                    {errors.currentLocation && <span className="form-error">{errors.currentLocation}</span>}
                  </div>
                </div>
              )}

              {/* STEP 2: Financial Qualification */}
              {currentStep === 2 && (
                <div className="form-step-section">
                  <div className="step-header">
                    <h4>Financial Qualification</h4>
                    <p>
                      {franchise.name} requires a minimum liquid capital of{' '}
                      <strong>${franchise.minLiquidCapital.toLocaleString()}</strong>.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Available Liquid Assets (Cash, Stocks, Money Market)</label>
                    <select
                      className="form-select"
                      value={formData.liquidCapital}
                      onChange={(e) => handleChange('liquidCapital', e.target.value)}
                    >
                      <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                      <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                      <option value="$500,000+">$500,000+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Estimated Total Net Worth</label>
                    <select
                      className="form-select"
                      value={formData.netWorth}
                      onChange={(e) => handleChange('netWorth', e.target.value)}
                    >
                      <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                      <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                      <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                      <option value="$1,000,000+">$1,000,000+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Primary Capital Funding Source</label>
                    <select
                      className="form-select"
                      value={formData.fundingSource}
                      onChange={(e) => handleChange('fundingSource', e.target.value)}
                    >
                      <option value="Personal Savings / Cash Reserve">Personal Savings / Cash Reserve</option>
                      <option value="SBA / Commercial Bank Loan">SBA / Commercial Bank Loan</option>
                      <option value="401(k) / ROBS Rollover">401(k) / ROBS Rollover</option>
                      <option value="Investment Partners / Family Office">Investment Partners / Family Office</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Territory & Experience */}
              {currentStep === 3 && (
                <div className="form-step-section">
                  <div className="step-header">
                    <h4>Target Territory & Operating Background</h4>
                    <p>Help the franchise brand evaluate your local market plan and leadership suitability.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Target Territory / City for Development</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. North Austin / Round Rock Metro"
                      value={formData.targetLocation}
                      onChange={(e) => handleChange('targetLocation', e.target.value)}
                    />
                    {errors.targetLocation && <span className="form-error">{errors.targetLocation}</span>}
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label form-label-required">Intended Operating Involvement</label>
                      <select
                        className="form-select"
                        value={formData.involvementModel}
                        onChange={(e) => handleChange('involvementModel', e.target.value)}
                      >
                        <option value="Active Owner-Operator">Active Owner-Operator (Hands-On)</option>
                        <option value="Semi-Absentee (General Manager Led)">Semi-Absentee (General Manager Led)</option>
                        <option value="Multi-Unit Investor / Regional Developer">Multi-Unit Investor / Regional Developer</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-required">Investment Timeline</label>
                      <select
                        className="form-select"
                        value={formData.timeline}
                        onChange={(e) => handleChange('timeline', e.target.value)}
                      >
                        <option value="Immediately (0 - 3 months)">Immediately (0 - 3 months)</option>
                        <option value="3 to 6 months">3 to 6 months</option>
                        <option value="6 to 12 months">6 to 12 months</option>
                        <option value="Exploratory (1+ year)">Exploratory (1+ year)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Relevant Business / Leadership Experience</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Briefly describe your career background, management experience, or previous business ownership..."
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                    />
                    {errors.experience && <span className="form-error">{errors.experience}</span>}
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Legal Disclaimer Agreement */}
              {currentStep === 4 && (
                <div className="form-step-section">
                  <div className="step-header">
                    <h4>Review & Final Confirmation</h4>
                    <p>Verify your application details before registering your candidate dossier.</p>
                  </div>

                  <div className="summary-box">
                    <div className="summary-row">
                      <span className="summary-label">Target Franchise:</span>
                      <strong>{franchise.name}</strong>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Applicant:</span>
                      <span>{formData.applicantName} ({formData.applicantEmail})</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Target Territory:</span>
                      <span>{formData.targetLocation}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Reported Liquid Capital:</span>
                      <span>{formData.liquidCapital}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Involvement Model:</span>
                      <span>{formData.involvementModel}</span>
                    </div>
                  </div>

                  <div className="alert-box alert-disclaimer">
                    <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Educational Prototype Disclosure Statement:</strong>
                      <p style={{ marginTop: 4, fontSize: '12.5px' }}>
                        By submitting this application form, you confirm that all provided figures are for demonstration and prototype modeling purposes. This submission does not execute a franchise agreement, nor does it guarantee approval from {franchise.name}.
                      </p>
                    </div>
                  </div>

                  <div className="agreement-checkbox-wrap">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.disclaimerAgreed}
                        onChange={(e) => handleChange('disclaimerAgreed', e.target.checked)}
                      />
                      <span>
                        I understand this is a demonstration candidate workflow and agree to transmit my profile details to the platform review queue.
                      </span>
                    </label>
                    {errors.disclaimerAgreed && <span className="form-error">{errors.disclaimerAgreed}</span>}
                  </div>
                </div>
              )}

              {/* Modal Navigation Buttons */}
              <div className="modal-footer-nav flex-between">
                {currentStep > 1 ? (
                  <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                    <ArrowLeft size={14} />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={handleResetAndClose}>
                    Cancel
                  </button>
                )}

                {currentStep < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <Check size={14} />
                    <span>Confirm & Submit Application</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
