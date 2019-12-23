using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Org.ERM.WebApi.Exceptions;
using Org.ERM.WebApi.Models.Domain;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.Auth;
using Org.ERM.WebApi.Persistence.Repositories;
using Org.ERM.WebApi.Utils;
using Org.ERM.WebApi.Services;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;

namespace Org.ERM.WebApi.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : BaseController
    {
        private readonly IEmployeeRepository EmployeeRepository;
        private readonly IAuthenticationService AuthenticationService;

        public AuthController(
            ILogger<AuthController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IEmployeeRepository employeeRepository) : base(logger, mapper)
        {
            EmployeeRepository = employeeRepository;
            AuthenticationService = authenticationService;
        }

        [HttpPost("login")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(AuthUserTokenDto))]
        [ProducesResponseType(401)]
        public async Task<IActionResult> LoginAsync([FromBody]AuthLoginRequest request)
        {
            var employee = await EmployeeRepository.GetByEmailAsync(request.Email);

            if (employee == null)
            {
                throw new InvalidCredentialsException();
            }

            if (!HashHelper.AreSameHashes(employee.Password, request.Password))
            {
                throw new InvalidCredentialsException();
            }

            var authTokenDto = AuthenticationService.GenerateToken(employee);

            return Ok(authTokenDto);
        }

        [HttpGet("whoami")]
        [Authorize]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(AuthUserTokenDto))]
        [ProducesResponseType(401)]
        public async Task<IActionResult> WhoAmIAsync()
        {
            var empId = AuthenticationService.GetLoggedInUserId();
            var employee = await EmployeeRepository.GetByIdAsync(empId);

            if (employee == null)
            {
                return NotFound();
            }

            var employeeDto = Mapper.Map<EmployeeDto>(employee);

            return Ok(employeeDto);
        }
    }
}
