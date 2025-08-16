export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Simple validation: at least 6 characters
  return password.length >= 6;
};

export const validateRole = (role) => {
  const validRoles = ['hospital_staff', 'medical_staff', 'insurance_staff'];
  return validRoles.includes(role);
};

export const getPasswordValidationMessage = () => {
  return 'Password must be at least 6 characters long';
};

export const validateForm = (formData) => {
  const errors = {};

  if (!formData.role) {
    errors.role = 'Please select a role';
  } else if (!validateRole(formData.role)) {
    errors.role = 'Invalid role selected';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = getPasswordValidationMessage();
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 