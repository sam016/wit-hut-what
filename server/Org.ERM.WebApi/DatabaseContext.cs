using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;
using System.Threading.Tasks;

namespace Org.ERM.WebApi
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Organization> Organization { get; set; }
        public DbSet<PerformanceReview> PerformanceReview { get; set; }
        public DbSet<PerformanceReviewACL> PerformanceReviewACL { get; set; }
        public DbSet<PerformanceReviewFeedback> PerformanceReviewFeedback { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        { }

        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     optionsBuilder.UseMySQL("server=db;database=erm_local;user=root;password=root-password");
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();

                entity.HasOne(e => e.Organization)
                    .WithMany(b => b.Employees)
                    .HasForeignKey(p => p.OrganizationId)
                    .HasConstraintName("ForeignKey_Employee_Organization");
            });

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<PerformanceReview>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();

                entity.HasOne(e => e.Employee)
                    .WithMany(b => b.PerformanceReviews)
                    .HasForeignKey(p => p.EmployeeId)
                    .HasConstraintName("ForeignKey_PerformanceReview_Employee");
            });

            modelBuilder.Entity<PerformanceReviewFeedback>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();

                entity.HasOne(e => e.PerformanceReview)
                    .WithMany(b => b.PerformanceReviewFeedbacks)
                    .HasForeignKey(p => p.PerformanceReviewId)
                    .HasConstraintName("ForeignKey_PerformanceReviewFeedback_PerformanceReview");
            });


            modelBuilder.Entity<PerformanceReviewACL>()
                .HasKey(pr => new { pr.PerformanceReviewId, pr.EmployeeId });
            modelBuilder.Entity<PerformanceReviewACL>()
                .HasOne(pr => pr.PerformanceReview)
                .WithMany(b => b.PermittedEmployees)
                .HasForeignKey(pr => pr.PerformanceReviewId);
            modelBuilder.Entity<PerformanceReviewACL>()
                .HasOne(pr => pr.Employee)
                .WithMany(c => c.PermittedPerformanceReviews)
                .HasForeignKey(pr => pr.EmployeeId);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken = default(System.Threading.CancellationToken))
        {
            UpdateTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntityModel && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((BaseEntityModel)entityEntry.Entity).UpdatedAt = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntityModel)entityEntry.Entity).CreatedAt = DateTime.Now;
                }
            }
        }
    }
}
