using Backend.Models.Courses;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _db;

    public CourseRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Course?> GetByIdAsync(Guid id)
    {
        return await _db.Courses
            .Include(x => x.Modules)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Course>> GetAllAsync()
    {
        return await _db.Courses.ToListAsync();
    }

    public async Task AddAsync(Course course)
    {
        await _db.Courses.AddAsync(course);
    }

    public void Update(Course course)
    {
        _db.Courses.Update(course);
    }

    public void Remove(Course course)
    {
        _db.Courses.Remove(course);
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _db.Courses.AnyAsync(x => x.Id == id);
    }
}
