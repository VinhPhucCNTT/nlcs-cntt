using Backend.Models.Enums;

namespace Backend.Features.Assessments.Dtos;

public record CreateAssessmentDto(
    Guid ActivityId,
    AssessmentType Type,
    int TimeLimitMinutes,
    int MaxAttempts,
    string? Password,
    decimal PassingScore,
    bool ShuffleQuestions
);
