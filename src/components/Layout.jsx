import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>HealthCare</h2>
        </div>
        <ul className="nav-links">
          <li onClick={() => handleNavigation('/')}>Dashboard</li>
          {user?.role === 'Medical Staff' && (
            <>
              <li onClick={() => handleNavigation('/patient-records')}>Patient Records</li>
              <li onClick={() => handleNavigation('/billing')}>Billing</li>
            </>
          )}
          {user?.role === 'Insurance Staff' && (
            <li onClick={() => handleNavigation('/insurance-claims')}>Insurance Claims</li>
          )}
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 