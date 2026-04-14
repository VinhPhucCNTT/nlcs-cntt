using System.Security.Claims;
using Backend.Features.Assignments.Dtos;
using Backend.Features.Assignments.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class AssignmentEndpoints
{
    public static void AddAssignmentEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/activities/{activityId:guid}/assignments", Create);

        app.MapGet("/api/assignments/{id:guid}", Get);

        app.MapPost("/api/assignments/{id:guid}/submit", Submit);
    }

    private static async Task<Ok<Guid>> Create(
        Guid activityId,
        CreateAssignmentDto dto,
        IAssignmentService service)
    {
        return TypedResults.Ok(
            await service.CreateAsync(activityId, dto));
    }

    private static async Task<Ok<ViewAssignmentDto?>> Get(
        Guid id,
        IAssignmentService service)
    {
        return TypedResults.Ok(
            await service.GetByIdAsync(id));
    }

    private static async Task<NoContent> Submit(
        Guid id,
        SubmitAssignmentDto dto,
        ClaimsPrincipal user,
        IAssignmentService service)
    {
        var studentId = Guid.Parse(
            user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        await service.SubmitAsync(id, studentId, dto);

        return TypedResults.NoContent();
    }
}
