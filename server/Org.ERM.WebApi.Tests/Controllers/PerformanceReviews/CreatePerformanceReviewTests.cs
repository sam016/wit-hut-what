using FluentAssertions;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.PerformanceReview;
using Org.ERM.WebApi.Tests.Factory;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Org.ERM.WebApi.Tests.Controllers.PerformanceReviews
{
    public class CreatePerformanceReviewTests : BaseTest, IClassFixture<MyWebApplicationFactory>
    {
        public CreatePerformanceReviewTests(MyWebApplicationFactory factory) : base(factory)
        { }

        private async Task<PerformanceReviewDto> CreatePerformanceReviewAsync(string email, string password, int orgId, int empId, string name, int statusCode = 201)
        {
            var token = await GetTokenAsync(email, password);

            var result = await PostAsync<CreatePerformanceReviewRequest, PerformanceReviewDto>(
                token,
                $"organizations/{orgId}/employees/{empId}/performance-reviews",
                new CreatePerformanceReviewRequest
                {
                    Name = name,
                },
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
        [Theory]
        [InlineData("superadmin1@org.com", "stringer", 1, 1, "test-000")]
        [InlineData("superadmin1@org.com", "stringer", 1, 2, "test-001")]
        [InlineData("superadmin1@org.com", "stringer", 1, 3, "test-002")]
        [InlineData("superadmin1@org.com", "stringer", 1, 4, "test-003")]
        [InlineData("superadmin1@org.com", "stringer", 1, 5, "test-004")]
        [InlineData("superadmin1@org.com", "stringer", 1, 6, "test-005")]
        [InlineData("superadmin1@org.com", "stringer", 2, 7, "test-006")]
        [InlineData("superadmin1@org.com", "stringer", 1, 8, "test-007")]
        [InlineData("superadmin1@org.com", "stringer", 2, 9, "test-008")]
        [InlineData("superadmin1@org.com", "stringer", 99, 10, "test-009")]
        public async Task Test_SuperAdmin_CanCreate_PerformanceReviews_ForAnyEmpInAnyOrgAsync(string email, string password, int orgId, int empId, string name)
        {
            var performanceReview = await CreatePerformanceReviewAsync(email, password, orgId, empId, name);

            performanceReview.Id.Should().NotBe(0);
            performanceReview.Name.Should().Be(name);
        }

        /// <summary>
        /// Tests: Org Admins can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("admin1@org1.com", "stringer", 1, 1, "test-000")]
        [InlineData("admin1@org1.com", "stringer", 1, 2, "test-001")]
        [InlineData("admin1@org1.com", "stringer", 1, 3, "test-002")]
        [InlineData("admin1@org1.com", "stringer", 1, 4, "test-003")]
        [InlineData("admin1@org1.com", "stringer", 1, 5, "test-004")]
        [InlineData("admin1@org1.com", "stringer", 1, 6, "test-005")]
        [InlineData("admin1@org2.com", "stringer", 2, 7, "test-006")]
        [InlineData("admin1@org1.com", "stringer", 1, 8, "test-007")]
        [InlineData("admin1@org2.com", "stringer", 2, 9, "test-008")]
        public async Task Test_OrgAdmin_CanCreate_PerformanceReviews_ForAnyEmpInSameOrgAsync(string email, string password, int orgId, int empId, string name)
        {
            var performanceReview = await CreatePerformanceReviewAsync(email, password, orgId, empId, name);

            performanceReview.Id.Should().NotBe(0);
            performanceReview.Name.Should().Be(name);
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
        public async Task Test_OrgAdmin_Gets404_WhenCreatingPerformanceReviews_ForAnyEmpInOtherOrgAsync(string email, string password, int orgId, int empId)
        {
            await CreatePerformanceReviewAsync(email, password, orgId, empId, "doesn't matter", 404);
        }

        /// <summary>
        /// Tests: Org Employees can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("emp1@org1.com", "stringer", 1, 1)]
        [InlineData("emp1@org1.com", "stringer", 1, 2)]
        [InlineData("emp1@org1.com", "stringer", 1, 3)]
        [InlineData("emp1@org1.com", "stringer", 1, 4)]
        [InlineData("emp1@org1.com", "stringer", 1, 5)]
        [InlineData("emp1@org1.com", "stringer", 1, 6)]
        [InlineData("emp1@org2.com", "stringer", 2, 7)]
        [InlineData("emp1@org1.com", "stringer", 1, 8)]
        [InlineData("emp1@org2.com", "stringer", 2, 9)]
        public async Task Test_OrgEmp_Gets403_WhenCreatingPerformanceReviews_ForAnyEmpInSameOrgAsync(string email, string password, int orgId, int empId)
        {
            await CreatePerformanceReviewAsync(email, password, orgId, empId, "doesn't matter", 403);
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
        public async Task Test_OrgEmp_Gets403_When_TryingToCreatePerformanceReview_ForOtherOrg_Async(string email, string password, int orgId, int empId)
        {
            await CreatePerformanceReviewAsync(email, password, orgId, empId, "doesn't matter", 403);
        }
    }
}
