
namespace Org.ERM.WebApi.Models.Domain
{
    public class PerformanceReviewACL : BaseModel
    {
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public int PerformanceReviewId { get; set; }
        public PerformanceReview PerformanceReview { get; set; }
    }
}
