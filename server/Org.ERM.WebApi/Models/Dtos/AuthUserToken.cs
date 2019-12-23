using System;
using Org.ERM.WebApi.Enums;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class AuthUserTokenDto : EmployeeDto
    {
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
