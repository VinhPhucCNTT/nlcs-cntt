namespace Backend.Features.Courses;

public record QueryCoursesResponse(List<CourseDto> Items, int TotalCount);
