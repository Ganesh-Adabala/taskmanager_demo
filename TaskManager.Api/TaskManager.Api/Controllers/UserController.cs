using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // Copilot: Add an endpoint to register a user
        // REFACTORED: Added proper DTOs, validation, security, and error handling
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponseDto<UserResponseDto>>> RegisterUserAsync([FromBody] UserRegistrationDto registrationDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .SelectMany(x => x.Value!.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDto<UserResponseDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var result = await _userService.RegisterUserAsync(registrationDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            _logger.LogInformation("User registration endpoint accessed successfully");
            return CreatedAtAction(nameof(RegisterUserAsync), result);
        }

        // REFACTORED: Added proper DTOs, validation, security, and error handling
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponseDto<LoginResponseDto>>> LoginAsync([FromBody] UserLoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .SelectMany(x => x.Value!.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                return BadRequest(new ApiResponseDto<LoginResponseDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors
                });
            }

            var result = await _userService.LoginAsync(loginDto);

            if (!result.Success)
            {
                return Unauthorized(result);
            }

            _logger.LogInformation("User login endpoint accessed successfully");
            return Ok(result);
        }
    }
}
