import React, { useState } from 'react';

// Copilot: Create a login form with username and password fields
// REFACTORED: Added proper validation, accessibility, error handling, and security
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (isRegistering) {
      if (!username.trim()) {
        newErrors.username = 'Username is required';
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
      
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      }
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (isRegistering && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const url = `http://localhost:5000/api/user/${isRegistering ? 'register' : 'login'}`;
      const payload = isRegistering 
        ? { username, email, password }
        : { email, password };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(result.message);
        if (!isRegistering && result.data?.token) {
          // Store token securely (in production, use httpOnly cookies)
          sessionStorage.setItem('authToken', result.data.token);
        }
        // Clear form on success
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setErrors({ general: result.errors?.join(', ') || result.message });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formStyle = {
    maxWidth: '400px',
    margin: '20px 0',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  };

  const fieldStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#dc3545'
  };

  const buttonStyle = {
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '4px'
  };

  const successStyle = {
    color: '#28a745',
    fontSize: '14px',
    marginBottom: '15px'
  };

  return (
    <div style={formStyle}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      
      {message && <div style={successStyle} role="status">{message}</div>}
      {errors.general && <div style={errorStyle} role="alert">{errors.general}</div>}
      
      <form onSubmit={handleSubmit} noValidate>
        {isRegistering && (
          <div style={fieldStyle}>
            <label htmlFor="username" style={labelStyle}>
              Username <span aria-label="required">*</span>
            </label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={errors.username ? errorInputStyle : inputStyle}
              aria-describedby={errors.username ? "username-error" : undefined}
              aria-invalid={!!errors.username}
              required={isRegistering}
              autoComplete="username"
            />
            {errors.username && (
              <div id="username-error" style={errorStyle} role="alert">
                {errors.username}
              </div>
            )}
          </div>
        )}
        
        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email <span aria-label="required">*</span>
          </label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={errors.email ? errorInputStyle : inputStyle}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            required
            autoComplete="email"
          />
          {errors.email && (
            <div id="email-error" style={errorStyle} role="alert">
              {errors.email}
            </div>
          )}
        </div>
        
        <div style={fieldStyle}>
          <label htmlFor="password" style={labelStyle}>
            Password <span aria-label="required">*</span>
          </label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={errors.password ? errorInputStyle : inputStyle}
            aria-describedby={errors.password ? "password-error" : undefined}
            aria-invalid={!!errors.password}
            required
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />
          {errors.password && (
            <div id="password-error" style={errorStyle} role="alert">
              {errors.password}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          style={buttonStyle}
          disabled={isLoading}
          aria-describedby="submit-help"
        >
          {isLoading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
        </button>
        
        <button 
          type="button" 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setErrors({});
            setMessage('');
          }}
          style={secondaryButtonStyle}
          disabled={isLoading}
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
        
        <div id="submit-help" style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          {isRegistering 
            ? 'Password must be at least 8 characters long'
            : 'Use your registered email and password to log in'
          }
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
