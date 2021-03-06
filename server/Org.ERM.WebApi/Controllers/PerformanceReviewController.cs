using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Exceptions;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.PerformanceReview;
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
    [Route("organizations/{orgId}/employees/{empId}/performance-reviews")]
    public class PerformanceReviewController : BaseController
    {
        private readonly IAuthenticationService AuthenticationService;
        private readonly IEmployeeRepository EmployeeRepository;
        private readonly IOrganizationRepository OrganizationRepository;
        private readonly IPerformanceReviewFeedbackRepository PerformanceReviewFeedbackRepository;
        private readonly IPerformanceReviewRepository PerformanceReviewRepository;

        public PerformanceReviewController(
            ILogger<PerformanceReviewController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IOrganizationRepository organizationRepository,
            IEmployeeRepository employeeRepository,
            IPerformanceReviewRepository performanceReviewRepository,
            IPerformanceReviewFeedbackRepository performanceReviewFeedbackRepository) : base(logger, mapper)
        {
            PerformanceReviewRepository = performanceReviewRepository;
            AuthenticationService = authenticationService;
            OrganizationRepository = organizationRepository;
            EmployeeRepository = employeeRepository;
            PerformanceReviewFeedbackRepository = performanceReviewFeedbackRepository;
        }

        #region CRUD

        /// <summary>
        /// Creates a new Performance Review for an employee in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(PerformanceReviewDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateAsync([FromRoute] int orgId, [FromRoute] int empId, [FromBody]CreatePerformanceReviewRequest request)
        {
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();
            var userRole= AuthenticationService.GetLoggedInUserRole();

            if (userRole==UserRole.Admin && orgId != userOrgId)
            {
                return NotFound();
            }

            if (!(await OrganizationRepository.ExistsAsync(orgId)))
            {
                return NotFound();
            }

            var userId = AuthenticationService.GetLoggedInUserId();

            var performanceReview = new PerformanceReview()
            {
                Name = request.Name,
                OrganizationId = orgId,
                EmployeeId = empId,
            };

            await PerformanceReviewRepository.CreateAsync(performanceReview);

            return CreatedAtAction(nameof(GetById), new { orgId = orgId, empId = empId, id = performanceReview.Id }, Mapper.Map<PerformanceReviewDto>(performanceReview));
        }

        [HttpGet("/organizations/{orgId}/performance-reviews")]
        [Authorize(Roles = "SuperAdmin,Admin")]
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

        /// <summary>
        /// Gets all the Performance Reviews for an employee in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<PerformanceReviewDto>))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetAllInEmployeeAsync([FromRoute] int orgId, [FromRoute] int empId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            // logged in user doesn't have permission to access in organization
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

        /// <summary>
        /// Gets the Performance Review by id for an employee in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
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

        #endregion CRUD

        #region ACL

        /// <summary>
        /// Gets the permitted Performance Reviews to an employee for feedback in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <returns></returns>
        [HttpGet("/organizations/{orgId}/employees/{empId}/permitted/performance-reviews")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetPermittedAsync([FromRoute] int orgId, [FromRoute] int empId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            var organization = await OrganizationRepository.GetByIdAsync(orgId);

            if (organization == null)
            {
                return NotFound();
            }

            // logged in user doesn't have permission to access in organization
            if ((userRole == UserRole.Admin || userRole == UserRole.Employee) && orgId != userOrgId)
            {
                return NotFound();
            }

            // logged in user when employee is diff then the request user
            if (userRole == UserRole.Employee && userId != empId)
            {
                return NotFound();
            }

            IEnumerable<PerformanceReview> performanceReviews;

            if (userRole == UserRole.Admin || userRole == UserRole.SuperAdmin)
            {
                performanceReviews = await PerformanceReviewRepository.GetAllAsync(orgId);
            }
            else
            {
                performanceReviews = await PerformanceReviewRepository.GetAllPermittedAsync(orgId, empId);
            }

            var performanceReviewDtos = performanceReviews.Select(pr => new PerformanceReviewDto
            {
                Id = pr.Id,
                Name = pr.Name,
                EmployeeId = pr.EmployeeId,
                OrganizationId = orgId,
            });

            return Ok(performanceReviewDtos);
        }

        /// <summary>
        /// Permits the Performance Reviews to an employee for feedback in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="performanceReviewId"></param>
        /// <returns></returns>
        [HttpPost("/organizations/{orgId}/employees/{empId}/permit/performance-reviews/{performanceReviewId}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewFeedbackDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> PermitAsync([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId)
        {
            var performanceReview = await PerformanceReviewRepository.GetByIdAsync(performanceReviewId);

            if (performanceReview == null || !DoesOwnPerformanceReview(performanceReview))
            {
                return NotFound();
            }

            if (performanceReview.EmployeeId==empId ){
                throw new BadRequestException("Can't allow employee to provide feedback for himself/herself");
            }

            if (await PerformanceReviewRepository.PermitAsync(performanceReviewId, empId))
            {
                var performanceReviewFeedback = new PerformanceReviewFeedback()
                {
                    Name = "",
                    ForEmployeeId = performanceReview.EmployeeId,
                    FromEmployeeId = empId,
                    OrganizationId = orgId,
                    PerformanceReviewId = performanceReviewId,
                };

                await PerformanceReviewFeedbackRepository.CreateAsync(performanceReviewFeedback);

                var performanceReviewFeedbackDto = this.Mapper.Map<PerformanceReviewFeedbackDto>(performanceReviewFeedback);

                return Ok(performanceReviewFeedbackDto);
            }

            return BadRequest();
        }

        /// <summary>
        /// Prohibits/Revokes access from an employee for feedback to a Performance Review in an organization
        /// </summary>
        /// <param name="orgId"></param>
        /// <param name="empId"></param>
        /// <param name="performanceReviewId"></param>
        /// <returns></returns>
        [HttpPost("/organizations/{orgId}/employees/{empId}/prohibit/performance-reviews/{performanceReviewId}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
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

        /// <summary>
        /// Checks whether user owns the performance review or not
        /// - Super Admin can access all
        /// - Org Admin can access only its own org's performance reviews
        /// - Org Employee can access only its own performance reviews
        /// </summary>
        /// <param name="review"></param>
        /// <returns></returns>
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
