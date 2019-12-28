
namespace Org.ERM.WebApi.Models.Domain
{
    public class PerformanceReviewFeedback : BaseEntityModel
    {
        public int Rating { get; set; }
        public string Comment { get; set; }

        public int PerformanceReviewId { get; set; }
        public PerformanceReview PerformanceReview { get; set; }

        public int FromEmployeeId { get; set; }
        public Employee FromEmployee { get; set; }

        public int ForEmployeeId { get; set; }
        public Employee ForEmployee { get; set; }

        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }
    }
}
