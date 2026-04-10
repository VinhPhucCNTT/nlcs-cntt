using Backend.Models;
using Backend.Models.Courses;
using Backend.Models.Users;
using Backend.Models.Enums;

namespace Backend.Models.Learning;

public class Enrollment : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = default!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    public EnrollmentStatus Status { get; set; }
}
