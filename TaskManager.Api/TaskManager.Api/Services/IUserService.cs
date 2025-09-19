using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public interface IUserService
    {
        Task<ApiResponseDto<UserResponseDto>> RegisterUserAsync(UserRegistrationDto registrationDto);
        Task<ApiResponseDto<LoginResponseDto>> LoginAsync(UserLoginDto loginDto);
        Task<bool> UserExistsAsync(string email);
    }
}
