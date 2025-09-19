namespace TaskManager.Api.Models
{
    /// <summary>
    /// Model representing user registration data.
    /// </summary>
    public class UserRegistrationModel
    {
        /// <summary>
        /// The username of the user.
        /// </summary>
        public string? Username { get; set; }

        /// <summary>
        /// The password of the user.
        /// </summary>
        public string? Password { get; set; }

        /// <summary>
        /// The email address of the user.
        /// </summary>
        public string? Email { get; set; }
    }
}
