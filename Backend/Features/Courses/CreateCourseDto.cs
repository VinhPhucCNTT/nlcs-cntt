namespace Backend.Features.Courses;

public record CreateCourseDto(
    string Title,
    string Description,
    string? ThumbnailUrl
);
