namespace TaskManager.Api.DTOs
{
    using System.ComponentModel.DataAnnotations;

    // Request DTOs
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        required public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        required public string Password { get; set; }
    }

    public class RegisterUserRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        required public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        required public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        required public string Password { get; set; }

        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string? FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string? LastName { get; set; }
    }

    // Response DTOs
    public class LoginResponse
    {
        public int Id { get; set; }

        required public string Username { get; set; }

        required public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Token { get; set; }

        public string Message { get; set; } = "Login successful";
    }

    public class RegisterUserResponse
    {
        public int Id { get; set; }

        required public string Username { get; set; }

        required public string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Message { get; set; } = "User registered successfully";
    }

    public class UserResponse
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    // Error Response DTOs
    public class ApiErrorResponse
    {
        public string Message { get; set; } = string.Empty;

        public string ErrorCode { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class ApiValidationErrorResponse : ApiErrorResponse
    {
        public ApiValidationErrorResponse()
        {
            this.Message = "One or more validation errors occurred";
            this.ErrorCode = "VALIDATION_ERROR";
        }

        public Dictionary<string, string[]> ValidationErrors { get; set; } = new();
    }

    public class ApiConflictResponse : ApiErrorResponse
    {
        public ApiConflictResponse(string message)
            : base()
        {
            this.Message = message;
            this.ErrorCode = "CONFLICT";
        }
    }
}