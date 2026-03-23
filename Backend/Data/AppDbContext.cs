using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("USERS");

            entity.Property(e => e.UserId)
                  .HasColumnName("USER_ID");
            entity.Property(e => e.Name)
                  .HasColumnName("NAME");
            entity.Property(e => e.PasswordHash)
                  .HasColumnName("PW_HASH");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.ToTable("COURSES");

            entity.ComplexProperty(c => c.Metadata, d => d.ToJson());
        });
    }

    public DbSet<User> Users { get; set; }
}
