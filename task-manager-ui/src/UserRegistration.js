import React, { useState, useRef, useEffect } from 'react';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Refs for accessibility
  const formRef = useRef(null);
  const messageRef = useRef(null);
  const firstErrorRef = useRef(null);

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 50) return 'Username must not exceed 50 characters';
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        // Also revalidate confirm password if it exists
        if (formData.confirmPassword) {
          setFieldErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value, formData.confirmPassword)
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate all fields
    const errors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    setFieldErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setMessage({ type: 'error', text: 'Please correct the errors below' });
      setLoading(false);
      
      // Focus on first error field
      setTimeout(() => {
        const firstErrorField = Object.keys(errors).find(key => errors[key] !== '');
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Registration successful!' });
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        const errorText = result.message || 'Registration failed';
        const errors = result.errors ? result.errors.join(', ') : '';
        setMessage({ 
          type: 'error', 
          text: errors ? `${errorText}: ${errors}` : errorText 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ type: 'error', text: 'Network error. Please ensure the API is running on http://localhost:5001' });
    } finally {
      setLoading(false);
    }
  };

  // Announce messages to screen readers
  useEffect(() => {
    if (message.text && messageRef.current) {
      messageRef.current.focus();
    }
  }, [message]);

  const getFieldAriaProps = (fieldName) => {
    const hasError = fieldErrors[fieldName];
    return {
      'aria-invalid': hasError ? 'true' : 'false',
      'aria-describedby': hasError ? `${fieldName}-error` : undefined,
    };
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 id="registration-heading">User Registration</h2>
      
      {message.text && (
        <div 
          ref={messageRef}
          role="alert"
          aria-live="polite"
          tabIndex="-1"
          style={{
            padding: '12px',
            margin: '10px 0',
            borderRadius: '4px',
            backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e8',
            color: message.type === 'error' ? '#c62828' : '#2e7d32',
            border: `2px solid ${message.type === 'error' ? '#ffcdd2' : '#c8e6c9'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '16px' }}>
            {message.type === 'error' ? '❌' : '✅'}
          </span>
          {message.text}
        </div>
      )}

      <form 
        ref={formRef} 
        onSubmit={handleSubmit}
        aria-labelledby="registration-heading"
        noValidate
      >
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username: <span style={{ color: '#d32f2f' }} aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength="3"
            maxLength="50"
            autoComplete="username"
            {...getFieldAriaProps('username')}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `2px solid ${fieldErrors.username ? '#d32f2f' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: fieldErrors.username ? '#fff5f5' : 'white'
            }}
          />
          {fieldErrors.username && (
            <div 
              id="username-error" 
              role="alert"
              style={{ 
                color: '#d32f2f', 
                fontSize: '14px', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span aria-hidden="true">⚠️</span>
              {fieldErrors.username}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email: <span style={{ color: '#d32f2f' }} aria-label="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="email"
            {...getFieldAriaProps('email')}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `2px solid ${fieldErrors.email ? '#d32f2f' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: fieldErrors.email ? '#fff5f5' : 'white'
            }}
          />
          {fieldErrors.email && (
            <div 
              id="email-error" 
              role="alert"
              style={{ 
                color: '#d32f2f', 
                fontSize: '14px', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span aria-hidden="true">⚠️</span>
              {fieldErrors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password: <span style={{ color: '#d32f2f' }} aria-label="required">*</span>
          </label>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Must contain: 8+ characters, uppercase, lowercase, number, and special character
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength="8"
            maxLength="100"
            autoComplete="new-password"
            {...getFieldAriaProps('password')}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `2px solid ${fieldErrors.password ? '#d32f2f' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: fieldErrors.password ? '#fff5f5' : 'white'
            }}
          />
          {fieldErrors.password && (
            <div 
              id="password-error" 
              role="alert"
              style={{ 
                color: '#d32f2f', 
                fontSize: '14px', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span aria-hidden="true">⚠️</span>
              {fieldErrors.password}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirm Password: <span style={{ color: '#d32f2f' }} aria-label="required">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="new-password"
            {...getFieldAriaProps('confirmPassword')}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: `2px solid ${fieldErrors.confirmPassword ? '#d32f2f' : '#ddd'}`, 
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: fieldErrors.confirmPassword ? '#fff5f5' : 'white'
            }}
          />
          {fieldErrors.confirmPassword && (
            <div 
              id="confirmPassword-error" 
              role="alert"
              style={{ 
                color: '#d32f2f', 
                fontSize: '14px', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span aria-hidden="true">⚠️</span>
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-describedby={loading ? 'loading-message' : undefined}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? (
            <>
              <span aria-hidden="true">⏳ </span>
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
        {loading && (
          <div id="loading-message" style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Please wait while we process your registration...
          </div>
        )}
      </form>
    </div>
  );
};

export default UserRegistration;