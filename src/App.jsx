import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { FranchiseProvider } from './context/FranchiseContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { FranchiseDetailPage } from './pages/FranchiseDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ComparePage } from './pages/ComparePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrandPortalPage } from './pages/BrandPortalPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <FranchiseProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/franchises" element={<DiscoveryPage />} />
              <Route path="/franchise/:id" element={<FranchiseDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/brand-portal" element={<BrandPortalPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </FranchiseProvider>
  );
}

export default App;
