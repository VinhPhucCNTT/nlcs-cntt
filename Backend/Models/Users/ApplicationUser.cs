using Backend.Models.Courses;
using Microsoft.AspNetCore.Identity;
using Backend.Models.Learning;

namespace Backend.Models.Users;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = default!;
    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Enrollment> Enrollments { get; set; } = [];
    public ICollection<Course> CreatedCourses { get; set; } = [];
}
