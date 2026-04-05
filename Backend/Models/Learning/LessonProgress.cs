using Backend.Models.Users;
using Models.Courses;

namespace Backend.Models.Learning;

public class LessonProgress
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = default!;

    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = default!;

    public bool IsCompleted { get; set; }

    public double ProgressPercent { get; set; }

    public DateTime? LastWatchedAt { get; set; }
}
