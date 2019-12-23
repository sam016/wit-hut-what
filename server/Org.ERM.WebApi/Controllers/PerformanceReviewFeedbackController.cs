﻿using AutoMapper;
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
        private readonly IAuthenticationService AuthenticationService;
        private readonly IOrganizationRepository OrganizationRepository;
        private readonly IEmployeeRepository EmployeeRepository;

        public PerformanceReviewFeedbackController(
            ILogger<PerformanceReviewFeedbackController> logger,
            IMapper mapper,
            IAuthenticationService authenticationService,
            IOrganizationRepository organizationRepository,
            IEmployeeRepository employeeRepository,
            IPerformanceReviewFeedbackRepository performanceReviewRepository) : base(logger, mapper)
        {
            PerformanceReviewFeedbackRepository = performanceReviewRepository;
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

            var performanceReview = new PerformanceReviewFeedback()
            {
                OrganizationId = orgId,
                EmployeeId = empId,
            };

            await PerformanceReviewFeedbackRepository.CreateAsync(performanceReview);

            return CreatedAtAction(nameof(GetById), new { id = performanceReview.Id }, Mapper.Map<PerformanceReviewFeedbackDto>(performanceReview));
        }

        [HttpGet]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(IEnumerable<PerformanceReviewFeedbackDto>))]
        public async Task<IActionResult> GetAll([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId)
        {
            var userRole = AuthenticationService.GetLoggedInUserRole();
            var userId = AuthenticationService.GetLoggedInUserId();
            var userOrgId = AuthenticationService.GetLoggedInUserOrgId();

            IEnumerable<PerformanceReviewFeedback> performanceReviews;

            // logged in user is PerformanceReviewFeedback && requested user id is different
            if (userRole == UserRole.Employee)
            {
                performanceReviews = await PerformanceReviewFeedbackRepository.GetAllAsync(orgId, userId);
            }
            else if (userRole == UserRole.Admin)
            {
                performanceReviews = await PerformanceReviewFeedbackRepository.GetAllAsync(e => e.OrganizationId == userOrgId);
            }
            else
            {
                performanceReviews = await PerformanceReviewFeedbackRepository.GetAllAsync();
            }

            var performanceReviewsDto = performanceReviews.Select(org => Mapper.Map<PerformanceReviewFeedbackDto>(org));

            return Ok(performanceReviewsDto);
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(PerformanceReviewFeedbackDto))]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetById([FromRoute] int orgId, [FromRoute] int empId, [FromRoute] int performanceReviewId, [FromRoute]int id)
        {
            var performanceReview = await PerformanceReviewFeedbackRepository.GetByIdAsync(id);

            if (performanceReview == null || CanUserAccessPerformanceReviewFeedback(performanceReview))
            {
                return NotFound();
            }

            var performanceReviewDto = Mapper.Map<PerformanceReviewFeedbackDto>(performanceReview);

            return Ok(performanceReviewDto);
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

            if (userRole == UserRole.Employee && userOrgId == review.OrganizationId && userId == review.EmployeeId)
            {
                return true;
            }

            return false;
        }
    }
}