using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // Copilot: Add an endpoint to register a user
        [HttpPost("register")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RegisterAsync([FromBody] UserRegistrationDto registrationDto)
        {
            try
            {
                _logger.LogInformation("User registration attempt for username: {Username}", registrationDto.Username);

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state for user registration: {Username}", registrationDto.Username);
                    return BadRequest(ModelState);
                }

                var user = await _userService.RegisterUserAsync(registrationDto);
                
                _logger.LogInformation("User registered successfully: {Username} with ID: {UserId}", 
                    user.Username, user.Id);

                return CreatedAtAction(nameof(RegisterAsync), new { id = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning("User registration failed - user already exists: {Username}", registrationDto.Username);
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during user registration for: {Username}", registrationDto.Username);
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "An error occurred while processing your request" });
            }
        }
    }
}
