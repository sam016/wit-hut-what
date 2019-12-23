using System.ComponentModel.DataAnnotations;

namespace Org.ERM.WebApi.Models.Requests.Organization
{
    public class CreateOrganizationRequest
    {
        [Required]
        public string Name { get; set; }
    }
}
