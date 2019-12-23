using System;

namespace Org.ERM.WebApi.Models.Domain
{
    public class BaseModel
    {
        public int Id { get; set; }
    }

    public class BaseEntityModel : BaseModel
    {
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
