using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.PerformanceReview
{
    public class CreatePerformanceReviewRequest
    {
        [Required]
        public string Name { get; set; }
    }
}
