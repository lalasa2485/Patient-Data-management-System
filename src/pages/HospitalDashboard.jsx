import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/HospitalDashboard.css";

function HospitalDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleNavigation = (path, action) => {
    setLoading(true);
    // Simulate loading state
    setTimeout(() => {
      setLoading(false);
      navigate(path);
    }, 300);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>HealthCare</h2>
        <ul>
          <li className="active" onClick={() => handleNavigation('/hospital-dashboard')}>Dashboard</li>
          <li onClick={() => handleNavigation('/patient-records')}>Patient Records</li>
          <li onClick={() => handleNavigation('/billing')}>View Bills</li>
          <li onClick={() => handleNavigation('/insurance-claims')}>View Insurance Claims</li>
          <li onClick={handleLogout} className="logout-button">Logout</li>
        </ul>
      </aside>

      {/* Main Dashboard */}
      <main className="main-content">
        <h1>Hospital Staff Dashboard</h1>
        <p>Welcome back, {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Admin'}!</p>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button 
            onClick={() => handleNavigation('/patient-records', 'Manage Patient Records')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Manage Patient Records'}
          </button>
          <button 
            onClick={() => handleNavigation('/billing', 'View All Bills')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View All Bills'}
          </button>
          <button 
            onClick={() => handleNavigation('/insurance-claims', 'View Insurance Claims')}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View Insurance Claims'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card">
            <h4>Total Patients</h4>
            <p>120</p>
          </div>
          <div className="card">
            <h4>Active Admissions</h4>
            <p>45</p>
          </div>
          <div className="card">
            <h4>Pending Bills</h4>
            <p>20</p>
          </div>
          <div className="card">
            <h4>Insurance Claims</h4>
            <p>15</p>
          </div>
          <div className="card">
            <h4>Recent Patients</h4>
            <p>2</p>
          </div>

        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>John Doe was admitted to Ward A - 2 hours ago</li>
            <li>Bill generated for Jane Smith - 3 hours ago</li>
            <li>Insurance claim submitted for Mark Lee - 4 hours ago</li>
            <li>Updated patient records for Sarah Johnson - 5 hours ago</li>
            <li>New appointment scheduled for Tom Wilson - 6 hours ago</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default HospitalDashboard;
