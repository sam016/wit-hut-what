using System;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class BaseDto
    {
        public int Id { get; set; }
    }

    public class BaseEntityDto : BaseDto
    {
        public string Name { get; set; }
    }
}
