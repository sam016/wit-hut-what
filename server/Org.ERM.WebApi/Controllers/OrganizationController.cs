using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.Organization;
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
    [Route("organizations")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public class OrganizationController : BaseController
    {
        private readonly IOrganizationRepository OrganizationRepository;
        private readonly IAuthenticationService AuthenticationService;

        public OrganizationController(
            ILogger<OrganizationController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IOrganizationRepository organizationRepository) : base(logger, mapper)
        {
            OrganizationRepository = organizationRepository;
            AuthenticationService = authenticationService;
        }

        /// <summary>
        /// Creates the Organization (available only for superamdin)
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(OrganizationDto))]
        public async Task<IActionResult> CreateAsync([FromBody]CreateOrganizationRequest request)
        {
            var org = new Organization()
            {
                Name = request.Name,
            };

            await OrganizationRepository.CreateAsync(org);

            var orgDto = Mapper.Map<OrganizationDto>(org);

            return CreatedAtAction(nameof(GetById), new { id = orgDto.Id }, orgDto);
        }

        /// <summary>
        /// Gets all the organizations
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<OrganizationDto>))]
        public async Task<IActionResult> GetAll()
        {
            var orgs = await OrganizationRepository.GetAllAsync();

            var orgsDto = orgs.Select(org => Mapper.Map<OrganizationDto>(org));

            return Ok(orgsDto);
        }

        /// <summary>
        /// Gets the organization by id
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(OrganizationDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();

            if (userRole != UserRole.SuperAdmin && id != AuthenticationService.GetLoggedInUserOrgId())
            {
                return NotFound();
            }

            var org = await OrganizationRepository.GetByIdAsync(id);

            if (org == null)
            {
                return NotFound();
            }

            var orgDto = Mapper.Map<OrganizationDto>(org);

            return Ok(orgDto);
        }
    }
}
