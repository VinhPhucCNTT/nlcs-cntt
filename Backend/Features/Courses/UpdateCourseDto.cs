namespace Backend.Features.Courses;

public record UpdateCourseDto(
    string Title,
    string? Description,
    string? ThumbnailUrl
 );
