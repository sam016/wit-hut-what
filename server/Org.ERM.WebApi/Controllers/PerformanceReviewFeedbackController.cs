using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.PerformanceReviewFeedback;
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
    [Route("organizations/{orgId}/employees/{empId}/performance-reviews/{performanceReviewId}/feedbacks")]
    public class PerformanceReviewFeedbackController : BaseController
    {
        private readonly IPerformanceReviewFeedbackRepository PerformanceReviewFeedbackRepository;
        private readonly IPerformanceReviewRepository PerformanceReviewRepository;
        private readonly IAuthenticationService AuthenticationService;
        private readonly IOrganizationRepository OrganizationRepository;
        private readonly IEmployeeRepository EmployeeRepository;

        public PerformanceReviewFeedbackController(
            ILogger<PerformanceReviewFeedbackController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IOrganizationRepository organizationRepository,
            IEmployeeRepository employeeRepository,
            IPerformanceReviewRepository performanceReviewRepository,
            IPerformanceReviewFeedbackRepository performanceReviewFeedbackRepository) : base(logger, mapper)
        {
            PerformanceReviewFeedbackRepository = performanceReviewFeedbackRepository;
            PerformanceReviewRepository = performanceReviewRepository;
            AuthenticationService = authenticationService;
            OrganizationRepository = organizationRepository;
            EmployeeRepository = employeeRepository;
        }

        [HttpPost("")]
        [ProducesResponseType((int)HttpStatusCode.Created, Type = typeof(PerformanceReviewFeedbackDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateAsync([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId, [FromBody]CreatePerformanceReviewFeedbackRequest request)
        {
            if (!(await OrganizationRepository.ExistsAsync(orgId)))
            {
                return NotFound();
            }

            if (!(await EmployeeRepository.ExistsAsync(empId)))
            {
                return NotFound();
            }

            var performanceReview = await PerformanceReviewRepository.GetByIdAsync(performanceReviewId);

            if (performanceReview == null)
            {
                return NotFound();
            }

            var fromEmpId = AuthenticationService.GetLoggedInUserId();

            var performanceReviewFeedback = new PerformanceReviewFeedback()
            {
                OrganizationId = orgId,
                FromEmployeeId = fromEmpId,
                ForEmployeeId = performanceReview.EmployeeId,
                Comment = request.Comment,
                Rating = request.Rating,
            };

            await PerformanceReviewFeedbackRepository.CreateAsync(performanceReviewFeedback);

            return CreatedAtAction(nameof(GetById), new { id = performanceReview.Id }, Mapper.Map<PerformanceReviewFeedbackDto>(performanceReview));
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<PerformanceReviewFeedbackDto>))]
        public async Task<IActionResult> GetAll([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            if ((userRole == Enums.UserRole.Admin || userRole == Enums.UserRole.Employee) && userOrgId != orgId)
            {
                return NotFound();
            }

            var performanceReviewFeedbacks = await PerformanceReviewFeedbackRepository
                .GetAllAsync(e => e.OrganizationId == orgId
                                  && e.ForEmployeeId == empId
                                  && e.PerformanceReviewId == performanceReviewId);

            if (userRole == Enums.UserRole.Employee)
            {
                performanceReviewFeedbacks = performanceReviewFeedbacks.Where(f => f.FromEmployeeId == userId);
            }

            var performanceReviewFeedbacksDto = performanceReviewFeedbacks.Select(org => Mapper.Map<PerformanceReviewFeedbackDto>(org));

            return Ok(performanceReviewFeedbacksDto);
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewFeedbackDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId, [FromRoute]int id)
        {
            var performanceReviewFeedback = await PerformanceReviewFeedbackRepository.GetByIdAsync(id);

            if (performanceReviewFeedback == null || !CanUserAccessPerformanceReviewFeedback(performanceReviewFeedback))
            {
                return NotFound();
            }

            var performanceReviewDto = Mapper.Map<PerformanceReviewFeedbackDto>(performanceReviewFeedback);

            return Ok(performanceReviewDto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewFeedbackDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId, [FromRoute]int id, [FromBody]UpdatePerformanceReviewFeedbackRequest request)
        {
            var performanceReviewFeedback = await PerformanceReviewFeedbackRepository.GetByIdAsync(id);

            if (performanceReviewFeedback == null || !CanUserAccessPerformanceReviewFeedback(performanceReviewFeedback))
            {
                return NotFound();
            }

            performanceReviewFeedback.Name = request.Name;
            performanceReviewFeedback.Comment = request.Comment;
            performanceReviewFeedback.Rating = request.Rating;

            await PerformanceReviewFeedbackRepository.UpdateAsync(performanceReviewFeedback);

            // FIXME: make me NoContent()
            return Ok(new { });
        }

        private bool CanUserAccessPerformanceReviewFeedback(PerformanceReviewFeedback review)
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

            if (userRole == UserRole.Employee && userOrgId == review.OrganizationId && userId == review.FromEmployeeId)
            {
                return true;
            }

            return false;
        }
    }
}
