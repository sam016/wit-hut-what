using FluentAssertions;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Tests.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Org.ERM.WebApi.Tests.Controllers.Employees
{
    public class GetAllInOrgTests : BaseTest, IClassFixture<MyWebApplicationFactory>
    {
        public GetAllInOrgTests(MyWebApplicationFactory factory) : base(factory)
        { }

        private async Task<IEnumerable<EmployeeDto>> GetAllEmployeesInOrgsAsync(string email, string password, int orgId, int statusCode = 200)
        {
            var token = await GetTokenAsync(email, password);

            var result = await GetAsync<IEnumerable<EmployeeDto>>(token, $"organizations/{orgId}/employees", statusCode);

            return result;
        }

        /// <summary>
        /// Tests: SuperAdmin can access all the employees in an organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empIds"></param>
        [Theory]
        [InlineData("superadmin1@org.com", "stringer", 1, new[] { 1, 2, 3, 4, 5, 6, 8 })]
        [InlineData("superadmin1@org.com", "stringer", 2, new[] { 7, 9 })]
        public async Task Test_SuperAdminCanAccessAllOrgEmployeesAsync(string email, string password, int orgId, int[] empIds)
        {
            var emps = await GetAllEmployeesInOrgsAsync(email, password, orgId);

            emps.Select(emp => emp.Id).Should().BeEquivalentTo(empIds);
        }

        /// <summary>
        /// Tests: Org Admins can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empIds"></param>
        [Theory]
        [InlineData("admin1@org1.com", "stringer", 1, new[] { 1, 2, 3, 4, 5, 6, 8 })]
        [InlineData("admin1@org2.com", "stringer", 2, new[] { 7, 9 })]
        public async Task Test_OrgAdminCanAccessOnlyItsOrgEmployeesAsync(string email, string password, int orgId, int[] empIds)
        {
            var emps = await GetAllEmployeesInOrgsAsync(email, password, orgId);

            emps.Select(emp => emp.Id).Should().BeEquivalentTo(empIds);
        }

        /// <summary>
        /// Tests: Org Admins sees 404 when tries to access employees in other organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        [Theory]
        [InlineData("admin1@org1.com", "stringer", 2)]
        [InlineData("admin1@org2.com", "stringer", 1)]
        public async Task Test_OrgAdmin_Gets404_WhenAccessOtherOrgEmployeesAsync(string email, string password, int orgId)
        {
            await GetAllEmployeesInOrgsAsync(email, password, orgId, 404);
        }

        /// <summary>
        /// Tests: Org Employees can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        [Theory]
        [InlineData("emp1@org1.com", "stringer", 1, new[] { 1, 2, 3, 4, 5, 6, 8 })]
        [InlineData("emp1@org2.com", "stringer", 2, new[] { 7, 9 })]
        public async Task Test_OrgEmp_GetsAllEmps_WhenAccessEmployeesInSameOrgAsync(string email, string password, int orgId, int[] empIds)
        {
            var emps = await GetAllEmployeesInOrgsAsync(email, password, orgId);

            emps.Select(emp => emp.Id).Should().BeEquivalentTo(empIds);
        }

        /// <summary>
        /// Tests: Org Employees see 404 when tries to access employees in other organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        [Theory]
        [InlineData("emp1@org1.com", "stringer", 2)]
        [InlineData("emp1@org2.com", "stringer", 1)]
        public async Task Test_OrgEmp_Gets404_WhenAccessOtherOrgEmployeesAsync(string email, string password, int orgId)
        {
            await GetAllEmployeesInOrgsAsync(email, password, orgId, 404);
        }
    }
}
