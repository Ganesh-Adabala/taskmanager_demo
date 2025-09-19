import React, { useState, useEffect, useRef } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const tableRef = useRef(null);
  const errorRef = useRef(null);

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Network error. Please ensure the API is running on http://localhost:5001');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Focus on error when it changes
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (user) => {
    if (!user.isActive) {
      return (
        <span 
          style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: '#ffebee',
            color: '#c62828',
            border: '1px solid #ffcdd2'
          }}
          aria-label="User status: Inactive"
        >
          Inactive
        </span>
      );
    }
    
    return user.isEmailVerified ? (
      <span 
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #c8e6c9'
        }}
        aria-label="User status: Active and verified"
      >
        ✓ Verified
      </span>
    ) : (
      <span 
        style={{
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: '#fff3e0',
          color: '#f57c00',
          border: '1px solid #ffcc02'
        }}
        aria-label="User status: Active but unverified"
      >
        Unverified
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>
          <span aria-hidden="true">⏳ </span>
          Loading users...
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
          Please wait while we fetch the user data
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 id="user-list-heading" style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
            Registered Users
          </h2>
          <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
            {users.length === 0 ? 'No users found' : `${users.length} user${users.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          style={{
            padding: '10px 16px',
            backgroundColor: refreshing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          aria-label={refreshing ? 'Refreshing user list' : 'Refresh user list'}
        >
          <span aria-hidden="true">{refreshing ? '⏳' : '🔄'}</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div 
          ref={errorRef}
          role="alert"
          aria-live="polite"
          tabIndex="-1"
          style={{
            padding: '12px',
            margin: '10px 0 20px 0',
            borderRadius: '4px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            border: '2px solid #ffcdd2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '16px' }}>❌</span>
          {error}
        </div>
      )}

      {users.length === 0 && !error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ color: '#6c757d', margin: '0 0 8px 0' }}>No Users Registered Yet</h3>
          <p style={{ color: '#6c757d', margin: '0' }}>
            When users register through the registration form, they will appear here.
          </p>
        </div>
      ) : (
        <div style={{ 
          overflowX: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <table 
            ref={tableRef}
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}
            aria-labelledby="user-list-heading"
            role="table"
          >
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  ID
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Username
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Email
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Registered
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  <td style={{ 
                    padding: '12px',
                    fontWeight: 'bold',
                    color: '#007bff'
                  }}>
                    #{user.id}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    fontWeight: '500'
                  }}>
                    {user.username}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    color: '#495057'
                  }}>
                    {user.email}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    {getStatusBadge(user)}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    color: '#6c757d',
                    fontSize: '13px'
                  }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    color: '#6c757d',
                    fontSize: '13px'
                  }}>
                    {formatDate(user.lastLoginAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users.length > 0 && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6c757d'
        }}>
          <strong>📊 Summary:</strong> {users.length} total users • 
          {users.filter(u => u.isActive).length} active • 
          {users.filter(u => u.isEmailVerified).length} verified • 
          {users.filter(u => u.lastLoginAt).length} have logged in
        </div>
      )}
    </div>
  );
};

export default UserList;