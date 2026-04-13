using Backend.Models.Courses;

namespace Backend.Data.Repositories;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(Guid id);

    Task<Course?> GetDeletedByIdAsync(Guid id);

    Task<int> CountEnrollmentsAsync(Course course);

    Task<List<Course>> GetAllAsync();

    Task AddAsync(Course course);

    void Update(Course course);

    void Remove(Course course);

    void Restore(Course course);

    void HardDelete(Course course);

    Task<bool> ExistsAsync(Guid id);
}
