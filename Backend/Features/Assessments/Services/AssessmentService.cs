using Backend.Data.Repositories;
using Backend.Data.UnitOfWork;
using Backend.Features.Assessments.Dtos;
using Backend.Models.Assessments;

namespace Backend.Features.Assessments.Services;

public class AssessmentService(
    IAssessmentRepository assessmentRepo,
    IAssessmentAttemptRepository attemptRepo,
    IUnitOfWork uow) : IAssessmentService
{
    private readonly IAssessmentRepository _assessmentRepo = assessmentRepo;
    private readonly IAssessmentAttemptRepository _attemptRepo = attemptRepo;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Guid> CreateAsync(
        Guid activityId,
        CreateAssessmentDto dto)
    {
        var assessment = new Assessment
        {
            ActivityId = activityId,
            Type = dto.Type,
            TimeLimitMinutes = dto.TimeLimitMinutes,
            MaxAttempts = dto.MaxAttempts,
            PassingScore = dto.PassingScore
        };

        await _assessmentRepo.AddAsync(assessment);

        await _uow.SaveChangesAsync();

        return assessment.Id;
    }

    public async Task SubmitAttemptAsync(
        Guid assessmentId,
        Guid studentId,
        SubmitAssessmentDto dto)
    {
        var attempt = new AssessmentAttempt
        {
            AssessmentId = assessmentId,
            StudentId = studentId,
            Score = dto.Score,
            SubmittedAt = DateTime.UtcNow
        };

        await _attemptRepo.AddAsync(attempt);

        await _uow.SaveChangesAsync();
    }
}
