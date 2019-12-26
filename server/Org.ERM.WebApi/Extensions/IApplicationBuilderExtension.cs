using Microsoft.AspNetCore.Builder;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;

namespace Org.ERM.WebApi.Extensions
{
    public static class IApplicationBuilderExtension
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        await context.Response.WriteAsync(JsonConvert.SerializeObject(new Models.Dtos.ErrorDto()
                        {
                            Status = context.Response.StatusCode,
                            // Error = "Internal Server Error."
                            Error = contextFeature.Error.ToString(),
                        }));
                    }
                });
            });
        }
    }
}
