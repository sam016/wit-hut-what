using System;
using Org.ERM.WebApi.Enums;

namespace Org.ERM.WebApi.Models.Dtos
{
    public class ErrorDto
    {
        public int Status { get; set; }
        public string Error { get; set; }
        // public string StackTrace { get; set; }
    }
}
