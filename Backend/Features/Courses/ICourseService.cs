namespace Backend.Features.Courses;

public interface ICourseService
{
    public Task<CourseDto?> GetCourseAsync(Guid courseId);
    public Task<QueryCoursesResponse> QueryCoursesAsync(QueryCoursesRequest query);
    public Task<CourseDto> CreateCourseAsync(CreateCourseDto request, Guid creatorId);
    public Task<CourseDto?> UpdateCourseAsync(Guid courseId, UpdateCourseDto request);
    public Task<bool> DeleteCourseAsync(Guid courseId);
}
