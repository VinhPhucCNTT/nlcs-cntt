using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Backend.Models.Users;
using Backend.Models.Courses;
using Backend.Models.Learning;
using Backend.Models.Assessments;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Lesson> Lessons => Set<Lesson>();

    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<LessonProgress> LessonProgress => Set<LessonProgress>();

    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<QuizAttempt> QuizAttempts => Set<QuizAttempt>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Soft delete
        builder.Entity<Course>().HasQueryFilter(c => !c.IsDeleted);
        builder.Entity<Section>().HasQueryFilter(s => !s.IsDeleted);
        builder.Entity<Lesson>().HasQueryFilter(l => !l.IsDeleted);
        builder.Entity<Quiz>().HasQueryFilter(q => !q.IsDeleted);
        builder.Entity<Question>().HasQueryFilter(q => !q.IsDeleted);
        builder.Entity<Answer>().HasQueryFilter(a => !a.IsDeleted);
        builder.Entity<QuizAttempt>().HasQueryFilter(qa => !qa.IsDeleted);

        builder.Entity<Enrollment>()
            .HasQueryFilter(e => !e.IsDeleted)
            .HasIndex(e => new { e.UserId, e.CourseId })
            .IsUnique();

        builder.Entity<LessonProgress>()
            .HasQueryFilter(p => !p.IsDeleted)
            .HasIndex(p => new { p.UserId, p.LessonId })
            .IsUnique();
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
