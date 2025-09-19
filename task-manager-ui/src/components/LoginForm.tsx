import React, { useState } from "react";
import "./FormStyles.css";
import { LoginRequest, FormErrors, FormTouched } from "../types/user";

interface LoginFormProps {
  onLogin: (formData: LoginRequest) => Promise<void>;
  loading?: boolean;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading = false,
  onSwitchToRegister,
}) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(
      name as keyof LoginRequest,
      formData[name as keyof LoginRequest]
    );
  };

  const validateField = (name: keyof LoginRequest, value: string): boolean => {
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required";
        } else if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        } else {
          delete newErrors.username;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          newErrors.password =
            "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password =
            "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password = "Password must contain at least one digit";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          newErrors.password =
            "Password must contain at least one special character (@$!%*?&)";
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFormData = (): boolean => {
    const isUsernameValid = validateField("username", formData.username);
    const isPasswordValid = validateField("password", formData.password);

    setTouched({
      username: true,
      password: true,
    });

    return isUsernameValid && isPasswordValid;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateFormData()) {
      await onLogin(formData);
    }
  };

  const hasFieldError = (field: keyof FormErrors): boolean => {
    return Boolean(touched[field] && errors[field]);
  };

  return (
    <div className="login-form-container">
      <form
        className="login-form"
        onSubmit={handleFormSubmit}
        role="form"
        aria-labelledby="login-title"
        aria-describedby="login-description"
      >
        <h2 id="login-title" className="login-title">
          Login
        </h2>
        <p id="login-description" className="sr-only">
          Please enter your username and password to access your account
        </p>

        {/* Live region for form status announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {loading && "Logging in, please wait..."}
        </div>

        <fieldset className="form-fieldset">
          <legend className="sr-only">Login credentials</legend>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`form-input ${
                hasFieldError("username") ? "error" : ""
              }`}
              placeholder="Enter your username"
              disabled={loading}
              required
              aria-required="true"
              aria-invalid={hasFieldError("username")}
              aria-describedby={
                hasFieldError("username") ? "username-error" : "username-help"
              }
              autoComplete="username"
            />
            <div id="username-help" className="sr-only">
              Username must be at least 3 characters long
            </div>
            {hasFieldError("username") && (
              <span
                id="username-error"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                {errors.username}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`form-input ${
                hasFieldError("password") ? "error" : ""
              }`}
              placeholder="Enter your password"
              disabled={loading}
              required
              aria-required="true"
              aria-invalid={hasFieldError("password")}
              aria-describedby={
                hasFieldError("password") ? "password-error" : "password-help"
              }
              autoComplete="current-password"
            />
            <div id="password-help" className="sr-only">
              Password must be at least 8 characters with uppercase, lowercase,
              number, and special character
            </div>
            {hasFieldError("password") && (
              <span
                id="password-error"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                {errors.password}
              </span>
            )}
          </div>
        </fieldset>

        <button
          type="submit"
          className={`login-button ${loading ? "loading" : ""}`}
          disabled={loading || Object.keys(errors).length > 0}
          aria-describedby="login-button-help"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div id="login-button-help" className="sr-only">
          {loading
            ? "Login in progress, please wait"
            : Object.keys(errors).length > 0
            ? "Please fix form errors before submitting"
            : "Click to log in to your account"}
        </div>

        {/* Switch to register form */}
        {onSwitchToRegister && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p
              style={{
                color: "#666",
                fontSize: "0.9rem",
                marginBottom: "10px",
              }}
            >
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="secondary-button"
              disabled={loading}
              aria-label="Switch to create account form"
            >
              Create Account
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
