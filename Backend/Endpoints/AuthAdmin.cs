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

        auth.MapDelete("{email}", async Task<Results<Ok, BadRequest>> (string email, UserManager<ApplicationUser> userManager) =>
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is null)
                return TypedResults.BadRequest();

            await userManager.DeleteAsync(user);
            return TypedResults.Ok();
        });

        auth.MapGet("", async Task<List<AdminUserResponse>> (UserManager<ApplicationUser> userManager) =>
        {
            var list = userManager.Users.Select(u => new AdminUserResponse(u.Id, u.Email, u.UserName, u.FullName, u.CreatedAt));
            return await list.ToListAsync();
        });

        auth.MapGet("check", async Task<Ok> () => TypedResults.Ok()).RequireAuthorization();
    }
}
