using TaskManager.Api.Models;
using BCrypt.Net;
using System.Collections.Concurrent;

namespace TaskManager.Api.Services
{
    public class UserService : IUserService
    {
        // In-memory storage for demo purposes - in production, use a proper database
        private static readonly ConcurrentDictionary<string, UserData> _users = new();
        private readonly ILogger<UserService> _logger;

        public UserService(ILogger<UserService> logger)
        {
            _logger = logger;
        }

        public async Task<ApiResponseDto<UserResponseDto>> RegisterUserAsync(UserRegistrationDto registrationDto)
        {
            try
            {
                // Check if user already exists
                if (await UserExistsAsync(registrationDto.Email))
                {
                    return new ApiResponseDto<UserResponseDto>
                    {
                        Success = false,
                        Message = "User registration failed",
                        Errors = new List<string> { "A user with this email already exists" }
                    };
                }

                // Hash password using BCrypt
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password, BCrypt.Net.BCrypt.GenerateSalt(12));

                var userData = new UserData
                {
                    UserId = Guid.NewGuid(),
                    Email = registrationDto.Email.ToLowerInvariant(),
                    Username = registrationDto.Username,
                    HashedPassword = hashedPassword,
                    CreatedAt = DateTime.UtcNow
                };

                _users.TryAdd(userData.Email, userData);

                _logger.LogInformation("User registered successfully: {Email}", userData.Email);

                return new ApiResponseDto<UserResponseDto>
                {
                    Success = true,
                    Message = "User registered successfully",
                    Data = new UserResponseDto
                    {
                        UserId = userData.UserId,
                        Email = userData.Email,
                        Username = userData.Username,
                        CreatedAt = userData.CreatedAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user registration");
                return new ApiResponseDto<UserResponseDto>
                {
                    Success = false,
                    Message = "An error occurred during registration",
                    Errors = new List<string> { "Internal server error" }
                };
            }
        }

        public async Task<ApiResponseDto<LoginResponseDto>> LoginAsync(UserLoginDto loginDto)
        {
            try
            {
                var email = loginDto.Email.ToLowerInvariant();
                
                if (!_users.TryGetValue(email, out var userData))
                {
                    // Use a generic error message to prevent email enumeration
                    await Task.Delay(100); // Prevent timing attacks
                    return new ApiResponseDto<LoginResponseDto>
                    {
                        Success = false,
                        Message = "Invalid credentials",
                        Errors = new List<string> { "Email or password is incorrect" }
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, userData.HashedPassword))
                {
                    _logger.LogWarning("Failed login attempt for user: {Email}", email);
                    return new ApiResponseDto<LoginResponseDto>
                    {
                        Success = false,
                        Message = "Invalid credentials",
                        Errors = new List<string> { "Email or password is incorrect" }
                    };
                }

                // Generate a mock JWT token (in production, use proper JWT library)
                var token = GenerateMockJwtToken(userData);
                var expiresAt = DateTime.UtcNow.AddHours(24);

                _logger.LogInformation("User logged in successfully: {Email}", email);

                return new ApiResponseDto<LoginResponseDto>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new LoginResponseDto
                    {
                        Token = token,
                        Email = userData.Email,
                        ExpiresAt = expiresAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login");
                return new ApiResponseDto<LoginResponseDto>
                {
                    Success = false,
                    Message = "An error occurred during login",
                    Errors = new List<string> { "Internal server error" }
                };
            }
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            await Task.CompletedTask; // Simulate async operation
            return _users.ContainsKey(email.ToLowerInvariant());
        }

        private string GenerateMockJwtToken(UserData userData)
        {
            // In production, use System.IdentityModel.Tokens.Jwt
            var payload = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(
                $"{{\"sub\":\"{userData.UserId}\",\"email\":\"{userData.Email}\",\"exp\":{DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds()}}}"));
            return $"mock.{payload}.signature";
        }

        private class UserData
        {
            public Guid UserId { get; set; }
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string HashedPassword { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
        }
    }
}
