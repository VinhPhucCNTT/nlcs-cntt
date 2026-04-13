using Backend.Data.Repositories;
using Backend.Data.UnitOfWork;
using Backend.Features.Assignments.Dtos;
using Backend.Models.Assignments;

namespace Backend.Features.Assignments.Services;

public class AssignmentService(
    IAssignmentRepository repo,
    IAssignmentSubmissionRepository submissionRepo,
    IUnitOfWork uow) : IAssignmentService
{
    private readonly IAssignmentRepository _repo = repo;
    private readonly IAssignmentSubmissionRepository _submissionRepo = submissionRepo;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Guid> CreateAsync(
        Guid activityId,
        CreateAssignmentDto dto)
    {
        var assignment = new Assignment
        {
            ActivityId = activityId,
            Instructions = dto.Instructions,
            DueDate = dto.DueDate,
            AllowLateSubmission = dto.AllowLateSubmission,
            MaxPoints = dto.MaxPoints
        };

        await _repo.AddAsync(assignment);

        await _uow.SaveChangesAsync();

        return assignment.Id;
    }

    public async Task SubmitAsync(
        Guid assignmentId,
        Guid studentId,
        SubmitAssignmentDto dto)
    {
        var submission = new AssignmentSubmission
        {
            AssignmentId = assignmentId,
            StudentId = studentId,
            SubmissionText = dto.SubmissionText,
            SubmittedAt = DateTime.UtcNow
        };

        await _submissionRepo.AddAsync(submission);

        await _uow.SaveChangesAsync();
    }
}
