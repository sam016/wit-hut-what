using System;
using Org.ERM.WebApi.Enums;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class PerformanceReviewFeedbackDto : BaseEntityDto
    {
        public string Comment { get; set; }
        public int Rating { get; set; }
        public int PerformanceReviewId { get; set; }
        public BaseEntityDto FromEmployee { get; set; }
        public BaseEntityDto ForEmployee { get; set; }
    }
}
