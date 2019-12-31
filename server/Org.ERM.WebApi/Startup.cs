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
using Org.ERM.WebApi.Filters;
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
            services.AddControllers(options =>
                options.Filters.Add(new HttpResponseExceptionFilter()));

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.ConfigureSwagger();

            services.AddDbContext<ApplicationDbContext>(builder =>
            {
                var host = Configuration.GetValue<string>("Database:Host");
                var user = Configuration.GetValue<string>("Database:User");
                var pass = Configuration.GetValue<string>("Database:Pass");
                var database = Configuration.GetValue<string>("Database:Database");
                builder.UseMySql($"server={host};database={database};user={user};password={pass}");
            });

            // Ensure that DB is Created
            var sp = services.BuildServiceProvider();
            var dbContext = sp.GetService<ApplicationDbContext>();
            dbContext.Database.EnsureCreated();
            // dbContext.Database.Migrate();

            // using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            // {
            //     using (var context = scope.ServiceProvider.GetService<ApplicationDbContext>())
            //     {
            //         context.Database.Migrate();
            //     }
            // }


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

            app.ConfigureExceptionHandler();

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
