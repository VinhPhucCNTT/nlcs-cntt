using Backend.Models.Courses;

namespace Backend.Data.Repositories;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(Guid id);

    Task<List<Course>> GetAllAsync();

    Task AddAsync(Course course);

    void Update(Course course);

    void Remove(Course course);

    Task<bool> ExistsAsync(Guid id);
}
