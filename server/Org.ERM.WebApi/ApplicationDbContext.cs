using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;
using System.Threading.Tasks;

namespace Org.ERM.WebApi
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Organization> Organization { get; set; }
        public DbSet<PerformanceReview> PerformanceReview { get; set; }
        public DbSet<PerformanceReviewACL> PerformanceReviewACL { get; set; }
        public DbSet<PerformanceReviewFeedback> PerformanceReviewFeedback { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
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

            modelBuilder.Entity<Employee>().HasData(
                new Employee(){ Id=1, Name = "Emp1 Org1", Email="emp1@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=2, Name = "Emp2 Org1", Email="emp2@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=3, Name = "Emp3 Org1", Email="emp3@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=4, Name = "Emp4 Org1", Email="emp4@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=5, Name = "Emp5 Org1", Email="emp5@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=6, Name = "Emp6 Org1", Email="emp6@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=7, Name = "Emp1 Org2", Email="emp1@org2.com", Password="stringer", OrganizationId=2, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=8, Name = "Admin1 Org1", Email="admin1@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Admin,},
                new Employee(){ Id=9, Name = "Admin1 Org2", Email="admin1@org2.com", Password="stringer", OrganizationId=2, Role=Enums.UserRole.Admin,},
                new Employee(){ Id=10, Name = "SuperAdmin 1", Email="superadmin1@org.com", Password="stringer", OrganizationId=99, Role=Enums.UserRole.SuperAdmin,}
            );

            modelBuilder.Entity<Organization>().HasData(
                new Organization(){ Id=1, Name = "Org #1", },
                new Organization(){ Id=2, Name = "Org #2", },
                new Organization(){ Id=99, Name = "Org #99", }
            );

            modelBuilder.Entity<PerformanceReview>().HasData(
                new PerformanceReview(){ Id=1, Name = "Emp1's Review Q1", EmployeeId = 1, OrganizationId = 1, },
                new PerformanceReview(){ Id=2, Name = "Emp1's Review Q2", EmployeeId = 1, OrganizationId = 1, },
                new PerformanceReview(){ Id=3, Name = "Emp4's Review Q1", EmployeeId = 4, OrganizationId = 1, },
                new PerformanceReview(){ Id=4, Name = "Emp5's Review Q1", EmployeeId = 5, OrganizationId = 1, },
                new PerformanceReview(){ Id=5, Name = "Emp7's Review Q3", EmployeeId = 7, OrganizationId = 2, }
            );

            modelBuilder.Entity<PerformanceReviewACL>().HasData(
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 2 },
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 4 },
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 8 },
                new PerformanceReviewACL(){ PerformanceReviewId = 2, EmployeeId = 3 },
                new PerformanceReviewACL(){ PerformanceReviewId = 3, EmployeeId = 3 }
            );

            modelBuilder.Entity<PerformanceReviewFeedback>().HasData(
                new PerformanceReviewFeedback(){ Id=1, OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=2,ForEmployeeId=1,Name="", },
                new PerformanceReviewFeedback(){ Id=2, OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=4,ForEmployeeId=1,Name="", },
                new PerformanceReviewFeedback(){ Id=3, OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=8,ForEmployeeId=1,Name="", },
                new PerformanceReviewFeedback(){ Id=4, OrganizationId=1, PerformanceReviewId=2,FromEmployeeId=3,ForEmployeeId=1,Name="", },
                new PerformanceReviewFeedback(){ Id=5, OrganizationId=1, PerformanceReviewId=3,FromEmployeeId=3,ForEmployeeId=4,Name="", }
            );
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
