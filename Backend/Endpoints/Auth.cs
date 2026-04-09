using Backend.Models.Users;
using Backend.Services;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Endpoints;

public static class AuthEndpoints
{
    public record UserLoginRequest(string Email, string Password);
    public record UserLoginResponse(string Email, string Token);

    public record UserRegisterRequest(string FullName, string Email, string Username, string Password); // Admin role is registered manually
    public record UserRegisterResponse(string Email);

    public static void AddAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var auth = app.MapGroup("/api/auth");

        auth.MapPost("login", HandleLogin);
        auth.MapPost("register", HandleRegister);
    }

    private static async
        Task<Results<Ok<UserLoginResponse>, UnauthorizedHttpResult>>
        HandleLogin(
            UserLoginRequest request,
            UserManager<ApplicationUser> userManager,
            JwtService jwtService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return TypedResults.Unauthorized();

        if (!await userManager.CheckPasswordAsync(user, request.Password))
            return TypedResults.Unauthorized();

        var token = await jwtService.GenerateToken(user);
        return TypedResults.Ok<UserLoginResponse>(new(request.Email, token));
    }

    private static async 
        Task<Results<Ok<UserRegisterResponse>, UnauthorizedHttpResult, BadRequest<List<IdentityError>>>>
        HandleRegister(
            UserRegisterRequest request,
            UserManager<ApplicationUser> userManager)
    {
        var exist = await userManager.FindByEmailAsync(request.Email);
        if (exist is not null)
            return TypedResults.Unauthorized();

        var user = new ApplicationUser
        {
            FullName = request.FullName,
            UserName = request.Username,
            Email = request.Email
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return TypedResults.BadRequest(result.Errors.ToList());
        }

        await userManager.AddToRoleAsync(user, "User");

        return TypedResults.Ok<UserRegisterResponse>(new(request.Email));
    }
}
