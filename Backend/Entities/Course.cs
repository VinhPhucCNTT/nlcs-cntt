namespace Backend.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public CourseMetadata Metadata { get; set; } = new CourseMetadata();

    public string UserId { get; set; } = "";
    public User User { get; set; } = new User();
}

public class CourseMetadata
{
    public string PasswordHash { get; set; } = "";
}
