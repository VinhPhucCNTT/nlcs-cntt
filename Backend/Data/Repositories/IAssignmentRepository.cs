using Backend.Models.Assignments;

namespace Backend.Data.Repositories;

public interface IAssignmentRepository
{
    Task<Assignment?> GetByIdAsync(Guid id);

    Task AddAsync(Assignment assignment);

    void Update(Assignment assignment);

    void Remove(Assignment assignment);
}
