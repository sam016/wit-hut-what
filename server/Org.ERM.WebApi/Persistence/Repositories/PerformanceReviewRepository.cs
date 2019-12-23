using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;

namespace Org.ERM.WebApi.Persistence.Repositories
{
    public interface IPerformanceReviewRepository : IBaseRepository<PerformanceReview>
    {
        Task<IEnumerable<PerformanceReview>> GetAllAsync(int orgId);
        Task<IEnumerable<PerformanceReview>> GetAllAsync(int orgId, int empId);
        Task<IEnumerable<PerformanceReview>> GetAllPermittedAsync(int orgId, int empId);
        Task<bool> IsUserPermittedAsync(int orgId, int empId, int performanceReviewId, int userId);
        Task<bool> PermitAsync(int performanceReviewId, int userId);
        Task<bool> PermitAsync(PerformanceReview performanceReview, int userId);
        Task<bool> ProhibitAsync(int performanceReviewId, int userId);
        Task<bool> ProhibitAsync(PerformanceReview performanceReview, int userId);
    }

    public class PerformanceReviewRepository : BaseRepository<PerformanceReview>, IPerformanceReviewRepository
    {
        private readonly IEmployeeRepository EmployeeRepository;

        public PerformanceReviewRepository(DatabaseContext context, IEmployeeRepository employeeRepository)
        : base(context, context.PerformanceReview)
        {
            EmployeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<PerformanceReview>> GetAllAsync(int orgId)
        {
            return await this.GetAllAsync(pr => pr.OrganizationId == orgId);
        }

        public async Task<IEnumerable<PerformanceReview>> GetAllAsync(int orgId, int empId)
        {
            return await this.GetAllAsync(pr => pr.OrganizationId == orgId && pr.EmployeeId == empId);
        }

        public async Task<IEnumerable<PerformanceReview>> GetAllPermittedAsync(int orgId, int empId)
        {
            var employee = await DBContext.Employee.FindAsync(orgId);
            return employee.PermittedPerformanceReviews.Select(pr => pr.PerformanceReview);
        }

        public async Task<bool> IsUserPermittedAsync(int orgId, int empId, int performanceReviewId, int userId)
        {
            var query = $@"SELECT PRACL.*
                        FROM PerformanceReviewACL PRACL
                        INNER JOIN PerformanceReview PR
                            ON PR.Id = PRACL.PerformanceReviewId
                            AND PR.Id = {performanceReviewId}
                        INNER JOIN Employee EMP
                            ON EMP.Id = PRACL.EmployeeId
                            AND EMP.Id = {empId}";
            var count = (await DBContext.PerformanceReviewACL.FromSqlRaw(query).ToListAsync()).Count();
            return count > 0;
        }

        public async Task<bool> PermitAsync(int performanceReviewId, int userId)
        {
            return await PermitAsync(await GetByIdAsync(performanceReviewId), userId);
        }

        public async Task<bool> PermitAsync(PerformanceReview performanceReview, int userId)
        {
            var acl = await GetPerformanceReviewACLAsync(performanceReview.Id, userId);

            if (acl != null)
            {
                return false;
            }

            // await EmployeeRepository.GetByIdAsync(userId)

            acl = new PerformanceReviewACL()
            {
                EmployeeId = userId,
                PerformanceReviewId = performanceReview.Id,
            };

            DBContext.PerformanceReviewACL.Add(acl);
            await DBContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ProhibitAsync(int performanceReviewId, int userId)
        {
            return await ProhibitAsync(await GetByIdAsync(performanceReviewId), userId);
        }

        public async Task<bool> ProhibitAsync(PerformanceReview performanceReview, int userId)
        {
            var acl = await GetPerformanceReviewACLAsync(performanceReview.Id, userId);

            if (acl == null)
            {
                return false;
            }

            // await EmployeeRepository.GetByIdAsync(userId)

            DBContext.PerformanceReviewACL.Remove(acl);
            await DBContext.SaveChangesAsync();

            return true;
        }

        private async Task<PerformanceReviewACL> GetPerformanceReviewACLAsync(int performanceReviewId, int userId)
        {
            return await DBContext.PerformanceReviewACL.FindAsync(new { PerformanceReviewId = performanceReviewId, EmployeeId = userId });
        }
    }
}
