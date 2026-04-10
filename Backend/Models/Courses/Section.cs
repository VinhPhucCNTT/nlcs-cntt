using Backend.Models;

namespace Backend.Models.Courses;

public class Section : BaseEntity
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = default!;

    public string Title { get; set; } = default!;
    public int OrderIndex { get; set; }

    public ICollection<Lesson> Lessons { get; set; } = [];
}
