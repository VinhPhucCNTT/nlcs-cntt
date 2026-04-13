using Backend.Features.Assessments.Dtos;

namespace Backend.Features.Assessments.Services;

public interface IAssessmentService
{
    Task<Guid> CreateAsync(Guid activityId, CreateAssessmentDto dto);

    Task SubmitAttemptAsync(Guid assessmentId, Guid studentId, SubmitAssessmentDto dto);
}
