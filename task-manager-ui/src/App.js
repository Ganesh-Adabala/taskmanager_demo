import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const validateInputs = () => {
    if (!username.trim()) {
      setError("Username is required.");
      return false;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          email: username + "@example.com" // Demo: use username as email
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message + "\nUser ID: " + data.userId);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="app-container" role="main" aria-labelledby="login-title">
      <h1 id="login-title">Login</h1>
      <form onSubmit={handleSubmit} aria-describedby="login-desc" noValidate>
        <p id="login-desc" style={{position: 'absolute', left: '-9999px'}}>Enter your username and password to log in.</p>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
            aria-label="Username"
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            aria-label="Password"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div role="alert" style={{ color: "#d32f2f", marginBottom: 12 }}>
            {error}
          </div>
        )}
        <button type="submit" className="login-btn" aria-label="Login to your account">Login</button>
      </form>
    </div>
  );
}

export default App;
