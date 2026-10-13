import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  DollarSign, 
  Percent, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const CalculatorPage = () => {
  const { franchises } = useFranchises();

  // Modeling inputs
  const [initialInvestment, setInitialInvestment] = useState(110000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(52000);
  const [cogsPercent, setCogsPercent] = useState(30); // Cost of Goods Sold %
  const [royaltyPercent, setRoyaltyPercent] = useState(5.5);
  const [marketingPercent, setMarketingPercent] = useState(2.0);
  const [monthlyRentAndLabor, setMonthlyRentAndLabor] = useState(18500); // Staff, Rent, Utilities
  const [monthlyDebtService, setMonthlyDebtService] = useState(1200); // SBA loan note

  // Load a preset from an existing franchise
  const handleLoadPreset = (franchiseId) => {
    const f = franchises.find((item) => item.id === franchiseId);
    if (!f) return;
    const avgInv = Math.round((f.initialInvestment.min + f.initialInvestment.max) / 2);
    const estMonthlyGross = Math.round(f.avgAnnualGrossSales / 12);
    setInitialInvestment(avgInv);
    setMonthlyRevenue(estMonthlyGross);
    setRoyaltyPercent(f.royaltyFeePercent);
    setMarketingPercent(f.marketingFeePercent);
    // Sensible standard defaults based on sector
    if (f.categoryId === 'food-beverage') {
      setCogsPercent(28);
      setMonthlyRentAndLabor(Math.round(estMonthlyGross * 0.42));
    } else if (f.categoryId === 'fitness-wellness') {
      setCogsPercent(12);
      setMonthlyRentAndLabor(Math.round(estMonthlyGross * 0.38));
    } else {
      setCogsPercent(24);
      setMonthlyRentAndLabor(Math.round(estMonthlyGross * 0.40));
    }
  };

  const handleResetDefaults = () => {
    setInitialInvestment(110000);
    setMonthlyRevenue(52000);
    setCogsPercent(30);
    setRoyaltyPercent(5.5);
    setMarketingPercent(2.0);
    setMonthlyRentAndLabor(18500);
    setMonthlyDebtService(1200);
  };

  // Calculations
  const monthlyGrossSales = monthlyRevenue;
  const monthlyCogs = monthlyGrossSales * (cogsPercent / 100);
  const monthlyGrossProfit = monthlyGrossSales - monthlyCogs;
  
  const monthlyRoyaltyFee = monthlyGrossSales * (royaltyPercent / 100);
  const monthlyMarketingFee = monthlyGrossSales * (marketingPercent / 100);
  const totalFranchisorFees = monthlyRoyaltyFee + monthlyMarketingFee;

  const totalMonthlyExpenses = monthlyCogs + monthlyRentAndLabor + totalFranchisorFees + monthlyDebtService;
  const netMonthlyCashflow = monthlyGrossSales - totalMonthlyExpenses;
  const annualNetCashflow = netMonthlyCashflow * 12;

  const paybackMonths = netMonthlyCashflow > 0 
    ? (initialInvestment / netMonthlyCashflow).toFixed(1) 
    : 'N/A (Cashflow Negative)';

  const cashOnCashRoi = (initialInvestment > 0 && netMonthlyCashflow > 0)
    ? ((annualNetCashflow / initialInvestment) * 100).toFixed(1)
    : '0';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="calculator-page site-wrap-wide">
      {/* Page Header */}
      <div className="page-header flex-between">
        <div>
          <span className="badge badge-blue">Financial Pro-Forma Engine</span>
          <h1 className="page-title">Franchise ROI, Royalty & Breakeven Calculator</h1>
          <p className="page-desc">
            Model unit economics, ongoing franchisor royalties, operational overhead, and estimated breakeven timelines under customizable revenue assumptions.
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={handleResetDefaults}
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="card preset-loader-card">
        <span className="preset-label">Quick Load Brand Benchmarks:</span>
        <div className="preset-buttons-wrap">
          {franchises.slice(0, 5).map((f) => (
            <button
              key={f.id}
              type="button"
              className="preset-btn"
              onClick={() => handleLoadPreset(f.id)}
            >
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="calc-layout-grid">
        {/* Left Column: Sliders & Form Inputs */}
        <div className="calc-inputs-col card">
          <h3 className="calc-col-title">Investment & Revenue Parameters</h3>

          {/* Initial Investment */}
          <div className="calc-control-group">
            <div className="control-label-row flex-between">
              <label className="control-label">Total Initial Capital Investment</label>
              <span className="control-val-badge">{formatCurrency(initialInvestment)}</span>
            </div>
            <input
              type="range"
              min={30000}
              max={350000}
              step={5000}
              className="custom-range-slider"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(parseInt(e.target.value, 10))}
            />
            <span className="control-hint">Includes buildout, equipment, franchise fee, and 3-month working capital.</span>
          </div>

          {/* Monthly Revenue */}
          <div className="calc-control-group">
            <div className="control-label-row flex-between">
              <label className="control-label">Projected Monthly Gross Revenue</label>
              <span className="control-val-badge">{formatCurrency(monthlyRevenue)}</span>
            </div>
            <input
              type="range"
              min={15000}
              max={140000}
              step={2000}
              className="custom-range-slider"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(parseInt(e.target.value, 10))}
            />
            <span className="control-hint">Total monthly gross ticket or invoice billings before deductions.</span>
          </div>

          {/* Cost of Goods Sold % */}
          <div className="calc-control-group">
            <div className="control-label-row flex-between">
              <label className="control-label">Cost of Goods Sold (COGS %)</label>
              <span className="control-val-badge">{cogsPercent}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              className="custom-range-slider"
              value={cogsPercent}
              onChange={(e) => setCogsPercent(parseInt(e.target.value, 10))}
            />
            <span className="control-hint">Direct food/inventory/materials cost as a percentage of sales.</span>
          </div>

          <div className="calc-inputs-row-2">
            {/* Royalty % */}
            <div className="calc-control-group">
              <div className="control-label-row flex-between">
                <label className="control-label">Ongoing Royalty</label>
                <span className="control-val-badge">{royaltyPercent}%</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                max="15"
                className="form-input"
                value={royaltyPercent}
                onChange={(e) => setRoyaltyPercent(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Marketing Fund % */}
            <div className="calc-control-group">
              <div className="control-label-row flex-between">
                <label className="control-label">Marketing Ad Fund</label>
                <span className="control-val-badge">{marketingPercent}%</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-input"
                value={marketingPercent}
                onChange={(e) => setMarketingPercent(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Monthly Labor, Rent & Utilities */}
          <div className="calc-control-group">
            <div className="control-label-row flex-between">
              <label className="control-label">Monthly Staff Labor, Rent & Utilities</label>
              <span className="control-val-badge">{formatCurrency(monthlyRentAndLabor)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={50000}
              step={500}
              className="custom-range-slider"
              value={monthlyRentAndLabor}
              onChange={(e) => setMonthlyRentAndLabor(parseInt(e.target.value, 10))}
            />
            <span className="control-hint">Facility lease, employee wages, payroll tax, insurance, and utilities.</span>
          </div>

          {/* Debt Service */}
          <div className="calc-control-group">
            <div className="control-label-row flex-between">
              <label className="control-label">Monthly Loan Payment / Debt Service</label>
              <span className="control-val-badge">{formatCurrency(monthlyDebtService)}</span>
            </div>
            <input
              type="number"
              min="0"
              max="10000"
              step="100"
              className="form-input"
              value={monthlyDebtService}
              onChange={(e) => setMonthlyDebtService(parseInt(e.target.value, 10) || 0)}
            />
            <span className="control-hint">Monthly principal and interest on SBA or commercial bank financing.</span>
          </div>
        </div>

        {/* Right Column: Calculated Projections & Statements */}
        <div className="calc-results-col">
          {/* Top Key Result Cards */}
          <div className="calc-kpi-grid">
            <div className="card kpi-card highlight-green">
              <span className="kpi-label">Monthly Net Cashflow</span>
              <span className="kpi-value">{formatCurrency(netMonthlyCashflow)}</span>
              <span className="kpi-sub">Pre-tax monthly owner take-home</span>
            </div>

            <div className="card kpi-card">
              <span className="kpi-label">Annualized Cashflow</span>
              <span className="kpi-value">{formatCurrency(annualNetCashflow)}</span>
              <span className="kpi-sub">Projected yearly return</span>
            </div>

            <div className="card kpi-card">
              <span className="kpi-label">Estimated Breakeven</span>
              <span className="kpi-value">{paybackMonths} Months</span>
              <span className="kpi-sub">To recoup initial investment</span>
            </div>

            <div className="card kpi-card">
              <span className="kpi-label">Cash-on-Cash Return</span>
              <span className="kpi-value">{cashOnCashRoi}%</span>
              <span className="kpi-sub">Annual yield on capital</span>
            </div>
          </div>

          {/* Pro-Forma Income Statement Table */}
          <div className="card income-statement-card">
            <h4 className="statement-title">Pro-Forma Monthly Cashflow Breakdown</h4>
            <div className="statement-table">
              <div className="stmt-row header-row flex-between">
                <span>Monthly Item</span>
                <span>Amount ($)</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Gross Revenue</span>
                <span className="stmt-val font-bold">{formatCurrency(monthlyGrossSales)}</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Less: Cost of Goods Sold ({cogsPercent}%)</span>
                <span className="stmt-val text-muted">- {formatCurrency(monthlyCogs)}</span>
              </div>
              <div className="stmt-row subtotal flex-between">
                <span>Gross Profit Margin</span>
                <span className="stmt-val font-semibold">{formatCurrency(monthlyGrossProfit)}</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Less: Ongoing Royalty Fee ({royaltyPercent}%)</span>
                <span className="stmt-val text-muted">- {formatCurrency(monthlyRoyaltyFee)}</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Less: Brand Ad / Marketing Fund ({marketingPercent}%)</span>
                <span className="stmt-val text-muted">- {formatCurrency(monthlyMarketingFee)}</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Less: Facility Lease, Labor & Utilities</span>
                <span className="stmt-val text-muted">- {formatCurrency(monthlyRentAndLabor)}</span>
              </div>
              <div className="stmt-row flex-between">
                <span>Less: Monthly Debt Financing Service</span>
                <span className="stmt-val text-muted">- {formatCurrency(monthlyDebtService)}</span>
              </div>
              <div className="stmt-row total flex-between">
                <span>Net Owner Operating Income</span>
                <span className="stmt-val total-highlight">{formatCurrency(netMonthlyCashflow)}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer Callout */}
          <div className="alert-box alert-disclaimer" style={{ marginTop: 20 }}>
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Pro-Forma Calculator Modeling Disclaimer:</strong>
              <p style={{ marginTop: 4, fontSize: '12.5px' }}>
                All calculations are estimates produced for educational budgeting. Actual franchise unit performance varies based on local demographic density, operational management, commercial lease terms, and economic conditions. Verify exact financial records via registered Franchise Disclosure Documents (FDD).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
