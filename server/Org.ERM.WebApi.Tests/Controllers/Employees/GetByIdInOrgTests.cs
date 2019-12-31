using FluentAssertions;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Tests.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Org.ERM.WebApi.Tests.Controllers.Employees
{
    public class GetByIdInOrgTests : BaseTest, IClassFixture<MyWebApplicationFactory>
    {
        public GetByIdInOrgTests(MyWebApplicationFactory factory) : base(factory)
        { }

        private async Task<EmployeeDto> GetEmployeeByIdInOrgAsync(string email, string password, int orgId, int empId, int statusCode = 200)
        {
            var token = await GetTokenAsync(email, password);

            var result = await GetAsync<EmployeeDto>(token, $"organizations/{orgId}/employees/{empId}", statusCode);

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
        [InlineData("superadmin1@org.com", "stringer", 1, 1)]
        [InlineData("superadmin1@org.com", "stringer", 1, 2)]
        [InlineData("superadmin1@org.com", "stringer", 1, 3)]
        [InlineData("superadmin1@org.com", "stringer", 1, 4)]
        [InlineData("superadmin1@org.com", "stringer", 1, 5)]
        [InlineData("superadmin1@org.com", "stringer", 1, 6)]
        [InlineData("superadmin1@org.com", "stringer", 2, 7)]
        [InlineData("superadmin1@org.com", "stringer", 1, 8)]
        [InlineData("superadmin1@org.com", "stringer", 2, 9)]
        [InlineData("superadmin1@org.com", "stringer", 99, 10)]
        public async Task Test_SuperAdmin_CanAccess_AnyEmployeeByIdAsync(string email, string password, int orgId, int empId)
        {
            var emp = await GetEmployeeByIdInOrgAsync(email, password, orgId, empId);

            emp.Id.Should().Be(empId);
        }

        /// <summary>
        /// Tests: Org Admins can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        [Theory]
        [InlineData("admin1@org1.com", "stringer", 1, 1)]
        [InlineData("admin1@org1.com", "stringer", 1, 2)]
        [InlineData("admin1@org1.com", "stringer", 1, 3)]
        [InlineData("admin1@org1.com", "stringer", 1, 4)]
        [InlineData("admin1@org1.com", "stringer", 1, 5)]
        [InlineData("admin1@org1.com", "stringer", 1, 6)]
        [InlineData("admin1@org2.com", "stringer", 2, 7)]
        [InlineData("admin1@org1.com", "stringer", 1, 8)]
        [InlineData("admin1@org2.com", "stringer", 2, 9)]
        public async Task Test_OrgAdmin_CanAccess_OnlyItsOrgEmployeesByIdAsync(string email, string password, int orgId, int empId)
        {
            var emp = await GetEmployeeByIdInOrgAsync(email, password, orgId, empId);

            emp.Id.Should().Be(empId);
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
        public async Task Test_OrgAdmin_Gets404_WhenAccessOtherOrgEmployeesByIdAsync(string email, string password, int orgId, int empId)
        {
            await GetEmployeeByIdInOrgAsync(email, password, orgId, empId, 404);
        }

        /// <summary>
        /// Tests: Org Employees can access only the employees in its own organization
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
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
        public async Task Test_OrgEmp_GetsEmp_WhenAccessByIdInSameOrgAsync(string email, string password, int orgId, int empId)
        {
            var emp = await GetEmployeeByIdInOrgAsync(email, password, orgId, empId);

            emp.Id.Should().Be(empId);
        }

        /// <summary>
        /// Tests: Org Employees see 404 when tries to access employees in other organizations
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="orgId"></param>
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
        public async Task Test_OrgEmp_Gets404_WhenAccessOtherOrgEmployeeByIdAsync(string email, string password, int orgId, int empId)
        {
            await GetEmployeeByIdInOrgAsync(email, password, orgId, empId, 404);
        }
    }
}
