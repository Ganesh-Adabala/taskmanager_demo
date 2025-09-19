namespace TaskManager.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        required public string Username { get; set; }

        required public string Email { get; set; }

        required public string PasswordHash { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;
    }
}