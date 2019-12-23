
namespace Org.ERM.WebApi.Models.Domain
{
    public class PerformanceReviewFeedback : BaseEntityModel
    {
        public byte? Rating { get; set; }
        public string Comment { get; set; }

        public int PerformanceReviewId { get; set; }
        public PerformanceReview PerformanceReview { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public int OrganizationId { get; set; }
        public Organization Organization { get; set; }
    }
}
