using System.Security.Cryptography;
using System.Text;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public class UserService : IUserService
    {
        private readonly List<User> _users = new();
        private int _nextId = 1;

        public async Task<UserResponseDto> RegisterUserAsync(UserRegistrationDto registrationDto)
        {
            // Check if user already exists
            if (await UserExistsAsync(registrationDto.Username, registrationDto.Email))
            {
                throw new InvalidOperationException("User with this username or email already exists");
            }

            // Hash the password using BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);

            var user = new User
            {
                Id = _nextId++,
                Username = registrationDto.Username,
                Email = registrationDto.Email,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow
            };

            _users.Add(user);

            return new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> UserExistsAsync(string username, string email)
        {
            return await Task.FromResult(_users.Any(u => 
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) ||
                u.Email.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }
    }
}
