using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.PerformanceReviewFeedback
{
    public class UpdatePerformanceReviewFeedbackRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Comment { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
    }
}
