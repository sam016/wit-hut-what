using System;

namespace Org.ERM.WebApi.Exceptions
{
    public class HttpResponseException : Exception
    {
        public int StatusCode { get; }

        public HttpResponseException(int statusCode, string error) : base(error)
        {
            StatusCode = statusCode;
        }
    }

}
