import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      let isValid = false;
      let userData = null;

      switch (formData.role) {
        case 'Hospital Staff':
          if (formData.email === 'hospital@example.com' && formData.password === 'hospital123') {
            isValid = true;
            userData = { name: 'Hospital Staff', role: 'Hospital Staff' };
          }
          break;
        case 'Medical Staff':
          if (formData.email === 'medical@example.com' && formData.password === 'medical123') {
            isValid = true;
            userData = { name: 'Medical Staff', role: 'Medical Staff' };
          }
          break;
        case 'Insurance Staff':
          if (formData.email === 'insurance@example.com' && formData.password === 'insurance123') {
            isValid = true;
            userData = { name: 'Insurance Staff', role: 'Insurance Staff' };
          }
          break;
        default:
          break;
      }

      if (isValid && userData) {
        await login(userData);
        navigate('/dashboard');
      } else {
        setErrors({ submit: 'Invalid credentials or role mismatch' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred during login. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Patient Data Management System</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
              disabled={isSubmitting}
            >
              <option value="">Select Role</option>
              <option value="Hospital Staff">Hospital Staff</option>
              <option value="Medical Staff">Medical Staff</option>
              <option value="Insurance Staff">Insurance Staff</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>
          
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          
          <button type="submit" disabled={isSubmitting} className={isSubmitting ? 'submitting' : ''}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="test-credentials">
          <h3>Test Credentials:</h3>
          <ul>
            <li>Hospital Staff: hospital@example.com / hospital123</li>
            <li>Medical Staff: medical@example.com / medical123</li>
            <li>Insurance Staff: insurance@example.com / insurance123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
