using System.Security.Claims;
using Backend.Features.Courses.Dtos;
using Backend.Features.Enrollments.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class EnrollmentEndpoints
{
    public static void AddEnrollmentEndpoints(
        this IEndpointRouteBuilder app)
    {
        var enrollments = app.MapGroup("/api/enrollments");

        enrollments.MapGet("/my-courses", GetMyCourses);

        app.MapPost("/api/courses/{courseId:guid}/enroll", Enroll);
    }

    private static async Task<NoContent> Enroll(
        Guid courseId,
        ClaimsPrincipal user,
        IEnrollmentService service)
    {
        var studentId = Guid.Parse(
            user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        await service.EnrollStudentAsync(courseId, studentId);

        return TypedResults.NoContent();
    }

    private static async Task<Ok<List<ViewCourseDto>>> GetMyCourses(
        ClaimsPrincipal user,
        IEnrollmentService service)
    {
        var studentId = Guid.Parse(
            user.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var result = await service.GetStudentCoursesAsync(studentId);

        return TypedResults.Ok(result);
    }
}
