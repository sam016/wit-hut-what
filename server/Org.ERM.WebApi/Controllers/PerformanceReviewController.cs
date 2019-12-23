using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.PerformanceReview;
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
    [Route("organizations/{orgId}/employees/{empId}/performance-reviews")]
    public class PerformanceReviewController : BaseController
    {
        private readonly IPerformanceReviewRepository PerformanceReviewRepository;
        private readonly IAuthenticationService AuthenticationService;
        private readonly IOrganizationRepository OrganizationRepository;

        public PerformanceReviewController(
            ILogger<PerformanceReviewController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IOrganizationRepository organizationRepository,
            IPerformanceReviewRepository performanceReviewRepository) : base(logger, mapper)
        {
            PerformanceReviewRepository = performanceReviewRepository;
            AuthenticationService = authenticationService;
            OrganizationRepository = organizationRepository;
        }

        [HttpPost("")]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(PerformanceReviewDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateAsync([FromRoute] int orgId, [FromRoute] int empId, [FromBody]CreatePerformanceReviewRequest request)
        {
            if (!(await OrganizationRepository.ExistsAsync(orgId)))
            {
                return NotFound();
            }

            var userId = AuthenticationService.GetLoggedInUserId();

            var performanceReview = new PerformanceReview()
            {
                OrganizationId = orgId,
                EmployeeId = userId,
            };

            await PerformanceReviewRepository.CreateAsync(performanceReview);

            return CreatedAtAction(nameof(GetById), new { id = performanceReview.Id }, Mapper.Map<PerformanceReviewDto>(performanceReview));
        }

        [HttpGet("/organizations/{orgId}/performance-reviews")]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<PerformanceReviewDto>))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetAllInOrganizationAsync([FromRoute] int orgId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            // logged in user is PerformanceReview && requested user id is different
            if (userRole == UserRole.Admin && orgId != userOrgId)
            {
                return NotFound();
            }

            var performanceReviews = await PerformanceReviewRepository.GetAllAsync(orgId);

            var performanceReviewsDto = performanceReviews.Select(org => Mapper.Map<PerformanceReviewDto>(org));

            return Ok(performanceReviewsDto);
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<PerformanceReviewDto>))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetAllInEmployeeAsync([FromRoute] int orgId, [FromRoute] int empId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            // logged in user doesn't permission to access in organization
            if ((userRole == UserRole.Admin || userRole == UserRole.Employee) && orgId != userOrgId)
            {
                return NotFound();
            }

            // logged in user when employee is diff then the request user
            if (userRole == UserRole.Employee && userId != empId)
            {
                return NotFound();
            }

            var performanceReviews = await PerformanceReviewRepository.GetAllAsync(orgId, empId);

            var performanceReviewsDto = performanceReviews.Select(org => Mapper.Map<PerformanceReviewDto>(org));

            return Ok(performanceReviewsDto);
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int orgId, [FromRoute] int empId, [FromRoute]int id)
        {
            var performanceReview = await PerformanceReviewRepository.GetByIdAsync(id);

            if (performanceReview == null || DoesOwnPerformanceReview(performanceReview))
            {
                return NotFound();
            }

            var performanceReviewDto = Mapper.Map<PerformanceReviewDto>(performanceReview);

            return Ok(performanceReviewDto);
        }

        #region ACL

        [HttpGet("/organizations/{orgId}/employees/{empId}/permitted/performance-reviews")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetPermittedAsync([FromRoute] int orgId, [FromRoute] int empId)
        {
            var performanceReview = await PerformanceReviewRepository.GetAllPermittedAsync(orgId, empId);

            var performanceReviewDto = Mapper.Map<PerformanceReviewDto>(performanceReview);

            return Ok(performanceReviewDto);
        }

        [HttpPost("/organizations/{orgId}/employees/{empId}/permit/performance-reviews/{performanceReviewId}")]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> PermitAsync([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId)
        {
            var performanceReview = await PerformanceReviewRepository.GetByIdAsync(performanceReviewId);

            if (performanceReview == null || !DoesOwnPerformanceReview(performanceReview))
            {
                return NotFound();
            }

            if (await PerformanceReviewRepository.PermitAsync(performanceReviewId, empId))
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("/organizations/{orgId}/employees/{empId}/prohibit/performance-reviews/{performanceReviewId}")]
        [Authorize("SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> ProhibitAsync([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId)
        {
            var performanceReview = await PerformanceReviewRepository.GetByIdAsync(performanceReviewId);

            if (performanceReview == null || !DoesOwnPerformanceReview(performanceReview))
            {
                return NotFound();
            }

            if (await PerformanceReviewRepository.ProhibitAsync(performanceReview, empId))
            {
                return Ok();
            }

            return BadRequest();
        }

        #endregion

        private bool DoesOwnPerformanceReview(PerformanceReview review)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            if (userRole == UserRole.SuperAdmin)
            {
                return true;
            }

            if (userRole == UserRole.Admin && userOrgId == review.OrganizationId)
            {
                return true;
            }

            if (userRole == UserRole.Employee && userOrgId == review.OrganizationId && userId == review.EmployeeId)
            {
                return true;
            }

            return false;
        }
    }
}
