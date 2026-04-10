namespace Backend.Features.Courses;

public class QueryCoursesRequest
{
    public string? Title { get; set; }
    public string? InstructorName { get; set; }
    // public int? CategoryId { get; set; }

    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
