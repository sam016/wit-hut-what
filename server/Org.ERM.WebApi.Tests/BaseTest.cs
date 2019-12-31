using System;
using Org.ERM.WebApi.Tests.Extensions;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Org.ERM.WebApi.Tests.Factory;
using Microsoft.AspNetCore.Mvc.Testing;
using FluentAssertions;

// The following line sets the maximum number of threads to 1 when running test in parallel
[assembly: Xunit.CollectionBehavior(MaxParallelThreads = 1)]
namespace Org.ERM.WebApi.Tests
{
    public abstract class BaseTest
    {
        protected readonly HttpClient Client;
        protected readonly MyWebApplicationFactory Factory;

        public BaseTest(MyWebApplicationFactory factory)
        {
            Factory = factory;
            Client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        //public void OldBaseTest()
        //{
        //    var builder = new WebHostBuilder()
        //   .UseConfiguration(GetConfiguration())
        //   .UseStartup<Startup>()
        //   .ConfigureTestServices(services =>
        //   {
        //       services.ConfigureInMemoryDB();
        //   })
        //   //.ConfigureServices(services =>
        //   //{
        //   //    services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
        //   //    {
        //   //        options.TokenValidationParameters = new TokenValidationParameters()
        //   //        {
        //   //            SignatureValidator = (token, parameters) => new JwtSecurityToken(token)
        //   //        };
        //   //        options.Audience = TestAuthorisationConstants.Audience;
        //   //        options.Authority = TestAuthorisationConstants.Issuer;
        //   //        options.BackchannelHttpHandler = new MockBackchannel();
        //   //        options.MetadataAddress = "https://inmemory.microsoft.com/common/.well-known/openid-configuration";
        //   //    });
        //   //})
        //   ;

        //    var server = new TestServer(builder);

        //    Client = server.CreateClient();
        //    Client.BaseAddress = new Uri("http://localhost:5012");
        //}

        private Microsoft.Extensions.Configuration.IConfiguration GetConfiguration()
        {
            var config = new ConfigurationBuilder()
               .AddJsonFile("appsettings.development.json")
               .AddJsonFile("appsettings.json")
               .Build();
            return config;
        }

        protected async Task<string> GetTokenAsync(string email, string password)
        {
            var dto = await PostAsync<Models.Requests.Auth.AuthLoginRequest, Models.Dtos.AuthUserTokenDto>(null, "/auth/login", new Models.Requests.Auth.AuthLoginRequest
            {
                Email = email,
                Password = password,
            });

            return dto.Token;
        }

        protected async Task<O> PostAsync<R, O>(string authToken, string url, R request, int statusCode = 200)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                Client.DefaultRequestHeaders.Remove("Authorization");
            }
            else
            {
                Client.DefaultRequestHeaders.Add("Authorization", "bearer " + authToken);
            }

            var response = await Client.PostAsJsonAsync(url, request);

            ((int)response.StatusCode).Should().Be(statusCode);

            if (response.IsSuccessStatusCode)
            {
                return await response.GetValueAsync<O>();
            }

            return default;
        }

        protected async Task<O> GetAsync<O>(string authToken, string url, int statusCode = 200)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                Client.DefaultRequestHeaders.Remove("Authorization");
            }
            else
            {
                Client.DefaultRequestHeaders.Add("Authorization", "Bearer " + authToken);
            }

            var response = await Client.GetAsync(url);

            ((int)response.StatusCode).Should().Be(statusCode);

            if (response.IsSuccessStatusCode)
            {
                return await response.GetValueAsync<O>();
            }

            return default;
        }
    }
}
