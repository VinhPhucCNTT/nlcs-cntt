namespace Backend.Features.Courses;

public interface ICourseService
{
    public Task<CourseDto?> GetCourseAsync(Guid courseId, CancellationToken cancellationToken);
    public Task<QueryCoursesResponse> QueryCoursesAsync(QueryCoursesRequest query, CancellationToken cancellationToken);
    public Task<CourseDto> CreateCourseAsync(CreateCourseDto request, Guid creatorId, CancellationToken cancellationToken);
    public Task<CourseDto?> UpdateCourseAsync(Guid courseId, UpdateCourseDto request, CancellationToken cancellationToken);
    public Task<bool> DeleteCourseAsync(Guid courseId, CancellationToken cancellationToken);
}
