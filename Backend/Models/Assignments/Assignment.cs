using Backend.Models.Courses;

namespace Backend.Models.Assignments;

public class Assignment
{
    public Guid Id { get; set; }

    public Guid ActivityId { get; set; }

    public CourseActivity Activity { get; set; } = default!;

    public string Instructions { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public bool AllowLateSubmission { get; set; }

    public decimal MaxPoints { get; set; }
}
