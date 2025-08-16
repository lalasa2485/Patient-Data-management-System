import React from 'react';

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRole = (role) => {
  const validRoles = ['hospital_staff', 'medical_staff', 'insurance_staff'];
  return validRoles.includes(role);
};

// Error message components
export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <span className="error-text">{message}</span>;
};

export const ValidationError = ({ errors, field }) => {
  if (!errors || !errors[field]) return null;
  return <ErrorMessage message={errors[field]} />;
};

// Form validation component
export const FormValidation = ({ children, errors }) => {
  return (
    <div className="form-validation">
      {children}
      {errors && Object.keys(errors).length > 0 && (
        <div className="validation-summary">
          {Object.entries(errors).map(([field, message]) => (
            <ValidationError key={field} errors={errors} field={field} />
          ))}
        </div>
      )}
    </div>
  );
};

// Validation context
export const ValidationContext = React.createContext({
  errors: {},
  setErrors: () => {},
  validateField: () => {},
  validateForm: () => {},
});

// Validation provider component
export const ValidationProvider = ({ children }) => {
  const [errors, setErrors] = React.useState({});

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (!validatePassword(value)) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      case 'role':
        if (!value) {
          error = 'Please select a role';
        } else if (!validateRole(value)) {
          error = 'Invalid role selected';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  const validateForm = (formData) => {
    const newErrors = {};
    let isValid = true;

    if (!formData.role) {
      newErrors.role = 'Please select a role';
      isValid = false;
    } else if (!validateRole(formData.role)) {
      newErrors.role = 'Invalid role selected';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <ValidationContext.Provider value={{
      errors,
      setErrors,
      validateField,
      validateForm
    }}>
      {children}
    </ValidationContext.Provider>
  );
};

// Custom hook for validation
export const useValidation = () => {
  const context = React.useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

export default {
  validateEmail,
  validatePassword,
  validateRole,
  ErrorMessage,
  ValidationError,
  FormValidation,
  ValidationProvider,
  useValidation
}; 