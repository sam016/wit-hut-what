using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.PerformanceReviewFeedback
{
    public class CreatePerformanceReviewFeedbackRequest
    {
        [Required]
        [StringLength(100)]
        public string Comment { get; set; }

        [Required]
        [Range(1, 5)]
        public byte Rating { get; set; }
    }
}
