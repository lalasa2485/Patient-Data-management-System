import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientRecords from './pages/PatientRecords';
import Billing from './pages/Billing';
import InsuranceClaims from './pages/InsuranceClaims';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/patient-records"
            element={
              <ProtectedRoute allowedRoles={['Hospital Staff', 'Medical Staff']}>
                <Layout>
                  <PatientRecords />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/billing"
            element={
              <ProtectedRoute allowedRoles={['Hospital Staff', 'Medical Staff', 'Insurance Staff']}>
                <Layout>
                  <Billing />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/insurance-claims"
            element={
              <ProtectedRoute allowedRoles={['Hospital Staff', 'Insurance Staff']}>
                <Layout>
                  <InsuranceClaims />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
