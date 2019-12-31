using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.Employee;
using Org.ERM.WebApi.Models.Domain;
using Org.ERM.WebApi.Persistence.Repositories;
using Org.ERM.WebApi.Services;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Org.ERM.WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("organizations/{orgId}/employees")]
    public class EmployeeController : BaseController
    {
        private readonly IEmployeeRepository EmployeeRepository;
        private readonly IAuthenticationService AuthenticationService;

        public EmployeeController(
            ILogger<EmployeeController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IEmployeeRepository employeeRepository) : base(logger, mapper)
        {
            EmployeeRepository = employeeRepository;
            AuthenticationService = authenticationService;
        }

        /// <summary>
        /// Creates the new employee
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(EmployeeDto))]
        [ProducesResponseType(500)]
        public async Task<IActionResult> RegisterAsync([FromRoute] int orgId, [FromBody]CreateEmployeeRequest request)
        {
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords are not matching!" });
            }

            var existingEmployee = await EmployeeRepository.GetByEmailAsync(request.Email);

            if (existingEmployee != null)
            {
                return BadRequest(new { message = "Email id is taken!" });
            }

            var employee = new Employee()
            {
                Name = request.Name,
                Email = request.Email,
                Password = Utils.HashHelper.HashPassword(request.Password),
                OrganizationId = orgId,
                Role = Enums.UserRole.Employee,
            };

            await EmployeeRepository.CreateAsync(employee);

            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, Mapper.Map<EmployeeDto>(employee));
        }

        /// <summary>
        /// Gets all the employees in the organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<EmployeeDto>))]
        public async Task<IActionResult> GetAll([FromRoute] int orgId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            if ((userRole == UserRole.Employee || userRole == UserRole.Admin) && userOrgId != orgId)
            {
                return NotFound();
            }

            IEnumerable<Employee> employees;

            // FIXME: logged in user is Employee && requested user id is different
            // if (userRole == UserRole.Employee)
            // {
            //     employees = await EmployeeRepository.GetAllAsync(e => e.OrganizationId == orgId && e.Id == userId);
            // }
            // else if (userRole == UserRole.Admin)
            // {
            //      employees = await EmployeeRepository.GetAllAsync(e => e.OrganizationId == orgId);
            // }
            // else
            // {
            //     employees = await EmployeeRepository.GetAllAsync();
            // }

            employees = await EmployeeRepository.GetAllAsync(e => e.OrganizationId == orgId);

            // await Task.Delay(TimeSpan.FromSeconds(2));

            var employeesDto = employees.Select(org => Mapper.Map<EmployeeDto>(org));

            return Ok(employeesDto);
        }

        /// <summary>
        /// Gets the employee by id in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(EmployeeDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int orgId, [FromRoute]int id)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            // user doesn't permission in the orgId
            if ((userRole == UserRole.Employee || userRole == UserRole.Admin) && userOrgId != orgId)
            {
                return NotFound();
            }

            //// FIXME: logged in user is Employee && requested user id is different; so user shouldn't be able to access that
            //if (userRole == UserRole.Employee && userId != id)
            //{
            //    return NotFound();
            //}

            var employee = await EmployeeRepository.GetByIdAsync(id);

            if (employee == null || (userRole == UserRole.Admin && orgId != employee.OrganizationId))
            {
                return NotFound();
            }

            var employeeDto = Mapper.Map<EmployeeDto>(employee);

            return Ok(employeeDto);
        }
    }
}
