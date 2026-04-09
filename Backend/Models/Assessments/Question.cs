namespace Backend.Models.Assessments;
using Backend.Models.Enums;

public class Question
{
    public Guid Id { get; set; }

    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public string Content { get; set; } = default!;
    public QuestionType Type { get; set; }

    public ICollection<Answer> Answers { get; set; }
        = [];
}
