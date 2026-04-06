using Backend.Models.Users;

namespace Backend.Models.Assessments;

public class QuizAttempt
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = default!;

    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = default!;

    public double Score { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
