using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="registrationDto">User registration data</param>
        /// <returns>User registration result</returns>
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> Register([FromBody] UserRegistrationDto registrationDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<UserResponseDto>.ErrorResult("Validation failed.", errors));
            }

            var result = await _userService.RegisterUserAsync(registrationDto);

            if (result.Success)
            {
                return Created($"api/users/{result.Data?.Id}", result);
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Check if username is available
        /// </summary>
        /// <param name="username">Username to check</param>
        /// <returns>Availability status</returns>
        [HttpGet("check-username/{username}")]
        public ActionResult<ApiResponse<bool>> CheckUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest(ApiResponse<bool>.ErrorResult("Username is required."));
            }

            var isAvailable = _userService.IsUsernameAvailable(username);
            return Ok(ApiResponse<bool>.SuccessResult(isAvailable, 
                isAvailable ? "Username is available." : "Username is taken."));
        }

        /// <summary>
        /// Check if email is available
        /// </summary>
        /// <param name="email">Email to check</param>
        /// <returns>Availability status</returns>
        [HttpGet("check-email/{email}")]
        public ActionResult<ApiResponse<bool>> CheckEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(ApiResponse<bool>.ErrorResult("Email is required."));
            }

            var isAvailable = _userService.IsEmailAvailable(email);
            return Ok(ApiResponse<bool>.SuccessResult(isAvailable, 
                isAvailable ? "Email is available." : "Email is already registered."));
        }

        /// <summary>
        /// Get all registered users (for admin/demo purposes)
        /// </summary>
        /// <returns>List of all users</returns>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<UserResponseDto>>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
        }
    }
}