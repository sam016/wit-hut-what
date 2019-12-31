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
    public interface IPerformanceReviewFeedbackRepository : IBaseRepository<PerformanceReviewFeedback>
    {
        Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId);
        Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId, int empId);
        Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId, int empId, int performanceReviewId);
    }

    public class PerformanceReviewFeedbackRepository : BaseRepository<PerformanceReviewFeedback>, IPerformanceReviewFeedbackRepository
    {
        public PerformanceReviewFeedbackRepository(ApplicationDbContext context) : base(context, context.PerformanceReviewFeedback)
        { }

        public async Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId)
        {
            return await this.GetAllAsync(pr => pr.OrganizationId == orgId);
        }

        public async Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId, int empId)
        {
            return await this.GetAllAsync(pr => pr.OrganizationId == orgId && pr.ForEmployeeId == empId);
        }

        public async Task<IEnumerable<PerformanceReviewFeedback>> GetAllAsync(int orgId, int empId, int performanceReviewId)
        {
            return await this.GetAllAsync(pr => pr.OrganizationId == orgId
                                            && pr.ForEmployeeId == empId
                                            && pr.PerformanceReviewId == performanceReviewId);
        }

    }
}
