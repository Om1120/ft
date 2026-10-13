import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const InquiryModal = ({ franchiseName, isOpen, onClose }) => {
  const { submitInquiry } = useFranchises();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.message.trim()) errs.message = 'Please enter your inquiry question';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitInquiry({
      franchiseName: franchiseName || 'General Platform Advisory',
      ...formData
    });
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', email: '', phone: '', location: '', message: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog inquiry-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex-between">
          <div>
            <span className="badge badge-blue">Franchise Advisory</span>
            <h3 className="modal-title">
              {franchiseName ? `Inquire about ${franchiseName}` : 'Speak with a Franchise Advisor'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="inquiry-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={42} color="var(--color-primary)" />
            </div>
            <h4>Inquiry Dispatched</h4>
            <p>
              Your request for <strong>{franchiseName || 'Platform Advisory'}</strong> has been sent to our franchise development team. An advisor will contact you within 1 business day.
            </p>
            <button type="button" className="btn btn-primary" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label className="form-label form-label-required">Your Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Samuel Bennett"
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
                  placeholder="e.g. samuel@example.com"
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
                  placeholder="(555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Market / Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dallas, TX Suburbs"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Inquiry Details / Specific Questions</label>
              <textarea
                className="form-textarea"
                placeholder="Tell us what you would like to know (e.g. territory exclusivity, multi-unit incentives, real estate criteria)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <div className="modal-footer-nav flex-between">
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={14} />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
