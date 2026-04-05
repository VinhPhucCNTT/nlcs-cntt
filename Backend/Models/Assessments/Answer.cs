namespace Backend.Models.Assessments;

public class Answer
{
    public Guid Id { get; set; }

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = default!;

    public string Content { get; set; } = default!;
    public bool IsCorrect { get; set; }
}
