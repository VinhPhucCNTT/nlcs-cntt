using Backend.Data;
using Backend.Models.Courses;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Courses;

public sealed class CourseService(IDbContextFactory<AppDbContext> dbContextFatory): ICourseService
{
    private readonly IDbContextFactory<AppDbContext> _dbContextFactory = dbContextFatory;

    // TODO: Use sqids to shorten courseId
    public async Task<CourseDto?> GetCourseAsync(Guid courseId)
    {
        using var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var course = await dbContext.Courses.Include(c => c.Instructor).FirstOrDefaultAsync(c => c.Id == courseId);
        if (course is null)
            return null;

        return new CourseDto(course.Id, course.Title, course.Instructor.FullName);
    }

    public async Task<QueryCoursesResponse> QueryCoursesAsync(QueryCoursesRequest query)
    {
        using var dbContext = await _dbContextFactory.CreateDbContextAsync();
        var courses = dbContext.Courses.Include(c => c.Instructor).AsQueryable();

        if (!string.IsNullOrEmpty(query.Title))
            courses = courses.Where(c => c.Title.Contains(query.Title, StringComparison.OrdinalIgnoreCase));

        var total = await courses.CountAsync();

        var items = await courses
              .Skip((query.PageIndex - 1) * query.PageSize)
              .Take(query.PageSize)
              .Select(c => new CourseDto
              (
                  c.Id,
                  c.Title,
                  c.Instructor.FullName
              ))
              .ToListAsync();

        return new QueryCoursesResponse
        (
            items,
            total
        );
    }

    public async Task<CourseDto> CreateCourseAsync(CreateCourseDto request, Guid creatorId)
    {
        using var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            ThumbnailUrl = request.ThumbnailUrl,
            InstructorId = creatorId,
            Status = CourseStatus.Draft,
        };

        dbContext.Courses.Add(course);
        await dbContext.SaveChangesAsync();

        var courseAfter = await dbContext.Courses.Include(c => c.Instructor).FirstAsync(c => c.Id == course.Id);
        return new CourseDto(courseAfter.Id, courseAfter.Title, courseAfter.Instructor.FullName);
    }

    public async Task<CourseDto?> UpdateCourseAsync(Guid courseId, UpdateCourseDto request)
    {
        using var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
        if (course is null)
            return null;

        course.Title = request.Title;
        course.Description = request.Description;
        course.ThumbnailUrl = request.ThumbnailUrl;
        course.Status = request.Status;

        await dbContext.SaveChangesAsync();

        var courseAfter = await dbContext.Courses.Include(c => c.Instructor).FirstAsync(c => c.Id == course.Id);
        return new CourseDto(courseAfter.Id, courseAfter.Title, courseAfter.Instructor.FullName);
    }

    public async Task<bool> DeleteCourseAsync(Guid courseId)
    {
        using var dbContext = await _dbContextFactory.CreateDbContextAsync();

        var course = await dbContext.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
        if (course is null)
            return false;
        
        dbContext.Courses.Remove(course);
        await dbContext.SaveChangesAsync();

        return true;
    }
}
