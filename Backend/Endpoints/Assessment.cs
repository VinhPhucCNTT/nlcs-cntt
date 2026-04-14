using System.Security.Claims;
using Backend.Features.Assessments.Dtos.Modify;
using Backend.Features.Assessments.Dtos.Submission;
using Backend.Features.Assessments.Dtos.View;
using Backend.Features.Assessments.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class AssessmentEndpoints
{
    public static void AddAssessmentEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/activities/{activityId:guid}/assessments", Create)
            .RequireAuthorization(p => p.RequireRole("Instructor"));

        app.MapGet("/api/assessments/{id:guid}", Get);

        app.MapPost("/api/assessments/{id:guid}/submit", Submit)
            .RequireAuthorization(p => p.RequireRole("Instructor"));
    }

    private static async Task<Ok<Guid>> Create(
        Guid activityId,
        CreateAssessmentDto dto,
        IAssessmentService service)
    {
        return TypedResults.Ok(
            await service.CreateAsync(activityId, dto));
    }

    private static async Task<Results<Ok<ViewAssessmentDto>, NotFound>> Get(
        Guid id,
        IAssessmentService service)
    {
        var assessment = await service.GetByIdAsync(id);
        if (assessment is null)
            return TypedResults.NotFound();

        return TypedResults.Ok(assessment);
    }

    private static async Task<Ok<AssessmentResultDto>> Submit(
        Guid id,
        SubmitAssessmentDto dto,
        ClaimsPrincipal user,
        IAssessmentService service)
    {
        var studentId = Guid.Parse(
            user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var result = await service.SubmitAttemptAsync(
            id,
            studentId,
            dto);

        return TypedResults.Ok(result);
    }
}
