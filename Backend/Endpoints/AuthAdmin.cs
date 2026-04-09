using Backend.Models.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Endpoints;

public static class AuthAdminEndpoints
{
    public record AdminUserResponse(
        Guid Id,
        string? Email,
        string? UserName,
        string FullName,
        DateTime CreatedAt
    );

    public static void AddAuthAdminEndpoints(this IEndpointRouteBuilder app)
    {
        var auth = app.MapGroup("api/auth");

        auth.MapDelete("{email}", HandleDeleteUser);
        auth.MapGet("", HandleGetUsers);
        auth.MapGet("check", HandleCheck).RequireAuthorization();
    }

    private static async
        Task<Results<Ok, BadRequest>>
        HandleDeleteUser(
            string email,
            UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return TypedResults.BadRequest();

        await userManager.DeleteAsync(user);
        return TypedResults.Ok();
    }

    private static async
        Task<List<AdminUserResponse>>
        HandleGetUsers(UserManager<ApplicationUser> userManager)
    {
        var list = userManager.Users.Select(u => new AdminUserResponse(u.Id, u.Email, u.UserName, u.FullName, u.CreatedAt));
        return await list.ToListAsync();
    }

    private static Ok HandleCheck() => TypedResults.Ok();
}
