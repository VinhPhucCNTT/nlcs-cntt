using Backend.Models;
using Backend.Models.Enums;

namespace Backend.Models.Assessments;

public class Question : BaseEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public string Content { get; set; } = default!;
    public QuestionType Type { get; set; }

    public ICollection<Answer> Answers { get; set; }
        = [];
}
