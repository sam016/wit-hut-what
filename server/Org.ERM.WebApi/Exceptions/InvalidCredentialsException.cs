using System;

namespace Org.ERM.WebApi.Exceptions
{
    public class InvalidCredentialsException : HttpResponseException
    {
        public InvalidCredentialsException() : base(401, "Invalid credentials") { }
    }

}
