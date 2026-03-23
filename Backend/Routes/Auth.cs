namespace Backend.Routes;

public static class AuthEndpoints
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth/")
            .WithTags("Authentication");

        return app;
    }
}
