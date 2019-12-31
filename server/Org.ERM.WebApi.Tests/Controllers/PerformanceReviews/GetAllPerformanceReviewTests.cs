using FluentAssertions;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.PerformanceReview;
using Org.ERM.WebApi.Tests.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Org.ERM.WebApi.Tests.Controllers.PerformanceReviews
{
    public class GetAllPerformanceReviewTests : BaseTest, IClassFixture<MyWebApplicationFactory>
    {
        public GetAllPerformanceReviewTests(MyWebApplicationFactory factory) : base(factory)
        { }

        private async Task<IEnumerable<PerformanceReviewDto>> GetAllPerformanceReviewsAsync(string email, string password, int orgId, int empId, int statusCode = 200)
        {
            var token = await GetTokenAsync(email, password);

            var result = await GetAsync<IEnumerable<PerformanceReviewDto>>(
                token,
                $"organizations/{orgId}/employees/{empId}/performance-reviews",
                statusCode);

            return result;
        }

        /// <summary>
        /// Tests: SuperAdmin can create performance review for any employee in any organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="performanceReviewIds"></param>
        [Theory]
        [InlineData("superadmin1@org.com", "stringer", 1, 1, new int[] { 1, 2 })]
        [InlineData("superadmin1@org.com", "stringer", 1, 2, new int[] { })]
        [InlineData("superadmin1@org.com", "stringer", 1, 3, new int[] { })]
        [InlineData("superadmin1@org.com", "stringer", 1, 4, new int[] { 3 })]
        [InlineData("superadmin1@org.com", "stringer", 1, 5, new int[] { 4 })]
        [InlineData("superadmin1@org.com", "stringer", 1, 6, new int[] { })]
        [InlineData("superadmin1@org.com", "stringer", 2, 7, new int[] { 5 })]
        [InlineData("superadmin1@org.com", "stringer", 1, 8, new int[] { })]
        [InlineData("superadmin1@org.com", "stringer", 2, 9, new int[] { })]
        [InlineData("superadmin1@org.com", "stringer", 99, 10, new int[] { })]
        public async Task Test_SuperAdmin_CanAccess_AllPerformanceReviews_ForAnyEmpInAnyOrgAsync(string email, string password, int orgId, int empId, int[] performanceReviewIds)
        {
            var performanceReviews = await GetAllPerformanceReviewsAsync(email, password, orgId, empId);

            performanceReviews.Select(pr => pr.Id).Should().BeEquivalentTo(performanceReviewIds);
            if (performanceReviews.Any())
            {
                performanceReviews.Select(pr => pr.OrganizationId).Distinct().Should().BeEquivalentTo(new[] { orgId });
                performanceReviews.Select(pr => pr.EmployeeId).Distinct().Should().BeEquivalentTo(new[] { empId });
            }
        }

        /// <summary>
        /// Tests: Org Admins can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="performanceReviewIds"></param>
        [Theory]
        [InlineData("admin1@org1.com", "stringer", 1, 1, new int[] { 1, 2 })]
        [InlineData("admin1@org1.com", "stringer", 1, 2, new int[] { })]
        [InlineData("admin1@org1.com", "stringer", 1, 3, new int[] { })]
        [InlineData("admin1@org1.com", "stringer", 1, 4, new int[] { 3 })]
        [InlineData("admin1@org1.com", "stringer", 1, 5, new int[] { 4 })]
        [InlineData("admin1@org1.com", "stringer", 1, 6, new int[] { })]
        [InlineData("admin1@org2.com", "stringer", 2, 7, new int[] { 5 })]
        [InlineData("admin1@org1.com", "stringer", 1, 8, new int[] { })]
        [InlineData("admin1@org2.com", "stringer", 2, 9, new int[] { })]
        public async Task Test_OrgAdmin_CanAccess_AnyPerformanceReviews_ForAnyEmpInSameOrgAsync(string email, string password, int orgId, int empId, int[] performanceReviewIds)
        {
            var performanceReviews = await GetAllPerformanceReviewsAsync(email, password, orgId, empId);

            performanceReviews.Select(pr => pr.Id).Should().BeEquivalentTo(performanceReviewIds);
            if (performanceReviews.Any())
            {
                performanceReviews.Select(pr => pr.OrganizationId).Distinct().Should().BeEquivalentTo(new[] { orgId });
                performanceReviews.Select(pr => pr.EmployeeId).Distinct().Should().BeEquivalentTo(new[] { empId });
            }
        }

        /// <summary>
        /// Tests: Org Admins sees 404 when tries to access employees in other organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("admin1@org2.com", "stringer", 1, 1)]
        [InlineData("admin1@org2.com", "stringer", 1, 2)]
        [InlineData("admin1@org2.com", "stringer", 1, 3)]
        [InlineData("admin1@org2.com", "stringer", 1, 4)]
        [InlineData("admin1@org2.com", "stringer", 1, 5)]
        [InlineData("admin1@org2.com", "stringer", 1, 6)]
        [InlineData("admin1@org1.com", "stringer", 2, 7)]
        [InlineData("admin1@org2.com", "stringer", 1, 8)]
        [InlineData("admin1@org1.com", "stringer", 2, 9)]
        public async Task Test_OrgAdmin_Gets404_WhenAccessingPerformanceReviews_ForEmpInOtherOrgAsync(string email, string password, int orgId, int empId)
        {
            await GetAllPerformanceReviewsAsync(email, password, orgId, empId, 404);
        }

        /// <summary>
        /// Tests: Org Admins can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="performanceReviewIds"></param>
        [Theory]
        [InlineData("emp1@org1.com", "stringer", 1, 1, new int[] { 1, 2 })]
        [InlineData("emp2@org1.com", "stringer", 1, 2, new int[] { })]
        [InlineData("emp3@org1.com", "stringer", 1, 3, new int[] { })]
        [InlineData("emp4@org1.com", "stringer", 1, 4, new int[] { 3 })]
        [InlineData("emp5@org1.com", "stringer", 1, 5, new int[] { 4 })]
        [InlineData("emp6@org1.com", "stringer", 1, 6, new int[] { })]
        [InlineData("emp1@org2.com", "stringer", 2, 7, new int[] { 5 })]
        [InlineData("admin1@org1.com", "stringer", 1, 8, new int[] { })]
        [InlineData("admin1@org2.com", "stringer", 2, 9, new int[] { })]
        public async Task Test_OrgEmp_CanAccess_AnyPerformanceReviews_ForSameEmpInSameOrgAsync(string email, string password, int orgId, int empId, int[] performanceReviewIds)
        {
            var performanceReviews = await GetAllPerformanceReviewsAsync(email, password, orgId, empId);

            performanceReviews.Select(pr => pr.Id).Should().BeEquivalentTo(performanceReviewIds);
            if (performanceReviews.Any())
            {
                performanceReviews.Select(pr => pr.OrganizationId).Distinct().Should().BeEquivalentTo(new[] { orgId });
                performanceReviews.Select(pr => pr.EmployeeId).Distinct().Should().BeEquivalentTo(new[] { empId });
            }
        }

        /// <summary>
        /// Tests: Org Employees can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("emp2@org1.com", "stringer", 1, 1)]
        [InlineData("emp1@org1.com", "stringer", 1, 2)]
        [InlineData("emp1@org1.com", "stringer", 1, 3)]
        [InlineData("emp1@org1.com", "stringer", 1, 4)]
        [InlineData("emp1@org1.com", "stringer", 1, 5)]
        [InlineData("emp1@org1.com", "stringer", 1, 6)]
        //[InlineData("emp2@org2.com", "stringer", 2, 7)]
        [InlineData("emp1@org1.com", "stringer", 1, 8)]
        [InlineData("emp1@org2.com", "stringer", 2, 9)]
        public async Task Test_OrgEmp_Gets404_WhenAccessingPerformanceReviews_ForOtherEmpInSameOrgAsync(string email, string password, int orgId, int empId)
        {
            await GetAllPerformanceReviewsAsync(email, password, orgId, empId, 404);
        }

        /// <summary>
        /// Tests: Org Employees see 403 when tries to access employees in other organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("emp1@org2.com", "stringer", 1, 1)]
        [InlineData("emp1@org2.com", "stringer", 1, 2)]
        [InlineData("emp1@org2.com", "stringer", 1, 3)]
        [InlineData("emp1@org2.com", "stringer", 1, 4)]
        [InlineData("emp1@org2.com", "stringer", 1, 5)]
        [InlineData("emp1@org2.com", "stringer", 1, 6)]
        [InlineData("emp1@org1.com", "stringer", 2, 7)]
        [InlineData("emp1@org2.com", "stringer", 1, 8)]
        [InlineData("emp1@org1.com", "stringer", 2, 9)]
        public async Task Test_OrgEmp_Gets404_WhenAccessingPerformanceReviews_ForOtherOrg_Async(string email, string password, int orgId, int empId)
        {
            await GetAllPerformanceReviewsAsync(email, password, orgId, empId, 404);
        }
    }
}
