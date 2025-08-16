import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 120,
    RecentPatients: 75,
    activeAdmissions: 45,
    pendingBills: 20
  });
  const [recentActivity] = useState([
    { id: 1, message: 'John Doe was admitted to Ward A', timestamp: new Date() },
    { id: 2, message: 'Bill generated for Jane Smith', timestamp: new Date() },
    { id: 3, message: 'Insurance claim submitted for Mark Lee', timestamp: new Date() }
  ]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setUserData(user);
  }, [navigate]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'manage-patients':
        navigate('/patient-records');
        break;
      case 'view-bills':
        navigate('/billing');
        break;
      case 'insurance-claims':
        navigate('/insurance-claims');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getRoleSpecificActions = () => {
    switch (userData.role) {
      case 'hospital_staff':
        return (
          <>
            <button onClick={() => handleQuickAction('manage-patients')}>
              Manage Patient Records
            </button>
            <button onClick={() => handleQuickAction('view-bills')}>
              View All Bills
            </button>
          </>
        );
      case 'medical_staff':
        return (
          <>
            <button onClick={() => handleQuickAction('manage-patients')}>
              View Patient Records
            </button>
            <button onClick={() => handleQuickAction('view-bills')}>
              Generate Bills
            </button>
          </>
        );
      case 'insurance_staff':
        return (
          <>
            <button onClick={() => handleQuickAction('view-bills')}>
              Verify Bills
            </button>
            <button onClick={() => handleQuickAction('insurance-claims')}>
              Insurance Claims Overview
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="welcome-section">
        <h2>Welcome back, {userData.email}!</h2>
        <p>Role: {userData.role.replace('_', ' ').toUpperCase()}</p>
      </div>

      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          {getRoleSpecificActions()}
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-number">{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Active Admissions</h3>
          <p className="stat-number">{stats.activeAdmissions}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Bills</h3>
          <p className="stat-number">{stats.pendingBills}</p>
        </div>
      </div>

      <section className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <p>{activity.message}</p>
              <small>{activity.timestamp.toLocaleString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 