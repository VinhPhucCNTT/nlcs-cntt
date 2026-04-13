using Backend.Models.Enums;

namespace Backend.Features.Activities.Dtos;

public record ViewActivityDto(
    Guid Id,
    string Title,
    ActivityType Type,
    int OrderIndex,
    DateTime? AvailableFrom,
    DateTime? AvailableUntil
);
