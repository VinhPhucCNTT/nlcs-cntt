using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    // Add your DbSet properties here
    // public DbSet<MyEntity> MyEntities { get; set; }
}
