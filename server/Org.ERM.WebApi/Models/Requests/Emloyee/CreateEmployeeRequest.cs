using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.Employee
{
    public class CreateEmployeeRequest
    {
        [Required]
        [StringLength(32, MinimumLength = 2)]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 8)]
        public string Password { get; set; }
        [Required]
        [StringLength(32, MinimumLength = 8)]
        public string ConfirmPassword { get; set; }
    }
}
