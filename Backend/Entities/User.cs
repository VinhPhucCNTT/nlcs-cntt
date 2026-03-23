namespace Backend.Entities;

public class User
{
    public string UserId { get; set; } = "";
    public string Name { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "";

    public ICollection<Course> Courses { get; } = [];
}
