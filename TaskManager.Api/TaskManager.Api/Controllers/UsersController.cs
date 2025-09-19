namespace TaskManager.Api.Controllers
{
    using System.Security.Cryptography;
    using System.Text;
    using Microsoft.AspNetCore.Mvc;
    using TaskManager.Api.DTOs;
    using TaskManager.Api.Models;

    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // In-memory storage for demonstration purposes
        // In a real application, you would use a database
        private static readonly List<User> Users = new();
        private static readonly object LockObject = new();
        private static int nextId = 1;

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] RegisterUserRequest request)
        {
            try
            {
                // Validate the request
                if (!ModelState.IsValid)
                {
                    var validationResponse = new ApiValidationErrorResponse
                    {
                        ValidationErrors = ModelState
                            .Where(x => x.Value?.Errors.Count > 0)
                            .ToDictionary(
                                kvp => kvp.Key,
                                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())
                    };
                    return BadRequest(validationResponse);
                }

                // Sanitize input
                request.Username = request.Username.Trim();
                request.Email = request.Email.Trim().ToLowerInvariant();
                request.FirstName = request.FirstName?.Trim();
                request.LastName = request.LastName?.Trim();

                // Check if username already exists
                if (Users.Any(u => u.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(new ApiConflictResponse("Username already exists"));
                }

                // Check if email already exists
                if (Users.Any(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(new ApiConflictResponse("Email address is already registered"));
                }

                // Hash the password asynchronously (CPU-bound operation)
                var passwordHash = await Task.Run(() => HashPassword(request.Password));

                User user;
                lock (LockObject)
                {
                    var userId = nextId++;

                    // Create new user
                    user = new User
                    {
                        Id = userId,
                        Username = request.Username,
                        Email = request.Email,
                        PasswordHash = passwordHash,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true,
                    };

                    // Add to our in-memory storage
                    Users.Add(user);
                }

                // Create response
                var response = new RegisterUserResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    CreatedAt = user.CreatedAt
                };

                return CreatedAtAction(nameof(GetUserAsync), new { id = user.Id }, response);
            }
            catch (Exception)
            {
                var errorResponse = new ApiErrorResponse
                {
                    Message = "An error occurred while registering the user",
                    ErrorCode = "REGISTRATION_ERROR"
                };
                return StatusCode(500, errorResponse);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] LoginRequest request)
        {
            try
            {
                // Validate the request
                if (!ModelState.IsValid)
                {
                    var validationResponse = new ApiValidationErrorResponse
                    {
                        ValidationErrors = ModelState
                            .Where(x => x.Value?.Errors.Count > 0)
                            .ToDictionary(
                                kvp => kvp.Key,
                                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>()
                            )
                    };
                    return BadRequest(validationResponse);
                }

                // Find user by username
                var user = Users.FirstOrDefault(u =>
                    u.Username.Equals(request.Username, StringComparison.OrdinalIgnoreCase) &&
                    u.IsActive);

                if (user == null)
                {
                    var errorResponse = new ApiErrorResponse
                    {
                        Message = "Invalid username or password",
                        ErrorCode = "INVALID_CREDENTIALS"
                    };
                    return BadRequest(errorResponse);
                }

                // Verify password asynchronously (CPU-bound operation)
                var isPasswordValid = await Task.Run(() => VerifyPassword(request.Password, user.PasswordHash));
                if (!isPasswordValid)
                {
                    var errorResponse = new ApiErrorResponse
                    {
                        Message = "Invalid username or password",
                        ErrorCode = "INVALID_CREDENTIALS"
                    };
                    return BadRequest(errorResponse);
                }

                // Create response (excluding sensitive information)
                var response = new LoginResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    // In a real application, you would generate a JWT token here
                    Token = GenerateToken(user.Id, user.Username)
                };

                return Ok(response);
            }
            catch (Exception)
            {
                var errorResponse = new ApiErrorResponse
                {
                    Message = "An error occurred during login",
                    ErrorCode = "LOGIN_ERROR"
                };
                return StatusCode(500, errorResponse);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync(int id)
        {
            var user = await Task.Run(() => Users.FirstOrDefault(u => u.Id == id && u.IsActive));
            if (user == null)
            {
                var errorResponse = new ApiErrorResponse
                {
                    Message = "User not found",
                    ErrorCode = "USER_NOT_FOUND"
                };
                return NotFound(errorResponse);
            }

            var response = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var usersList = await Task.Run(() => Users.Where(u => u.IsActive).Select(u => new UserResponse
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                CreatedAt = u.CreatedAt
            }).ToList());

            return Ok(usersList);
        }

        private static string HashPassword(string password)
        {
            // Generate a random salt
            var salt = GenerateSalt();

            // Use PBKDF2 with SHA256 for secure password hashing (100,000+ iterations recommended)
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(32); // 256 bits

            // Combine salt and hash for storage
            var saltAndHash = new byte[salt.Length + hash.Length];
            Array.Copy(salt, 0, saltAndHash, 0, salt.Length);
            Array.Copy(hash, 0, saltAndHash, salt.Length, hash.Length);

            return Convert.ToBase64String(saltAndHash);
        }

        private static bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                var saltAndHash = Convert.FromBase64String(hashedPassword);
                var salt = new byte[16]; // 128 bits salt
                var hash = new byte[32]; // 256 bits hash

                Array.Copy(saltAndHash, 0, salt, 0, salt.Length);
                Array.Copy(saltAndHash, salt.Length, hash, 0, hash.Length);

                using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
                var testHash = pbkdf2.GetBytes(32);

                return SlowEquals(hash, testHash);
            }
            catch
            {
                return false;
            }
        }

        private static byte[] GenerateSalt()
        {
            var salt = new byte[16]; // 128 bits
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);
            return salt;
        }

        private static bool SlowEquals(byte[] a, byte[] b)
        {
            var diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
                diff |= (uint)(a[i] ^ b[i]);
            return diff == 0;
        }

        private static string GenerateToken(int userId, string username)
        {
            // In a real application, you would generate a proper JWT token here
            // For demonstration purposes, we'll create a simple base64 encoded string
            var tokenData = $"{userId}:{username}:{DateTime.UtcNow:yyyyMMddHHmmss}";
            var tokenBytes = Encoding.UTF8.GetBytes(tokenData);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}