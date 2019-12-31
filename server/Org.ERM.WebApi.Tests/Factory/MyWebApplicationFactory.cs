using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Org.ERM.WebApi.Tests.Extensions;

namespace Org.ERM.WebApi.Tests.Factory
{
    public class MyWebApplicationFactory : WebApplicationFactory<Startup>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.ConfigureInMemoryDB();
            });
        }
    }

}
