using System.Security.Claims;
using Backend.Features.Courses;
using Backend.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

// NOTE: This endpoint comes from a previous implementation
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
        Task<Results<Ok<QueryCoursesResponse>, ValidationProblem>>
        HandleQuery(
            QueryCoursesRequest request,
            ICourseService courseService,
            IValidator<QueryCoursesRequest> validator,
            CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var results = await courseService.QueryCoursesAsync(request, cancellationToken);
        return TypedResults.Ok(results);
    }

    private static async
        Task<Results<Ok<CourseDto>, BadRequest, ValidationProblem>>
        HandleCreate(
            CreateCourseDto request,
            ClaimsPrincipal user,
            ICourseService courseService,
            IValidator<CreateCourseDto> validator,
            CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        if (!user.GetUserId(out var userId))
            return TypedResults.BadRequest();

        var result = await courseService.CreateCourseAsync(request, userId, cancellationToken);
        return TypedResults.Ok(result);
    }

    private static async
        Task<Results<Ok<CourseDto>, BadRequest, ValidationProblem>>
        HandleUpdate(
            Guid courseId,
            UpdateCourseDto request,
            ICourseService courseService,
            IValidator<UpdateCourseDto> validator,
            CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return TypedResults.ValidationProblem(validationResult.ToDictionary());

        var result = await courseService.UpdateCourseAsync(courseId, request, cancellationToken);
        if (result is null)
            return TypedResults.BadRequest();
        return TypedResults.Ok(result);
    }

    private static async
        Task<Results<Ok, BadRequest, ValidationProblem>>
        HandleDelete(
            Guid courseId,
			ICourseService courseService,
			CancellationToken cancellationToken)
    {
        if (!await courseService.DeleteCourseAsync(courseId, cancellationToken))
            return TypedResults.BadRequest();
        return TypedResults.Ok();
    }
}
