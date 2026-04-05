using Backend.Models.Assessments;
using Backend.Models.Learning;

namespace Backend.Models.Courses;

public class Lesson
{
    public Guid Id { get; set; }

    public Guid SectionId { get; set; }
    public Section Section { get; set; } = default!;

    public string Title { get; set; } = default!;
    public LessonType ContentType { get; set; }

    public string? VideoUrl { get; set; }
    public int DurationSeconds { get; set; }

    public int OrderIndex { get; set; }

    public ICollection<LessonProgress> ProgressRecords { get; set; }
        = [];

    public Quiz? Quiz { get; set; }
}
