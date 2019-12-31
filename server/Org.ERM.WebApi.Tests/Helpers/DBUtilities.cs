using Org.ERM.WebApi.Models.Domain;
using System.Collections.Generic;

namespace Org.ERM.WebApi.Tests.Helpers
{
    public static class DBUtilities
    {
        public static void InitializeDbForTests(ApplicationDbContext db)
        {
            db.Organization.AddRange(GetSeedingOrganizations());
            db.SaveChanges();

            db.Employee.AddRange(GetSeedingEmployees());
            db.SaveChanges();

            db.PerformanceReview.AddRange(GetSeedingPerformanceReviews());
            db.SaveChanges();

            db.PerformanceReviewFeedback.AddRange(GetSeedingPerformanceReviewFeedbacks());
            db.SaveChanges();

            db.PerformanceReviewACL.AddRange(GetSeedingPerformanceReviewACLs());
            db.SaveChanges();
        }

        public static void ReinitializeDbForTests(ApplicationDbContext db)
        {
            db.Employee.RemoveRange(db.Employee);
            db.Organization.RemoveRange(db.Organization);
            db.PerformanceReview.RemoveRange(db.PerformanceReview);
            db.PerformanceReviewFeedback.RemoveRange(db.PerformanceReviewFeedback);
            db.PerformanceReviewACL.RemoveRange(db.PerformanceReviewACL);

            InitializeDbForTests(db);
        }

        public static List<Employee> GetSeedingEmployees()
        {
            return new List<Employee>()
            {
                new Employee(){ Id=1, Name = "Emp1 Org1", Email="emp1@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=2, Name = "Emp2 Org1", Email="emp2@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=3, Name = "Emp3 Org1", Email="emp3@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=4, Name = "Emp4 Org1", Email="emp4@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=5, Name = "Emp5 Org1", Email="emp5@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=6, Name = "Emp6 Org1", Email="emp6@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=7, Name = "Emp1 Org2", Email="emp1@org2.com", Password="stringer", OrganizationId=2, Role=Enums.UserRole.Employee,},
                new Employee(){ Id=8, Name = "Admin1 Org1", Email="admin1@org1.com", Password="stringer", OrganizationId=1, Role=Enums.UserRole.Admin,},
                new Employee(){ Id=9, Name = "Admin1 Org2", Email="admin1@org2.com", Password="stringer", OrganizationId=2, Role=Enums.UserRole.Admin,},
                new Employee(){ Id=10, Name = "SuperAdmin 1", Email="superadmin1@org.com", Password="stringer", OrganizationId=99, Role=Enums.UserRole.SuperAdmin,},
            };
        }

        public static List<Organization> GetSeedingOrganizations()
        {
            return new List<Organization>()
            {
                new Organization(){ Id=1, Name = "Org #1", },
                new Organization(){ Id=2, Name = "Org #2", },
                new Organization(){ Id=99, Name = "Org #99", },
            };
        }

        public static List<PerformanceReview> GetSeedingPerformanceReviews()
        {
            return new List<PerformanceReview>()
            {
                new PerformanceReview(){ Id=1, Name = "Emp1's Review Q1", EmployeeId = 1, OrganizationId = 1, },
                new PerformanceReview(){ Id=2, Name = "Emp1's Review Q2", EmployeeId = 1, OrganizationId = 1, },
                new PerformanceReview(){ Id=3, Name = "Emp4's Review Q1", EmployeeId = 4, OrganizationId = 1, },
                new PerformanceReview(){ Id=4, Name = "Emp5's Review Q1", EmployeeId = 5, OrganizationId = 1, },
                new PerformanceReview(){ Id=5, Name = "Emp7's Review Q3", EmployeeId = 7, OrganizationId = 2, },
            };
        }

        public static List<PerformanceReviewACL> GetSeedingPerformanceReviewACLs()
        {
            return new List<PerformanceReviewACL>()
            {
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 2 },
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 4 },
                new PerformanceReviewACL(){ PerformanceReviewId = 1, EmployeeId = 8 },
                new PerformanceReviewACL(){ PerformanceReviewId = 2, EmployeeId = 3 },
                new PerformanceReviewACL(){ PerformanceReviewId = 3, EmployeeId = 3 },
            };
        }

        public static List<PerformanceReviewFeedback> GetSeedingPerformanceReviewFeedbacks()
        {
            return new List<PerformanceReviewFeedback>()
            {
                new PerformanceReviewFeedback(){ OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=2,ForEmployeeId=1, },
                new PerformanceReviewFeedback(){ OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=4,ForEmployeeId=1, },
                new PerformanceReviewFeedback(){ OrganizationId=1, PerformanceReviewId=1,FromEmployeeId=8,ForEmployeeId=1, },
                new PerformanceReviewFeedback(){ OrganizationId=1, PerformanceReviewId=2,FromEmployeeId=3,ForEmployeeId=1, },
                new PerformanceReviewFeedback(){ OrganizationId=1, PerformanceReviewId=3,FromEmployeeId=3,ForEmployeeId=4, },
            };
        }
    }
}
