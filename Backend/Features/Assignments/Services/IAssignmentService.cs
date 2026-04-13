using Backend.Features.Assignments.Dtos;

namespace Backend.Features.Assignments.Services;

public interface IAssignmentService
{
    Task<Guid> CreateAsync(Guid activityId, CreateAssignmentDto dto);

    Task<ViewAssignmentDto?> GetByIdAsync(Guid id);

    Task UpdateAsync(Guid id, UpdateAssignmentDto dto);

    Task DeleteAsync(Guid id);

    Task SubmitAsync(
        Guid assignmentId,
        Guid studentId,
        SubmitAssignmentDto dto);
}
