using System;

namespace Org.ERM.WebApi.Exceptions
{
    public class InvalidCredentialsException : Exception
    {
        private const string ERR_MESSAGE = "Invalid credentials";
        public InvalidCredentialsException() : base(ERR_MESSAGE) { }
    }

}
