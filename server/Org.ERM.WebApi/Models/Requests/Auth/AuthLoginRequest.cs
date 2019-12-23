using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.Auth
{
    public class AuthLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(32, MinimumLength = 8)]
        public string Password { get; set; }
    }
}
