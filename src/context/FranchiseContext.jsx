import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_FRANCHISES, 
  INITIAL_CATEGORIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_INQUIRIES 
} from '../data/franchisesData';

const FranchiseContext = createContext(null);

export const FranchiseProvider = ({ children }) => {
  // LocalStorage-backed state for Franchises (CRUD)
  const [franchises, setFranchises] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_franchises');
      return saved ? JSON.parse(saved) : INITIAL_FRANCHISES;
    } catch {
      return INITIAL_FRANCHISES;
    }
  });

  // Categories
  const [categories] = useState(INITIAL_CATEGORIES);

  // Applications
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Inquiries
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_inquiries');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // Saved Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_favorites');
      return saved ? JSON.parse(saved) : ['bean-brew', 'evergreen-bowls'];
    } catch {
      return ['bean-brew', 'evergreen-bowls'];
    }
  });

  // Compare List (IDs)
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_compare');
      return saved ? JSON.parse(saved) : ['bean-brew', 'evergreen-bowls', 'pulsefit-247'];
    } catch {
      return ['bean-brew', 'evergreen-bowls', 'pulsefit-247'];
    }
  });

  // User Role Switcher for seamless prototype evaluation: 'user' | 'brand' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('ft_role') || 'user';
    } catch {
      return 'user';
    }
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ft_franchises', JSON.stringify(franchises));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [franchises]);

  useEffect(() => {
    try {
      localStorage.setItem('ft_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('ft_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('ft_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('ft_compare', JSON.stringify(compareList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem('ft_role', currentRole);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [currentRole]);

  // Toast Helper
  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Favorite
  const toggleFavorite = (franchiseId) => {
    setFavorites((prev) => {
      const exists = prev.includes(franchiseId);
      const updated = exists 
        ? prev.filter((id) => id !== franchiseId)
        : [...prev, franchiseId];
      
      const franchise = franchises.find((f) => f.id === franchiseId);
      const name = franchise ? franchise.name : 'Franchise';
      
      addToast({
        type: exists ? 'info' : 'success',
        title: exists ? 'Removed from Saved' : 'Saved to Favorites',
        message: exists ? `${name} removed from your saved list.` : `${name} added to your saved franchises.`
      });

      return updated;
    });
  };

  // Compare handlers
  const addToCompare = (franchiseId) => {
    if (compareList.includes(franchiseId)) {
      addToast({
        type: 'info',
        title: 'Already in Comparison',
        message: 'This franchise is already selected for comparison.'
      });
      return;
    }
    if (compareList.length >= 4) {
      addToast({
        type: 'warning',
        title: 'Comparison Limit Reached',
        message: 'You can compare up to 4 franchises simultaneously.'
      });
      return;
    }
    setCompareList((prev) => [...prev, franchiseId]);
    const franchise = franchises.find((f) => f.id === franchiseId);
    addToast({
      type: 'success',
      title: 'Added to Comparison',
      message: `${franchise?.name || 'Franchise'} added to side-by-side comparison.`
    });
  };

  const removeFromCompare = (franchiseId) => {
    setCompareList((prev) => prev.filter((id) => id !== franchiseId));
  };

  const clearCompare = () => {
    setCompareList([]);
    addToast({
      type: 'info',
      title: 'Comparison Cleared',
      message: 'All franchises removed from comparison.'
    });
  };

  // Submit Application
  const submitApplication = (formData) => {
    const id = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp = {
      id,
      ...formData,
      status: 'Submitted',
      stageIndex: 1,
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: 'Application received and submitted into candidate review queue.'
    };

    setApplications((prev) => [newApp, ...prev]);
    addToast({
      type: 'success',
      title: 'Application Submitted',
      message: `Your application (${id}) for ${formData.franchiseName} has been recorded.`
    });
    return newApp;
  };

  // Submit Inquiry
  const submitInquiry = (inquiryData) => {
    const id = `INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInquiry = {
      id,
      ...inquiryData,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    addToast({
      type: 'success',
      title: 'Inquiry Sent',
      message: `Your franchise advisor inquiry has been sent to the brand team.`
    });
    return newInquiry;
  };

  // Admin Franchise CRUD
  const addFranchise = (newFranchise) => {
    const id = newFranchise.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `brand-${Date.now()}`;
    const completeFranchise = {
      id,
      status: 'Active',
      rating: 5.0,
      reviewCount: 1,
      establishedYear: new Date().getFullYear(),
      franchisingSince: new Date().getFullYear(),
      fddItem19Available: true,
      ...newFranchise
    };
    setFranchises((prev) => [completeFranchise, ...prev]);
    addToast({
      type: 'success',
      title: 'Franchise Created',
      message: `${completeFranchise.name} has been published to the directory.`
    });
    return completeFranchise;
  };

  const updateFranchise = (id, updatedFields) => {
    setFranchises((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
    addToast({
      type: 'success',
      title: 'Franchise Updated',
      message: 'Brand listing information updated successfully.'
    });
  };

  const deleteFranchise = (id) => {
    const item = franchises.find((f) => f.id === id);
    setFranchises((prev) => prev.filter((f) => f.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setCompareList((prev) => prev.filter((cId) => cId !== id));
    addToast({
      type: 'info',
      title: 'Franchise Removed',
      message: `${item?.name || 'Listing'} was removed from the active directory.`
    });
  };

  // Admin / Brand: update application status
  const updateApplicationStatus = (appId, newStatus, stageIndex, note) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            stageIndex: stageIndex !== undefined ? stageIndex : app.stageIndex,
            lastUpdated: new Date().toISOString().split('T')[0],
            notes: note ? `${note} (${new Date().toLocaleDateString()})` : app.notes
          };
        }
        return app;
      })
    );
    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Application ${appId} moved to stage: ${newStatus}`
    });
  };

  // Reset to initial demo data
  const resetToDefaultData = () => {
    setFranchises(INITIAL_FRANCHISES);
    setApplications(INITIAL_APPLICATIONS);
    setInquiries(INITIAL_INQUIRIES);
    setFavorites(['bean-brew', 'evergreen-bowls']);
    setCompareList(['bean-brew', 'evergreen-bowls', 'pulsefit-247']);
    localStorage.removeItem('ft_franchises');
    localStorage.removeItem('ft_applications');
    localStorage.removeItem('ft_inquiries');
    localStorage.removeItem('ft_favorites');
    localStorage.removeItem('ft_compare');
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Demo dataset restored to original sample data.'
    });
  };

  const value = {
    franchises,
    categories,
    applications,
    inquiries,
    favorites,
    compareList,
    currentRole,
    setCurrentRole,
    toasts,
    addToast,
    removeToast,
    toggleFavorite,
    addToCompare,
    removeFromCompare,
    clearCompare,
    submitApplication,
    submitInquiry,
    addFranchise,
    updateFranchise,
    deleteFranchise,
    updateApplicationStatus,
    resetToDefaultData
  };

  return <FranchiseContext.Provider value={value}>{children}</FranchiseContext.Provider>;
};

export const useFranchises = () => {
  const context = useContext(FranchiseContext);
  if (!context) {
    throw new Error('useFranchises must be used within a FranchiseProvider');
  }
  return context;
};
