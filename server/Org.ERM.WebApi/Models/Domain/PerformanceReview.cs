using System.Collections.Generic;
using System;

namespace Org.ERM.WebApi.Models.Domain {
  public class PerformanceReview : BaseEntityModel {
    public int EmployeeId {get;set;}
    public Employee Employee {get;set;}

    public int OrganizationId {get;set;}
    public Organization Organization {get;set;}

    public DateTime? CompletedOn {get;set;}

    public List<PerformanceReviewACL> PermittedEmployees { get; set; }
    public List<PerformanceReviewFeedback> PerformanceReviewFeedbacks { get; set; }
  }
}
