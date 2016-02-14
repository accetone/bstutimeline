using Microsoft.Data.Entity;
using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class DataContext : DbContext, IDataContext
    {
        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<News>()
                .ToTable("NS_News")
                .HasOne(x => x.ShowplaceCategory)
                .WithMany();

            modelBuilder
                .Entity<ShowplaceCategory>()
                .ToTable("NS_ShowplaceCategory")
                .HasOne(x => x.Showplace)
                .WithMany();

            modelBuilder
                .Entity<Showplace>()
                .ToTable("NS_Showplace");
        }
    }
}
