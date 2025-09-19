import React, { useState } from "react";
import "./FormStyles.css";
import { RegisterRequest, FormErrors, FormTouched } from "../types/user";

interface RegisterFormProps {
  onRegister: (formData: RegisterRequest) => Promise<void>;
  loading?: boolean;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  loading = false,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      name as keyof RegisterRequest,
      formData[name as keyof RegisterRequest] || ""
    );
  };

  const validateField = (
    name: keyof RegisterRequest,
    value: string
  ): boolean => {
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required";
        } else if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        } else if (value.length > 50) {
          newErrors.username = "Username cannot exceed 50 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username =
            "Username can only contain letters, numbers, and underscores";
        } else {
          delete newErrors.username;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else if (value.length > 100) {
          newErrors.email = "Email cannot exceed 100 characters";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (value.length > 100) {
          newErrors.password = "Password cannot exceed 100 characters";
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

      case "firstName":
        if (value && value.length > 50) {
          newErrors.firstName = "First name cannot exceed 50 characters";
        } else if (value && !/^[a-zA-Z\s'-]+$/.test(value)) {
          newErrors.firstName =
            "First name can only contain letters, spaces, hyphens, and apostrophes";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (value && value.length > 50) {
          newErrors.lastName = "Last name cannot exceed 50 characters";
        } else if (value && !/^[a-zA-Z\s'-]+$/.test(value)) {
          newErrors.lastName =
            "Last name can only contain letters, spaces, hyphens, and apostrophes";
        } else {
          delete newErrors.lastName;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validateFormData = (): boolean => {
    const isUsernameValid = validateField("username", formData.username);
    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);
    const isFirstNameValid = validateField(
      "firstName",
      formData.firstName || ""
    );
    const isLastNameValid = validateField("lastName", formData.lastName || "");

    setTouched({
      username: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
    });

    return (
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isFirstNameValid &&
      isLastNameValid
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateFormData()) {
      await onRegister(formData);
    }
  };

  const hasFieldError = (field: keyof FormErrors): boolean => {
    return Boolean(touched[field] && errors[field]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length < 8) return "weak";

    let score = 0;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;

    if (score < 3) return "weak";
    if (score === 3) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="form-container">
      <form
        className="auth-form"
        onSubmit={handleFormSubmit}
        noValidate
        aria-labelledby="register-title"
        aria-describedby="register-description"
      >
        <h2 id="register-title" className="form-title">
          Create Account
        </h2>
        <p id="register-description" className="form-description">
          Fill out the form below to create your new account. Required fields
          are marked with an asterisk (*).
        </p>

        {/* Live region for form status announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {loading && "Creating account, please wait..."}
        </div>

        <fieldset className="form-fieldset">
          <legend className="sr-only">Account Information</legend>

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="register-username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="register-username"
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
              maxLength={50}
            />
            <div id="username-help" className="field-help">
              3-50 characters, letters, numbers, and underscores only
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

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`form-input ${hasFieldError("email") ? "error" : ""}`}
              placeholder="Enter your email address"
              disabled={loading}
              required
              aria-required="true"
              aria-invalid={hasFieldError("email")}
              aria-describedby={
                hasFieldError("email") ? "email-error" : "email-help"
              }
              autoComplete="email"
              maxLength={100}
            />
            <div id="email-help" className="field-help">
              Valid email address (e.g., user@example.com)
            </div>
            {hasFieldError("email") && (
              <span
                id="email-error"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Password *
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
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
                  hasFieldError("password")
                    ? "password-error"
                    : "password-help password-strength"
                }
                autoComplete="new-password"
                maxLength={100}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={0}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div id="password-help" className="field-help">
              At least 8 characters with uppercase, lowercase, number, and
              special character
            </div>
            {formData.password && (
              <div
                id="password-strength"
                className={`password-strength ${passwordStrength}`}
                aria-live="polite"
              >
                Password strength: {passwordStrength}
              </div>
            )}
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

          {/* First Name Field */}
          <div className="form-group">
            <label htmlFor="register-firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="register-firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`form-input ${
                hasFieldError("firstName") ? "error" : ""
              }`}
              placeholder="Enter your first name (optional)"
              disabled={loading}
              aria-invalid={hasFieldError("firstName")}
              aria-describedby={
                hasFieldError("firstName")
                  ? "firstName-error"
                  : "firstName-help"
              }
              autoComplete="given-name"
              maxLength={50}
            />
            <div id="firstName-help" className="field-help">
              Optional - letters, spaces, hyphens, and apostrophes only
            </div>
            {hasFieldError("firstName") && (
              <span
                id="firstName-error"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                {errors.firstName}
              </span>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="register-lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="register-lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`form-input ${
                hasFieldError("lastName") ? "error" : ""
              }`}
              placeholder="Enter your last name (optional)"
              disabled={loading}
              aria-invalid={hasFieldError("lastName")}
              aria-describedby={
                hasFieldError("lastName") ? "lastName-error" : "lastName-help"
              }
              autoComplete="family-name"
              maxLength={50}
            />
            <div id="lastName-help" className="field-help">
              Optional - letters, spaces, hyphens, and apostrophes only
            </div>
            {hasFieldError("lastName") && (
              <span
                id="lastName-error"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                {errors.lastName}
              </span>
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button
            type="submit"
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading || Object.keys(errors).length > 0}
            aria-describedby="register-button-help"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onSwitchToLogin}
            disabled={loading}
            aria-describedby="switch-login-help"
          >
            Already have an account? Sign In
          </button>
        </div>

        <div id="register-button-help" className="sr-only">
          {loading
            ? "Account creation in progress, please wait"
            : Object.keys(errors).length > 0
            ? "Please fix form errors before submitting"
            : "Click to create your new account"}
        </div>

        <div id="switch-login-help" className="sr-only">
          Switch to the login form if you already have an account
        </div>
        {/* Switch to login form */}
        {onSwitchToLogin && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p
              style={{
                color: "#666",
                fontSize: "0.9rem",
                marginBottom: "10px",
              }}
            >
              Already have an account?
            </p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="secondary-button"
              disabled={loading}
              aria-label="Switch to sign in form"
            >
              Sign In
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
