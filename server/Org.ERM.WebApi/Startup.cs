using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Org.ERM.WebApi.Extensions;
using Org.ERM.WebApi.Persistence.Repositories;
using Org.ERM.WebApi.Services;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Org.ERM.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // services.AddMvc(opt =>
            // {
            //     opt.UseCentralRoutePrefix(new RouteAttribute("api/v{version}"));
            // });

            // services.AddApiVersioning(options =>
            // {
            //     var apiVersion = new ApiVersion(1, 0);

            //     options.ApiVersionReader = new UrlSegmentApiVersionReader();
            //     options.DefaultApiVersion = apiVersion;
            //     options.ReportApiVersions = true;
            //     options.AssumeDefaultVersionWhenUnspecified = true;
            // });

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.ConfigureSwagger();

            services.AddDbContext<DatabaseContext>(builder =>
            {
                var host = Configuration.GetValue<string>("Database:Host");
                var user = Configuration.GetValue<string>("Database:User");
                var pass = Configuration.GetValue<string>("Database:Pass");
                var database = Configuration.GetValue<string>("Database:Database");
                builder.UseMySql($"server={host};database={database};user={user};password={pass}");
            });

            services.AddAutoMapper(typeof(Startup));

            services.AddRepositories();
            services.AddAuthentication(Configuration);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                c.RoutePrefix = "swagger";
            });

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            // global cors policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}
