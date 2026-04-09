using Backend.Models.Learning;
using Backend.Models.Users;
using Backend.Models.Enums;

namespace Backend.Models.Courses;

public class Course
{
    public Guid Id { get; set; }

    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string? ThumbnailUrl { get; set; }

    public Guid InstructorId { get; set; }
    public ApplicationUser Instructor { get; set; } = default!;

    public decimal Price { get; set; }

    public CourseStatus Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Section> Sections { get; set; } = [];
    public ICollection<Enrollment> Enrollments { get; set; } = [];
}
