using TaskManager.Api.Models;
using TaskManager.Api.DTOs;

namespace TaskManager.Api.Services
{
    public interface IUserService
    {
        Task<ApiResponse<UserResponseDto>> RegisterUserAsync(UserRegistrationDto registrationDto);
        bool IsUsernameAvailable(string username);
        bool IsEmailAvailable(string email);
        Task<ApiResponse<List<UserResponseDto>>> GetAllUsersAsync();
    }

    public class UserService : IUserService
    {
        private readonly List<User> _users = new();
        private int _nextUserId = 1;
        private readonly object _lockObject = new();

        // Constructor for debugging
        public UserService()
        {
            Console.WriteLine($"[DEBUG] UserService instance created at {DateTime.Now}");
        }

        // Simple password hashing for demo (use BCrypt in production!)
        private static string HashPassword(string password)
        {
            // TODO: Replace with proper BCrypt hashing in production
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"SALT_{password}_HASH"));
        }

        public async Task<ApiResponse<UserResponseDto>> RegisterUserAsync(UserRegistrationDto registrationDto)
        {
            return await Task.Run(() =>
            {
                lock (_lockObject)
                {
                    // Check if username already exists
                    if (!IsUsernameAvailable(registrationDto.Username))
                    {
                        return ApiResponse<UserResponseDto>.ErrorResult("Username is already taken.");
                    }

                    // Check if email already exists
                    if (!IsEmailAvailable(registrationDto.Email))
                    {
                        return ApiResponse<UserResponseDto>.ErrorResult("Email is already registered.");
                    }

                    // Create new user with hashed password
                    var user = new User
                    {
                        Id = _nextUserId++,
                        Username = registrationDto.Username,
                        Email = registrationDto.Email,
                        PasswordHash = HashPassword(registrationDto.Password),
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true,
                        IsEmailVerified = false
                    };

                    _users.Add(user);
                    Console.WriteLine($"[DEBUG] User registered successfully. ID: {user.Id}, Username: {user.Username}, Total users: {_users.Count}");

                    var userResponse = new UserResponseDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt,
                        IsActive = user.IsActive,
                        IsEmailVerified = user.IsEmailVerified,
                        LastLoginAt = user.LastLoginAt
                    };

                    return ApiResponse<UserResponseDto>.SuccessResult(userResponse, "User registered successfully.");
                }
            });
        }

        public bool IsUsernameAvailable(string username)
        {
            lock (_lockObject)
            {
                return !_users.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
            }
        }

        public bool IsEmailAvailable(string email)
        {
            lock (_lockObject)
            {
                return !_users.Any(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            }
        }

        public async Task<ApiResponse<List<UserResponseDto>>> GetAllUsersAsync()
        {
            return await Task.Run(() =>
            {
                lock (_lockObject)
                {
                    Console.WriteLine($"[DEBUG] GetAllUsersAsync called. Current users count: {_users.Count}");
                    
                    if (_users.Count > 0)
                    {
                        Console.WriteLine($"[DEBUG] Users in memory:");
                        foreach (var user in _users)
                        {
                            Console.WriteLine($"  - ID: {user.Id}, Username: {user.Username}, Email: {user.Email}");
                        }
                    }

                    var userList = _users.Select(u => new UserResponseDto
                    {
                        Id = u.Id,
                        Username = u.Username,
                        Email = u.Email,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt,
                        IsActive = u.IsActive,
                        IsEmailVerified = u.IsEmailVerified,
                        LastLoginAt = u.LastLoginAt
                    }).OrderByDescending(u => u.CreatedAt).ToList();

                    Console.WriteLine($"[DEBUG] Returning {userList.Count} users");
                    return ApiResponse<List<UserResponseDto>>.SuccessResult(userList, 
                        $"Retrieved {userList.Count} users successfully.");
                }
            });
        }
    }
}