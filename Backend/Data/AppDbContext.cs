using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Backend.Models.Users;
using Backend.Models.Courses;
using Backend.Models.Assessments;
using Backend.Models.Assignments;
using Backend.Models;
using Backend.Models.Common;

namespace Backend.Data;

        // Soft delete
        // builder.Entity<Course>().HasQueryFilter(c => !c.IsDeleted);
        // builder.Entity<Section>().HasQueryFilter(s => !s.IsDeleted);
        // builder.Entity<Lesson>().HasQueryFilter(l => !l.IsDeleted);
        // builder.Entity<Quiz>().HasQueryFilter(q => !q.IsDeleted);
        // builder.Entity<Question>().HasQueryFilter(q => !q.IsDeleted);
        // builder.Entity<Answer>().HasQueryFilter(a => !a.IsDeleted);
        // builder.Entity<QuizAttempt>().HasQueryFilter(qa => !qa.IsDeleted);

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseModule> CourseModules => Set<CourseModule>();
    public DbSet<CourseActivity> CourseActivities => Set<CourseActivity>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedAt = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
