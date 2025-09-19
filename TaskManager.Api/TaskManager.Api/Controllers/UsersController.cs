// UsersController handles user-related API endpoints such as registration.
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
    /// <summary>
    /// Registers a new user with the provided username, password, and email.
    /// </summary>
    /// <param name="model">User registration data</param>
    /// <returns>Success or error message</returns>
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegistrationModel model)
        {
            // TODO: Add logic to save user to database
            if (string.IsNullOrWhiteSpace(model.Username) || string.IsNullOrWhiteSpace(model.Password) || string.IsNullOrWhiteSpace(model.Email))
            {
                return BadRequest("All fields are required.");
            }
            // Hash the password using bcrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // TODO: Save model.Username, hashedPassword, and model.Email to database

            // For demo purposes, generate a fake userId. In a real app, this would come from the database.
            var userId = Guid.NewGuid();
            return Ok(new { message = "User registered successfully.", userId });
        }
    }
}
