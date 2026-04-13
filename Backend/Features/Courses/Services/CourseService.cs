using Backend.Data.Repositories;
using Backend.Data.UnitOfWork;
using Backend.Features.Courses.Dtos;
using Backend.Models.Courses;

namespace Backend.Features.Courses.Services;

public class CourseService(
    ICourseRepository courseRepo,
    IModuleRepository moduleRepo,
    IUnitOfWork uow) : ICourseService
{
    private readonly ICourseRepository _courseRepo = courseRepo;
    private readonly IModuleRepository _moduleRepo = moduleRepo;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Guid> CreateAsync(
        CreateCourseDto dto,
        Guid instructorId)
    {
        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            ThumbnailUrl = dto.ThumpnailUrl,
            InstructorId = instructorId
        };

        await _courseRepo.AddAsync(course);

        await _uow.SaveChangesAsync();

        return course.Id;
    }

    public async Task<ViewCourseDto?> GetByIdAsync(Guid id)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course is null) return null;

        var moduleCount = await _moduleRepo.CountModulesAsync(course);
        var enrollmentCount = await _courseRepo.CountEnrollmentsAsync(course);

        return new ViewCourseDto(
            course.Id,
            course.Title,
            course.Description,
            course.ThumbnailUrl,
            course.IsPublished,
            course.InstructorId,
            course.Instructor.UserName,
            course.Instructor.FullName,
            moduleCount,
            enrollmentCount,
            course.CreatedAt,
            course.UpdatedAt
        );
    }

    public async Task<List<ViewCourseDto>> GetAllAsync()
    {
        var courses = await _courseRepo.GetAllAsync();

        var list = new List<ViewCourseDto>();
        foreach (var course in courses)
        {
            var moduleCount = await _moduleRepo.CountModulesAsync(course);
            var enrollmentCount = await _courseRepo.CountEnrollmentsAsync(course);

            list.Add(new ViewCourseDto(
                course.Id,
                course.Title,
                course.Description,
                course.ThumbnailUrl,
                course.IsPublished,
                course.InstructorId,
                course.Instructor.UserName,
                course.Instructor.FullName,
                moduleCount,
                enrollmentCount,
                course.CreatedAt,
                course.UpdatedAt
            ));
        }

        return list;
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateCourseDto dto)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course is null)
            return false;
        // throw new Exception("Course not found");

        course.Title = dto.Title;
        course.Description = dto.Description;

        _courseRepo.Update(course);

        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course is null)
            return false;
        // throw new Exception("Course not found");

        _courseRepo.Remove(course);

        await _uow.SaveChangesAsync();
        return true;
    }

    public async Task<bool> HardDeleteAsync(Guid id)
    {
        var course = await _courseRepo.GetDeletedByIdAsync(id);
        if (course is null)
            return false;
        // throw new Exception("Deleted course not found");

        _courseRepo.HardDelete(course);

        await _uow.SaveHardChangesAsync();
        return true;
    }

    public async Task<bool> RestoreAsync(Guid id)
    {
        var course = await _courseRepo.GetDeletedByIdAsync(id);
        if (course is null)
            return false;
        // throw new Exception("Deleted course not found");

        _courseRepo.Restore(course);

        await _uow.SaveChangesAsync();
        return true;
    }
}
