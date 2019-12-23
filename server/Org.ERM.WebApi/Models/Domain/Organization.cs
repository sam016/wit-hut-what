using System.Collections.Generic;

namespace Org.ERM.WebApi.Models.Domain
{
    public class Organization : BaseEntityModel
    {
        public List<Employee> Employees { get; set; }
    }
}
