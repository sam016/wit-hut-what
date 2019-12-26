using System;
using Org.ERM.WebApi.Enums;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class PerformanceReviewDto : BaseEntityDto
    {
        public BaseEntityDto Employee { get; set; }

        public BaseEntityDto Organization { get; set; }
    }
}
