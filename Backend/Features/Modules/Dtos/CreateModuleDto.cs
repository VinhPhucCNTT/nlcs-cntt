namespace Backend.Features.Modules.Dtos;

public record CreateModuleDto(
    Guid CourseId,
    string Title,
    int OrderIndex
);
