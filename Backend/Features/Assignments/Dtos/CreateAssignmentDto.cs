namespace Backend.Features.Assignments.Dtos;

public record CreateAssignmentDto(
    Guid ActivityId,
    string Instructions,
    DateTime? DueDate,
    bool AllowLateSubmission,
    decimal MaxPoints
);
