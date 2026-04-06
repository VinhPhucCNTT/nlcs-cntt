using Backend.Models.Users;
using Backend.DTO.Auth;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;

namespace Backend.Endpoints;

public static class AuthEndpoints
{
    public static void AddAuthEndpoints(this IEndpointRouteBuilder app, UserManager<ApplicationUser> userManager) {
        var auth = app.MapGroup("/auth");

        auth.MapPost("login", async (LoginRequest request) => {
        });
    }
}
