import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Mail, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const Footer = () => {
  const { resetToDefaultData } = useFranchises();

  return (
    <footer className="footer-container">
      <div className="site-wrap-wide footer-inner">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="logo-icon-box">
                <span className="logo-letters">FT</span>
              </div>
              <span className="footer-brand-title">FranchiseTrack</span>
            </div>
            <p className="footer-desc">
              The premier platform for exploring verified franchise concepts, assessing unit economics, comparing pro-forma investment metrics, and managing application lifecycles.
            </p>
            <div className="footer-badges-list">
              <span className="badge badge-green">
                <ShieldCheck size={12} />
                <span>Verified FDD Item 19 Data</span>
              </span>
              <span className="badge badge-neutral">Standardized Disclosure</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Franchise Directory</h4>
            <ul className="footer-links">
              <li><Link to="/franchises?category=Food%20%26%20Beverage">Food & Beverage</Link></li>
              <li><Link to="/franchises?category=Fitness%20%26%20Wellness">Fitness & Wellness</Link></li>
              <li><Link to="/franchises?category=Education%20%26%20Tech">Education & Tech</Link></li>
              <li><Link to="/franchises?category=Automotive%20%26%20Fleet">Automotive & Fleet</Link></li>
              <li><Link to="/franchises?category=Retail%20%26%20Home%20Services">Retail & Home Services</Link></li>
              <li><Link to="/franchises?category=B2B%20%26%20Logistics">B2B & Logistics</Link></li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div className="footer-col">
            <h4 className="footer-heading">Investor Tools</h4>
            <ul className="footer-links">
              <li><Link to="/compare">Side-by-Side Comparison</Link></li>
              <li><Link to="/calculator">ROI & Royalty Calculator</Link></li>
              <li><Link to="/dashboard">Application Tracker</Link></li>
              <li><Link to="/about">Franchise Buying Guide</Link></li>
              <li><Link to="/categories">Market Growth Benchmarks</Link></li>
            </ul>
          </div>

          {/* Portals & Controls */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform Access</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Investor Portal</Link></li>
              <li><Link to="/brand-portal">Brand Franchisor Hub</Link></li>
              <li><Link to="/admin">Admin Management Console</Link></li>
              <li><Link to="/contact">Advisor Consultation</Link></li>
            </ul>

            <div className="footer-reset-box">
              <button 
                type="button" 
                className="btn btn-ghost btn-sm reset-btn"
                onClick={resetToDefaultData}
                title="Reset all test state back to pristine sample data"
              >
                <RefreshCw size={13} />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box as mandated by Section 17 */}
        <div className="footer-disclaimer-box">
          <div className="disclaimer-header">
            <ShieldCheck size={16} />
            <span>Regulatory & Educational Prototype Disclaimer</span>
          </div>
          <p>
            All investment figures, cashflow estimates, royalty fees, and performance indicators published on FranchiseTrack (FT) are sample, illustrative data intended for prototype evaluation and decision-framework modeling. This prototype does not constitute legal, tax, or commercial franchise offerings, nor does submission of an application constitute guaranteed brand approval or binding commercial agreement. Always review official Franchise Disclosure Documents (FDD) and consult with certified franchise attorneys and financial advisers before executing any binding investment.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom flex-between">
          <span className="copyright-text">
            © {new Date().getFullYear()} FranchiseTrack (FT) Systems. Designed with clean minimal architecture.
          </span>
          <div className="bottom-links">
            <Link to="/about">Terms of Disclosure</Link>
            <span>•</span>
            <Link to="/about">FDD Item 19 Methodology</Link>
            <span>•</span>
            <Link to="/contact">Inquiries & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
