import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const ContactPage = () => {
  const { submitInquiry } = useFranchises();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Advisory Inquiry',
    location: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email address is required';
    if (!formData.message.trim()) errs.message = 'Please provide details of your inquiry';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitInquiry({
      franchiseName: formData.subject,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || 'General',
      message: formData.message
    });

    setIsSuccess(true);
  };

  return (
    <div className="contact-page site-wrap">
      <div className="page-header text-center-wrap">
        <span className="badge badge-blue">Franchise Advisory</span>
        <h1 className="page-title">Connect with a Franchise Development Specialist</h1>
        <p className="page-desc">
          Schedule an introductory consultation, request territorial feasibility analysis, or inquire about platform directory listings.
        </p>
      </div>

      <div className="contact-layout-grid">
        {/* Contact Coordinates Info Card */}
        <div className="card contact-info-card">
          <h3 className="info-card-title">Advisory Headquarters</h3>
          <p className="info-card-desc">
            Our franchise analysts evaluate FDD disclosures, market demographics, and multi-unit territory availability nationwide.
          </p>

          <div className="contact-points-list">
            <div className="contact-point-item">
              <div className="point-icon"><Mail size={16} /></div>
              <div>
                <span className="point-label">Advisory Inquiries</span>
                <span className="point-val">advisors@franchisetrack.internal</span>
              </div>
            </div>

            <div className="contact-point-item">
              <div className="point-icon"><Phone size={16} /></div>
              <div>
                <span className="point-label">Direct Desk</span>
                <span className="point-val">(800) 555-FRAN (3726)</span>
              </div>
            </div>

            <div className="contact-point-item">
              <div className="point-icon"><MapPin size={16} /></div>
              <div>
                <span className="point-label">Operational Center</span>
                <span className="point-val">Austin Technology Corridor, Austin, TX</span>
              </div>
            </div>

            <div className="contact-point-item">
              <div className="point-icon"><Clock size={16} /></div>
              <div>
                <span className="point-label">Consultation Hours</span>
                <span className="point-val">Monday - Friday, 8:00 AM - 6:00 PM CST</span>
              </div>
            </div>
          </div>

          <div className="alert-box alert-disclaimer" style={{ marginTop: 24 }}>
            <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '12px' }}>
              All communications are strictly confidential and governed by non-disclosure agreements.
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card contact-form-card">
          {isSuccess ? (
            <div className="contact-success-wrap">
              <div className="success-icon-wrap">
                <CheckCircle2 size={46} color="var(--color-primary)" />
              </div>
              <h3>Consultation Request Received</h3>
              <p>
                Thank you, <strong>{formData.name}</strong>. A dedicated franchise analyst has been assigned to your inquiry and will reach out via email ({formData.email}) within 1 business day.
              </p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', email: '', phone: '', subject: 'General Advisory Inquiry', location: '', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3 className="form-card-title">Schedule Advisory Consultation</h3>

              <div className="form-group">
                <label className="form-label form-label-required">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rachel Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="rachel@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="(555) 234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Inquiry Focus</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Advisory Inquiry">General Advisory Inquiry</option>
                    <option value="Territory Exclusivity Screening">Territory Exclusivity Screening</option>
                    <option value="Item 19 Financial Audit">Item 19 Financial Audit</option>
                    <option value="Franchisor Brand Listing Request">Franchisor Brand Listing Request</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Market / Region</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Phoenix Metro, AZ"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">How Can We Assist Your Evaluation?</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your capital criteria, preferred operational model (owner-operator vs. semi-absentee), or specific brands of interest..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={15} />
                <span>Submit Advisory Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
