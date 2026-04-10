using Backend.Models.Enums;

namespace Backend.Features.Courses;

public record UpdateCourseDto(
    string Title,
    string? Description,
    string? ThumbnailUrl,
    CourseStatus Status
 );
