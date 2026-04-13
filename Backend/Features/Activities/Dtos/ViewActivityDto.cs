using Backend.Models.Enums;

namespace Backend.Features.Activities.Dtos;

public record ViewActivityDto(
    Guid Id,
    Guid ModuleId,
    string Title,
    ActivityType Type,
    int OrderIndex,
    bool IsPublished,
    DateTime? AvailableFrom,
    DateTime? AvailableUntil
);
