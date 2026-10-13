import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Building
} from 'lucide-react';

export const AboutPage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: 'What is a Franchise Disclosure Document (FDD)?',
      a: 'The Franchise Disclosure Document (FDD) is a legal document mandated by the Federal Trade Commission (FTC). It contains 23 specific disclosure items covering the franchisor\'s executive background, litigation history, initial franchise fees, estimated investment ranges (Item 7), historical earnings claims (Item 19), and franchisee obligations.'
    },
    {
      q: 'What is the difference between Liquid Capital and Net Worth?',
      a: 'Liquid Capital represents assets that can be converted immediately into cash within 30 days (such as bank savings, money market accounts, stocks, or mutual funds) without incurring liquidation penalties. Net Worth represents total assets (including real estate equity and retirement accounts) minus total personal liabilities.'
    },
    {
      q: 'How are estimated payback periods calculated on FranchiseTrack?',
      a: 'Payback periods shown on FranchiseTrack are modeled by taking the mid-point of the total initial investment (Item 7) divided by the historical median net owner discretionary earnings derived from representative Item 19 unit economics, minus standardized royalty and advertising deductions.'
    },
    {
      q: 'Does submitting a candidate application obligate me to invest?',
      a: 'No. Submitting an application on FranchiseTrack is an exploratory step to qualify for receiving official territorial FDD disclosures and schedule an introductory discovery conversation. No binding financial commitments exist until a Franchise Agreement is formally executed.'
    },
    {
      q: 'Can I operate a franchise as a semi-absentee owner?',
      a: 'Yes. Many modern concepts (such as boutique fitness, automated facilities, and route logistics) are engineered specifically for semi-absentee or executive ownership, where a designated General Manager handles day-to-day operations while the franchisee provides strategic oversight.'
    }
  ];

  return (
    <div className="about-page site-wrap-wide">
      {/* Header */}
      <div className="page-header text-center-wrap">
        <span className="badge badge-green">About FranchiseTrack</span>
        <h1 className="page-title">Transparent Franchise Intelligence & Due Diligence</h1>
        <p className="page-desc">
          Empowering entrepreneurs and investors with clear unit economics, verified FDD Item 19 filings, and pro-forma modeling tools.
        </p>
      </div>

      {/* Mission Section */}
      <div className="card about-mission-card">
        <div className="about-mission-grid">
          <div className="mission-content">
            <span className="badge badge-neutral">Platform Mission</span>
            <h2 className="mission-title">Demystifying Franchise Economics</h2>
            <p className="mission-text">
              Traditional franchise directories often obscure hidden fees, unrealistic royalty structures, and ambiguous capital requirements. FranchiseTrack was engineered to standardize franchise due diligence into an objective, data-driven experience.
            </p>
            <p className="mission-text">
              We extract and structure essential Item 7 buildout ranges, Item 19 earnings claims, and ongoing franchisor obligations so prospective business owners can evaluate opportunities with institutional-grade clarity.
            </p>
            <div className="mission-bullets">
              <div className="bullet-item">
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Zero hidden fee structures or sponsored ranking inflation</span>
              </div>
              <div className="bullet-item">
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Standardized financial metrics across every franchise brand</span>
              </div>
              <div className="bullet-item">
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <span>Seamless multi-step application and due diligence lifecycle tracking</span>
              </div>
            </div>
          </div>

          <div className="mission-stats-panel card-soft">
            <h4 className="stats-panel-title">Due Diligence Standards</h4>
            <div className="spec-stat-item">
              <span className="spec-stat-num">23 Items</span>
              <span className="spec-stat-label">Full FTC FDD disclosure review criteria</span>
            </div>
            <div className="spec-stat-item">
              <span className="spec-stat-num">100%</span>
              <span className="spec-stat-label">Standardized pro-forma cashflow engines</span>
            </div>
            <div className="spec-stat-item">
              <span className="spec-stat-num">5 Milestones</span>
              <span className="spec-stat-label">Candidate application lifecycle tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* FDD Primer Section */}
      <div className="fdd-primer-section section-padded-sm">
        <div className="section-head text-center-wrap">
          <span className="badge badge-blue">Investor Education</span>
          <h2 className="section-title">The Three Pillars of Franchise Due Diligence</h2>
          <p className="section-subtitle">
            Essential disclosure sections every prospective franchisee should examine prior to commitment.
          </p>
        </div>

        <div className="fdd-pillars-grid">
          <div className="card fdd-pillar-card">
            <div className="pillar-num">Item 7</div>
            <h3 className="pillar-title">Total Estimated Investment</h3>
            <p className="pillar-desc">
              Item 7 details all initial expenditures required to open the franchise: architecture, construction buildout, leasehold deposits, inventory, equipment, and required 3-month working capital reserves.
            </p>
          </div>

          <div className="card fdd-pillar-card">
            <div className="pillar-num">Item 19</div>
            <h3 className="pillar-title">Financial Performance Representations</h3>
            <p className="pillar-desc">
              Item 19 presents historical sales, gross margins, and operating expenses of existing company-owned and franchisee-operated units, providing the factual basis for pro-forma return projections.
            </p>
          </div>

          <div className="card fdd-pillar-card">
            <div className="pillar-num">Item 20</div>
            <h3 className="pillar-title">Outlets & Franchisee Information</h3>
            <p className="pillar-desc">
              Item 20 lists operating unit counts over the past three years, outlet growth trajectory, terminations, and contact details of current franchisees for conducting independent validation calls.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-section section-padded-sm">
        <div className="section-head text-center-wrap">
          <span className="badge badge-neutral">Common Questions</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-accordion-wrap">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="card faq-item-card">
                <button
                  type="button"
                  className="faq-question-btn flex-between"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`faq-icon ${isOpen ? 'rotated' : ''}`} 
                  />
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Prototype Notice */}
      <div className="alert-box alert-disclaimer" style={{ marginTop: 24 }}>
        <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Regulatory Transparency Statement:</strong>
          <p style={{ marginTop: 4, fontSize: '13px' }}>
            FranchiseTrack is an educational demonstration prototype. Figures, pro-forma tables, and brand representations are sample illustrative models. No actual commercial offerings or binding legal contracts are finalized through this interface. Prospective buyers should always review official FDDs with legal counsel.
          </p>
        </div>
      </div>
    </div>
  );
};
