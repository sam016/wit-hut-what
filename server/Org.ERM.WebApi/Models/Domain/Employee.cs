using System.Collections.Generic;
using Org.ERM.WebApi.Enums;
using System;

namespace Org.ERM.WebApi.Models.Domain
{
    public class Employee : BaseEntityModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        public DateTime LastLoggedIn { get; set; }

        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }

        public List<PerformanceReviewACL> PermittedPerformanceReviews { get; set; }
        public List<PerformanceReview> PerformanceReviews { get; set; }
    }
}
