using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public interface IUserService
    {
        Task<UserResponseDto> RegisterUserAsync(UserRegistrationDto registrationDto);
        Task<bool> UserExistsAsync(string username, string email);
    }
}
