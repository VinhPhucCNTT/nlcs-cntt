using Backend.Features.Assessments.Dtos;
using Backend.Models.Assessments;

namespace Backend.Features.Assessments.Services;

public interface IAssessmentService
{
    Task<Guid> CreateAsync(Guid activityId, CreateAssessmentDto dto);

    Task<ViewAssessmentDto?> GetByIdAsync(Guid id);

    Task<List<ViewQuestionDto>> GetAssessmentQuestionsAsync(Assessment assessment);

    Task UpdateAsync(Guid id, UpdateAssessmentDto dto);

    Task DeleteAsync(Guid id);

    Task<AssessmentResultDto> SubmitAttemptAsync(
        Guid assessmentId,
        Guid studentId,
        SubmitAssessmentDto dto);
}
