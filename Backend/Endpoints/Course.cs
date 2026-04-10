using System.Security.Claims;
using Backend.Features.Courses;
using Backend.Helpers;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class CourseEndpoints
{
    public static void AddCourseEndpoints(this IEndpointRouteBuilder app)
    {
        var course = app.MapGroup("/api/course");

        course.MapGet("{courseId:Guid}", HandleGet);
        course.MapGet("", HandleQuery);
        course.MapPut("", HandleCreate);
        course.MapPost("{courseId:Guid}", HandleUpdate);
        course.MapDelete("{courseId:Guid}", HandleDelete);
    }

    private static async
        Task<Results<Ok<CourseDto>, BadRequest>>
        HandleGet(Guid courseId, ICourseService courseService, CancellationToken cancellationToken)
    {
        var result = await courseService.GetCourseAsync(courseId, cancellationToken);
        if (result is null)
            return TypedResults.BadRequest();
        return TypedResults.Ok(result);
    }

    private static async
        Task<Ok<QueryCoursesResponse>>
        HandleQuery(QueryCoursesRequest request, ICourseService courseService, CancellationToken cancellationToken)
    {
        var results = await courseService.QueryCoursesAsync(request, cancellationToken);
        return TypedResults.Ok(results);
    }

    private static async
        Task<Results<Ok<CourseDto>, BadRequest>>
        HandleCreate(CreateCourseDto request, ClaimsPrincipal user, ICourseService courseService, CancellationToken cancellationToken)
    {
    if (!user.GetUserId(out var userId))
        return TypedResults.BadRequest();

    var result = await courseService.CreateCourseAsync(request, userId, cancellationToken);
    return TypedResults.Ok(result);
    }

    private static async
        Task<Results<Ok<CourseDto>, BadRequest>>
        HandleUpdate(Guid courseId, UpdateCourseDto request, ICourseService courseService, CancellationToken cancellationToken)
    {
        var result = await courseService.UpdateCourseAsync(courseId, request, cancellationToken);
        if (result is null)
            return TypedResults.BadRequest();
        return TypedResults.Ok(result);
    }

    private static async
        Task<Results<Ok, BadRequest>>
        HandleDelete(Guid courseId, ICourseService courseService, CancellationToken cancellationToken)
    {
        if (!await courseService.DeleteCourseAsync(courseId, cancellationToken))
            return TypedResults.BadRequest();
        return TypedResults.Ok();
    }
}
