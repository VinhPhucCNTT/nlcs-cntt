namespace Backend.Features.Courses.Dtos;

public record CourseContentDto(
    Guid Id,
    string Title,
    List<ModuleDto> Modules
);
