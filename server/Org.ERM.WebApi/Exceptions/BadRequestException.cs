using System;

namespace Org.ERM.WebApi.Exceptions
{
    public class BadRequestException : HttpResponseException
    {
        public BadRequestException(string message) : base(400, message) { }
    }

}
