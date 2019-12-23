using System;
using Org.ERM.WebApi.Enums;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class EmployeeDto : BaseEntityDto
    {
        public string Email { get; set; }
        public int OrganizationId { get; set; }
        public UserRole Role { get; set; }
        public DateTime LastLoggedIn { get; set; }
    }
}
