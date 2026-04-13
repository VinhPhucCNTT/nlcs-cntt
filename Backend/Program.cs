using System.Text;

using Backend.Data;
using Backend.Models.Users;
using Backend.Features;
using Backend.Helpers;
using Backend.Endpoints;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using FluentValidation;

using Backend.Features.Courses.Services;
using Backend.Features.Modules.Services;
using Backend.Features.Activities.Services;
using Backend.Features.Assessments.Services;
using Backend.Features.Assignments.Services;

var builder = WebApplication.CreateBuilder(args);

// Automatically register validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "allowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddOpenApi();

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// builder.Services.AddDbContextFactory<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")),
//     ServiceLifetime.Scoped
// );

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.User.AllowedUserNameCharacters =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
        options.User.RequireUniqueEmail = true;
    })
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<AppDbContext>();

// Add services
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IModuleService, ModuleService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IAssessmentService, AssessmentService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();

var app = builder.Build();

app.UseCors("allowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    await app.SeedRolesAsync();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

// Map endpoints
app.AddAuthEndpoints();
if (app.Environment.IsDevelopment())
{
    app.AddAuthAdminEndpoints();
}

app.Run();
