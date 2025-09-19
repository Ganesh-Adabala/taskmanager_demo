import React, { useState, useEffect, useRef } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useToast } from "./components/Toast";
import { RegisterRequest } from "./types/user";

// Auth views enum for better type safety
type AuthView = "login" | "register";

// User interface
interface User {
  username: string;
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AuthView>("login");

  // Toast notifications
  const { toast, ToastContainer } = useToast();

  // Refs for focus management
  const mainContentRef = useRef<HTMLDivElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Handle login with enhanced error handling and accessibility
  const handleLogin = async (formData: {
    username: string;
    password: string;
  }) => {
    setAuthLoading(true);

    try {
      console.log("Login attempt:", formData);

      // Announce login attempt to screen readers
      toast.info(
        "Signing in...",
        "Please wait while we verify your credentials"
      );

      // Replace this with actual API call to your backend
      // const response = await fetch('https://localhost:7299/api/users/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const newUser: User = {
        username: formData.username,
        id: 1,
        email: `${formData.username}@example.com`,
        firstName:
          formData.username.charAt(0).toUpperCase() +
          formData.username.slice(1),
        lastName: "User",
      };

      setUser(newUser);
      setIsLoggedIn(true);

      // Success notification
      toast.success(
        "Welcome back!",
        `Successfully signed in as ${newUser.firstName}`
      );

      // Focus management for screen readers
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Login failed:", error);

      // Error notification
      toast.error(
        "Sign in failed",
        "Please check your username and password and try again.",
        { persistent: true }
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle registration with enhanced feedback
  const handleRegister = async (formData: RegisterRequest) => {
    setAuthLoading(true);

    try {
      console.log("Registration attempt:", formData);

      // Announce registration attempt
      toast.info(
        "Creating account...",
        "Please wait while we set up your account"
      );

      // Replace this with actual API call to your backend
      // const response = await fetch('https://localhost:7299/api/users/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful registration
      const newUser: User = {
        username: formData.username,
        id: Date.now(), // Mock ID
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      setUser(newUser);
      setIsLoggedIn(true);

      // Success notification
      toast.success(
        "Account created successfully!",
        `Welcome to Task Manager, ${newUser.firstName}!`
      );

      // Focus management
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Registration failed:", error);

      // Error notification
      toast.error(
        "Registration failed",
        "There was an issue creating your account. Please try again.",
        { persistent: true }
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView("login");

    // Success notification
    toast.success("Signed out", "You have been successfully signed out");

    // Focus management - return focus to main heading
    setTimeout(() => {
      const heading = document.querySelector("h1");
      if (heading) {
        (heading as HTMLElement).focus();
      }
    }, 100);
  };

  // Handle view switching with focus management
  const handleViewSwitch = (view: AuthView) => {
    setCurrentView(view);

    // Announce view change to screen readers
    const viewName = view === "login" ? "Sign In" : "Create Account";
    toast.info(`Switched to ${viewName}`, "Form has been updated");
  };

  // Skip link handler for keyboard navigation
  const handleSkipToMain = (event: React.MouseEvent) => {
    event.preventDefault();
    if (mainContentRef.current) {
      mainContentRef.current.focus();
      mainContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Keyboard navigation for the app
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "l":
            if (!isLoggedIn) {
              event.preventDefault();
              setCurrentView("login");
            }
            break;
          case "r":
            if (!isLoggedIn) {
              event.preventDefault();
              setCurrentView("register");
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoggedIn]);

  // Logged in view with enhanced accessibility
  if (isLoggedIn && user) {
    return (
      <>
        <div className="app">
          {/* Skip link for keyboard users */}
          <a
            ref={skipLinkRef}
            href="#main-content"
            className="skip-link"
            onClick={handleSkipToMain}
          >
            Skip to main content
          </a>

          {/* Header with navigation */}
          <header role="banner">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #e1e5e9",
                backgroundColor: "#ffffff",
              }}
            >
              <h1 style={{ margin: 0, color: "#333" }}>Task Manager Demo</h1>
              <nav aria-label="User navigation">
                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                  <span
                    aria-label={`Signed in as ${user.firstName} ${user.lastName}`}
                  >
                    Welcome, {user.firstName}!
                  </span>
                  <button
                    onClick={handleLogout}
                    aria-label="Sign out of your account"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main
            id="main-content"
            ref={mainContentRef}
            tabIndex={-1}
            style={{ padding: "40px 20px", outline: "none" }}
            role="main"
            aria-label="Task management dashboard"
          >
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <h2 style={{ marginBottom: "20px", color: "#333" }}>Dashboard</h2>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "30px",
                  borderRadius: "8px",
                  border: "1px solid #e1e5e9",
                }}
              >
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", margin: 0 }}>
                  Welcome to your Task Manager! This is where your task
                  management functionality would be implemented. You can now
                  manage your tasks, set priorities, and track your progress.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Toast notifications */}
        <ToastContainer />
      </>
    );
  }

  // Authentication view with form switching
  return (
    <>
      <div
        className="app"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
      >
        {/* Skip link */}
        <a
          ref={skipLinkRef}
          href="#main-content"
          className="skip-link"
          onClick={handleSkipToMain}
        >
          Skip to main content
        </a>

        {/* Header */}
        <header
          role="banner"
          style={{ padding: "20px 0", textAlign: "center" }}
        >
          <h1
            style={{
              margin: "0 0 10px 0",
              color: "#333",
              fontSize: "2rem",
              fontWeight: "600",
            }}
          >
            Task Manager Demo
          </h1>
          <p
            style={{
              color: "#666",
              margin: 0,
              fontSize: "1rem",
            }}
          >
            Organize your tasks and boost productivity
          </p>
        </header>

        {/* Main content */}
        <main
          id="main-content"
          ref={mainContentRef}
          tabIndex={-1}
          style={{ outline: "none", padding: "0 20px" }}
          role="main"
        >
          {/* Navigation tabs for auth forms */}
          <nav
            aria-label="Authentication options"
            style={{
              maxWidth: "500px",
              margin: "0 auto 20px auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                backgroundColor: "#ffffff",
                border: "1px solid #e1e5e9",
                borderRadius: "6px",
                padding: "4px",
              }}
            >
              <button
                onClick={() => handleViewSwitch("login")}
                aria-pressed={currentView === "login"}
                className={
                  currentView === "login" ? "active-tab" : "inactive-tab"
                }
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor:
                    currentView === "login" ? "#007bff" : "transparent",
                  color: currentView === "login" ? "white" : "#666",
                  transition: "all 0.2s ease",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleViewSwitch("register")}
                aria-pressed={currentView === "register"}
                className={
                  currentView === "register" ? "active-tab" : "inactive-tab"
                }
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor:
                    currentView === "register" ? "#007bff" : "transparent",
                  color: currentView === "register" ? "white" : "#666",
                  transition: "all 0.2s ease",
                }}
              >
                Create Account
              </button>
            </div>
          </nav>

          {/* Form container with accessibility enhancements */}
          <section
            aria-label={
              currentView === "login" ? "Sign in form" : "Create account form"
            }
            aria-live="polite"
          >
            {currentView === "login" ? (
              <LoginForm
                onLogin={handleLogin}
                loading={authLoading}
                onSwitchToRegister={() => handleViewSwitch("register")}
              />
            ) : (
              <RegisterForm
                onRegister={handleRegister}
                loading={authLoading}
                onSwitchToLogin={() => handleViewSwitch("login")}
              />
            )}
          </section>

          {/* Keyboard shortcuts help */}
          <aside
            style={{
              maxWidth: "500px",
              margin: "30px auto 0 auto",
              padding: "15px",
              backgroundColor: "#ffffff",
              border: "1px solid #e1e5e9",
              borderRadius: "6px",
              fontSize: "0.85rem",
              color: "#666",
            }}
            aria-label="Keyboard shortcuts"
          >
            <strong>Keyboard shortcuts:</strong>
            <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
              <li>Ctrl+L (Cmd+L): Switch to Sign In</li>
              <li>Ctrl+R (Cmd+R): Switch to Create Account</li>
              <li>Tab: Navigate between fields</li>
              <li>Enter: Submit form</li>
            </ul>
          </aside>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
