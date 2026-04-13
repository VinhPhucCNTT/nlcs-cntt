using Backend.Models.Assessments;

namespace Backend.Data.Repositories;

public interface IAssessmentRepository
{
    Task<Assessment?> GetByIdAsync(Guid id);

    Task AddAsync(Assessment assessment);

    void Update(Assessment assessment);

    void Remove(Assessment assessment);
}
