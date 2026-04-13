using Backend.Features.Assignments.Dtos;

namespace Backend.Features.Assignments.Services;

public interface IAssignmentService
{
    Task<Guid> CreateAsync(Guid activityId, CreateAssignmentDto dto);

    Task SubmitAsync(Guid assignmentId, Guid studentId, SubmitAssignmentDto dto);
}
