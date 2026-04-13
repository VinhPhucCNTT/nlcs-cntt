namespace Backend.Features.Assessments.Dtos.Modify;

public record UpdateAssessmentDto(
    int TimeLimitMinutes,
    int MaxAttempts,
    string? Password,
    decimal PassingScore,
    bool ShuffleQuestions
);
