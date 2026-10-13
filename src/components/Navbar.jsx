import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Bookmark, 
  Scale, 
  Calculator, 
  Layers, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  Briefcase 
} from 'lucide-react';
import { useFranchises } from '../context/FranchiseContext';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites, compareList, currentRole, setCurrentRole } = useFranchises();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Discover Franchises', path: '/franchises' },
    { name: 'Categories', path: '/categories' },
    { 
      name: 'Compare', 
      path: '/compare', 
      badge: compareList.length > 0 ? compareList.length : null 
    },
    { name: 'ROI Calculator', path: '/calculator' },
    { name: 'How It Works', path: '/about' },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top-bar">
        <div className="site-wrap-wide flex-between">
          <div className="top-bar-notice">
            <span className="notice-badge">Verified Portal</span>
            <span>Comprehensive franchise intelligence, unit economics, and application lifecycle management.</span>
          </div>
          <div className="role-switch-container">
            <span className="role-label">Active Workspace:</span>
            <div className="role-buttons">
              <button 
                type="button"
                className={`role-btn ${currentRole === 'user' ? 'active' : ''}`}
                onClick={() => setCurrentRole('user')}
                title="Switch to Franchise Seeker / Investor View"
              >
                <User size={13} />
                <span>Investor</span>
              </button>
              <button 
                type="button"
                className={`role-btn ${currentRole === 'brand' ? 'active' : ''}`}
                onClick={() => setCurrentRole('brand')}
                title="Switch to Brand Franchisor View"
              >
                <Briefcase size={13} />
                <span>Brand Hub</span>
              </button>
              <button 
                type="button"
                className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentRole('admin')}
                title="Switch to Platform Admin Console"
              >
                <ShieldCheck size={13} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar-main">
        <div className="site-wrap-wide navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-icon-box">
              <span className="logo-letters">FT</span>
            </div>
            <div className="logo-text-group">
              <span className="logo-title">FranchiseTrack</span>
              <span className="logo-sub">Investment & Growth Platform</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.name}
                {link.badge && <span className="nav-count-badge">{link.badge}</span>}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            <Link 
              to="/dashboard" 
              className={`action-btn-saved ${favorites.length > 0 ? 'has-items' : ''}`}
              title="View Saved Franchises & Applications"
            >
              <Bookmark size={16} />
              <span className="saved-text">Saved</span>
              {favorites.length > 0 && <span className="saved-badge">{favorites.length}</span>}
            </Link>

            {currentRole === 'admin' ? (
              <Link to="/admin" className="btn btn-primary btn-sm">
                <ShieldCheck size={14} />
                <span>Admin Console</span>
              </Link>
            ) : currentRole === 'brand' ? (
              <Link to="/brand-portal" className="btn btn-primary btn-sm">
                <Briefcase size={14} />
                <span>Brand Pipeline</span>
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-sm">
                <User size={14} />
                <span>My Dashboard</span>
              </Link>
            )}

            {/* Mobile Toggle Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="site-wrap">
            <div className="mobile-links-list">
              <Link 
                to="/" 
                className={`mobile-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex-between">
                    <span>{link.name}</span>
                    {link.badge && <span className="nav-count-badge">{link.badge}</span>}
                  </div>
                </Link>
              ))}
              <div className="mobile-divider" />
              <Link 
                to="/dashboard" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex-between">
                  <span>Saved Franchises ({favorites.length})</span>
                  <Bookmark size={16} />
                </div>
              </Link>
              <Link 
                to="/dashboard" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Investor Dashboard
              </Link>
              <Link 
                to="/brand-portal" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brand Franchisor Hub
              </Link>
              <Link 
                to="/admin" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Management Console
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
