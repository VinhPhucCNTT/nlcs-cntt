using Backend.Models;
using Backend.Models.Courses;

namespace Backend.Models.Assessments;

public class Quiz : BaseEntity
{
    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = default!;

    public string Title { get; set; } = default!;

    public ICollection<Question> Questions { get; set; }
        = [];

    public ICollection<QuizAttempt> Attempts { get; set; }
        = [];
}
