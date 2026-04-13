namespace Backend.Features.Assignments.Dtos;

public record ViewAssignmentDto(
    Guid Id,
    string Instructions,
    DateTime DueDate,
    decimal MaxPoints
);
