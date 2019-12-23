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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Org.ERM.WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("employees")]
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

        [HttpPost]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(EmployeeDto))]
        [ProducesResponseType(500)]
        public async Task<IActionResult> RegisterAsync([FromBody]CreateEmployeeRequest request)
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
                OrganizationId = 0,
                Role = Enums.UserRole.Employee,
            };

            await EmployeeRepository.CreateAsync(employee);

            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, Mapper.Map<EmployeeDto>(employee));
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<EmployeeDto>))]
        public async Task<IActionResult> GetAll()
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            IEnumerable<Employee> employees;

            // logged in user is Employee && requested user id is different
            if (userRole == UserRole.Employee)
            {
                employees = await EmployeeRepository.GetAllAsync(e => e.OrganizationId == userOrgId && e.Id == userId);
            }
            else if (userRole == UserRole.Admin)
            {
                employees = await EmployeeRepository.GetAllAsync(e => e.OrganizationId == userOrgId);
            }
            else
            {
                employees = await EmployeeRepository.GetAllAsync();
            }

            var employeesDto = employees.Select(org => Mapper.Map<EmployeeDto>(org));

            return Ok(employeesDto);
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(EmployeeDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            // logged in user is Employee && requested user id is different
            if (userRole == UserRole.Employee && userId != id)
            {
                return NotFound();
            }

            var employee = await EmployeeRepository.GetByIdAsync(id);

            if (employee == null || (userRole == UserRole.Admin && userOrgId != employee.OrganizationId))
            {
                return NotFound();
            }

            var employeeDto = Mapper.Map<EmployeeDto>(employee);

            return Ok(employeeDto);
        }
    }
}
