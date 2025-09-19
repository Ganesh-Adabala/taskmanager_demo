import React, { useState } from "react";
import UserRegistration from "./UserRegistration";
import UserList from "./UserList";

function App() {
  const [activeTab, setActiveTab] = useState('register');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabStyle = (tabName) => ({
    padding: '12px 24px',
    backgroundColor: activeTab === tabName ? '#007bff' : '#f8f9fa',
    color: activeTab === tabName ? 'white' : '#495057',
    border: '1px solid #dee2e6',
    borderBottom: activeTab === tabName ? '1px solid #007bff' : '1px solid #dee2e6',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    borderRadius: '8px 8px 0 0',
    marginRight: '4px',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: '0 0 8px 0' }}>Task Manager Demo</h1>
        <p style={{ color: '#666', margin: '0', fontSize: '16px' }}>
          User management system with registration and user listing
        </p>
      </header>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <nav role="tablist" aria-label="Main navigation">
          <button
            role="tab"
            aria-selected={activeTab === 'register'}
            aria-controls="register-panel"
            id="register-tab"
            onClick={() => handleTabChange('register')}
            style={tabStyle('register')}
          >
            👤 Register User
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'users'}
            aria-controls="users-panel"
            id="users-tab"
            onClick={() => handleTabChange('users')}
            style={tabStyle('users')}
          >
            👥 View Users
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'api'}
            aria-controls="api-panel"
            id="api-tab"
            onClick={() => handleTabChange('api')}
            style={tabStyle('api')}
          >
            📋 API Info
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div style={{ 
        border: '1px solid #dee2e6', 
        borderRadius: '0 8px 8px 8px', 
        backgroundColor: 'white',
        minHeight: '400px'
      }}>
        {activeTab === 'register' && (
          <div 
            role="tabpanel"
            id="register-panel"
            aria-labelledby="register-tab"
            style={{ padding: '20px' }}
          >
            <UserRegistration />
          </div>
        )}

        {activeTab === 'users' && (
          <div 
            role="tabpanel"
            id="users-panel"
            aria-labelledby="users-tab"
          >
            <UserList />
          </div>
        )}

        {activeTab === 'api' && (
          <div 
            role="tabpanel"
            id="api-panel"
            aria-labelledby="api-tab"
            style={{ padding: '20px' }}
          >
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0' }}>API Endpoints Available:</h3>
              <ul style={{ lineHeight: '1.6' }}>
                <li><strong>POST /api/users/register</strong> - Register a new user</li>
                <li><strong>GET /api/users</strong> - Get all registered users</li>
                <li>
                  <strong>GET /api/users/check-username/{"{username}"}</strong> - Check username availability
                  <br />
                  <small style={{color: '#666', fontStyle: 'italic'}}>
                    Example: GET /api/users/check-username/john123
                  </small>
                </li>
                <li>
                  <strong>GET /api/users/check-email/{"{email}"}</strong> - Check email availability
                  <br />
                  <small style={{color: '#666', fontStyle: 'italic'}}>
                    Example: GET /api/users/check-email/john@example.com
                  </small>
                </li>
                <li><strong>GET /api/tasks</strong> - Get demo tasks</li>
                <li><strong>GET /weatherforecast</strong> - Get weather forecast (demo)</li>
              </ul>
              <p style={{ 
                backgroundColor: '#e3f2fd', 
                padding: '12px', 
                borderRadius: '4px',
                margin: '16px 0',
                border: '1px solid #bbdefb'
              }}>
                <strong>🚀 API Server:</strong> Make sure to start the API server on <code>http://localhost:5001</code>
              </p>
              
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>📝 Sample API Calls:</h4>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto', 
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}>
{`// Get all users
fetch('http://localhost:5001/api/users')

// Check if username "john123" is available
fetch('http://localhost:5001/api/users/check-username/john123')

// Check if email "test@email.com" is available  
fetch('http://localhost:5001/api/users/check-email/test@email.com')

// Register a new user
fetch('http://localhost:5001/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john123',
    email: 'john@example.com', 
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  })
})`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
