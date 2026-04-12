using Backend.Data;
using Backend.Models.Courses;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Courses;

public sealed class CourseService(AppDbContext dbContext): ICourseService
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<CourseDto?> GetCourseAsync(Guid courseId, CancellationToken cancellationToken)
    {
        var course = await _dbContext.Courses.Include(c => c.Instructor).FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken: cancellationToken);
        if (course is null)
            return null;

        return new CourseDto(course.Id, course.Title, course.Instructor.FullName);
    }

    public async Task<QueryCoursesResponse> QueryCoursesAsync(QueryCoursesRequest query, CancellationToken cancellationToken)
    {
        var courses = _dbContext.Courses.Include(c => c.Instructor).AsQueryable();

        if (!string.IsNullOrEmpty(query.Title))
            courses = courses.Where(c => c.Title.Contains(query.Title, StringComparison.OrdinalIgnoreCase));

        var total = await courses.CountAsync(cancellationToken: cancellationToken);

        var items = await courses
              .Skip((query.PageIndex - 1) * query.PageSize)
              .Take(query.PageSize)
              .Select(c => new CourseDto
              (
                  c.Id,
                  c.Title,
                  c.Instructor.FullName
              ))
              .ToListAsync(cancellationToken: cancellationToken);

        return new QueryCoursesResponse
        (
            items,
            total
        );
    }

    public async Task<CourseDto> CreateCourseAsync(CreateCourseDto request, Guid creatorId, CancellationToken cancellationToken)
    {
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            ThumbnailUrl = request.ThumbnailUrl,
            InstructorId = creatorId,
        };

        _dbContext.Courses.Add(course);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var courseAfter = await _dbContext.Courses.Include(c => c.Instructor).FirstAsync(c => c.Id == course.Id, cancellationToken: cancellationToken);
        return new CourseDto(courseAfter.Id, courseAfter.Title, courseAfter.Instructor.FullName);
    }

    public async Task<CourseDto?> UpdateCourseAsync(Guid courseId, UpdateCourseDto request, CancellationToken cancellationToken)
    {
        var course = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken: cancellationToken);
        if (course is null)
            return null;

        course.Title = request.Title;
        course.Description = request.Description;
        course.ThumbnailUrl = request.ThumbnailUrl;

        await _dbContext.SaveChangesAsync(cancellationToken);

        var courseAfter = await _dbContext.Courses.Include(c => c.Instructor).FirstAsync(c => c.Id == course.Id, cancellationToken: cancellationToken);
        return new CourseDto(courseAfter.Id, courseAfter.Title, courseAfter.Instructor.FullName);
    }

    public async Task<bool> DeleteCourseAsync(Guid courseId, CancellationToken cancellationToken)
    {
        var course = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken: cancellationToken);
        if (course is null)
            return false;
        
        _dbContext.Courses.Remove(course);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }
}
