import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Sample data for demonstration
  const stats = {
    totalPatients: 150,
    pendingBills: 25,
    verifiedClaims: 120,
    totalRevenue: '$45,000'
  };

  const recentActivities = [
    { id: 1, type: 'New Patient', description: 'John Doe registered', time: '2 hours ago' },
    { id: 2, type: 'Bill Generated', description: 'Bill #1234 created', time: '4 hours ago' },
    { id: 3, type: 'Claim Verified', description: 'Claim #5678 approved', time: '1 day ago' }
  ];

  const getRoleBasedActions = () => {
    switch (user?.role) {
      case 'Hospital Staff':
        return (
          <div className="dashboard-section">
            <h2>Hospital Staff Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{stats.totalPatients}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Bills</h3>
                <p className="stat-number">{stats.pendingBills}</p>
              </div>
              <div className="stat-card">
                <h3>Verified Claims</h3>
                <p className="stat-number">{stats.verifiedClaims}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">{stats.totalRevenue}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleNavigation('/patient-records')}>
                Manage Patient Records
              </button>
              <button onClick={() => handleNavigation('/billing')}>
                Manage Billing
              </button>
              <button onClick={() => handleNavigation('/insurance-claims')}>
                Manage Insurance Claims
              </button>
            </div>
            <div className="recent-activity">
              <h3>Recent Activities</h3>
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <p>{activity.type}: {activity.description}</p>
                    <small>{activity.time}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Medical Staff':
        return (
          <div className="dashboard-section">
            <h2>Medical Staff Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{stats.totalPatients}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Bills</h3>
                <p className="stat-number">{stats.pendingBills}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleNavigation('/patient-records')}>
                View Patient Records
              </button>
              <button onClick={() => handleNavigation('/billing')}>
                Generate Bills
              </button>
            </div>
            <div className="recent-activity">
              <h3>Recent Activities</h3>
              <div className="activity-list">
                {recentActivities
                  .filter(activity => ['New Patient', 'Bill Generated'].includes(activity.type))
                  .map(activity => (
                    <div key={activity.id} className="activity-item">
                      <p>{activity.type}: {activity.description}</p>
                      <small>{activity.time}</small>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case 'Insurance Staff':
        return (
          <div className="dashboard-section">
            <h2>Insurance Staff Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Pending Claims</h3>
                <p className="stat-number">{stats.pendingBills}</p>
              </div>
              <div className="stat-card">
                <h3>Verified Claims</h3>
                <p className="stat-number">{stats.verifiedClaims}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={() => handleNavigation('/insurance-claims')}>
                Process Claims
              </button>
              <button onClick={() => handleNavigation('/billing')}>
                View Bills
              </button>
            </div>
            <div className="recent-activity">
              <h3>Recent Activities</h3>
              <div className="activity-list">
                {recentActivities
                  .filter(activity => activity.type === 'Claim Verified')
                  .map(activity => (
                    <div key={activity.id} className="activity-item">
                      <p>{activity.type}: {activity.description}</p>
                      <small>{activity.time}</small>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="dashboard-section">
            <h2>Access Error</h2>
            <p>You don't have access to any dashboard. Please contact the administrator.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}</h1>
        <p className="user-role">Role: {user?.role || 'No role assigned'}</p>
      </div>

      <div className="dashboard-content">
        {getRoleBasedActions()}
      </div>
    </div>
  );
};

export default Dashboard; 