using Backend.Features.Lessons.Dtos;
using Backend.Features.Lessons.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class LessonEndpoints
{
    public static void AddLessonEndpoints(
        this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/activities/{activityId:guid}/lessons", Create);

        app.MapGet("/api/lessons/{id:guid}", Get);

        app.MapPut("/api/lessons/{id:guid}", Update);

        app.MapDelete("/api/lessons/{id:guid}", Delete);
    }

    private static async Task<Ok<Guid>> Create(
        Guid activityId,
        CreateLessonDto dto,
        ILessonService service)
    {
        return TypedResults.Ok(
            await service.CreateAsync(activityId, dto));
    }

    private static async Task<Ok<ViewLessonDto?>> Get(
        Guid id,
        ILessonService service)
    {
        return TypedResults.Ok(
            await service.GetByIdAsync(id));
    }

    private static async Task<NoContent> Update(
        Guid id,
        UpdateLessonDto dto,
        ILessonService service)
    {
        await service.UpdateAsync(id, dto);

        return TypedResults.NoContent();
    }

    private static async Task<NoContent> Delete(
        Guid id,
        ILessonService service)
    {
        await service.DeleteAsync(id);

        return TypedResults.NoContent();
    }
}
