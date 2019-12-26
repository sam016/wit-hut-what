using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Org.ERM.WebApi.Exceptions;

namespace Org.ERM.WebApi.Filters
{
    public class HttpResponseExceptionFilter : IActionFilter, IOrderedFilter
    {
        public int Order { get; set; } = int.MaxValue - 10;

        public void OnActionExecuting(ActionExecutingContext context) { }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            var logger = context.HttpContext.RequestServices.GetService<ILogger<HttpResponseExceptionFilter>>();
            if (context.Exception is HttpResponseException exception)
            {
                var json = new Org.ERM.WebApi.Models.Dtos.ErrorDto
                {
                    Error = exception.Message,
                    Status = exception.StatusCode,
                };
                context.Result = new JsonResult(json)
                {
                    StatusCode = exception.StatusCode,
                };
                context.ExceptionHandled = true;
                logger.LogError(context.Exception, "");
            }
            else if (context.Exception != null)
            {
                var json = new Org.ERM.WebApi.Models.Dtos.ErrorDto
                {
                    Error = context.Exception.Message,
                    Status = 500,
                };
                context.Result = new JsonResult(json)
                {
                    StatusCode = 500,
                };
                context.ExceptionHandled = true;
                logger.LogError(context.Exception, "");
            }
        }
    }
}
