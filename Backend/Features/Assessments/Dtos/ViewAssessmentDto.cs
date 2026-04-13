using Backend.Models.Enums;

namespace Backend.Features.Assessments.Dtos;

public record ViewAssessmentDto(
    Guid Id,
    Guid ActivityId,
    AssessmentType Type,
    int TimeLimitMinutes,
    int MaxAttempts,
    string? Password,
    decimal PassingScore,
    bool ShuffleQuestions,
    int QuestionCount
);
