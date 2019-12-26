using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Org.ERM.WebApi.Extensions;
using Org.ERM.WebApi.Persistence.Repositories;
using Org.ERM.WebApi.Services;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;

namespace Org.ERM.WebApi.Extensions
{
    public static class IServiceCollectionExtension
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddTransient<IEmployeeRepository, EmployeeRepository>();
            services.AddTransient<IOrganizationRepository, OrganizationRepository>();
            services.AddTransient<IPerformanceReviewRepository, PerformanceReviewRepository>();
            services.AddTransient<IPerformanceReviewFeedbackRepository, PerformanceReviewFeedbackRepository>();
        }

        public static void AddAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = Encoding.ASCII.GetBytes(configuration.GetValue<string>("Auth:Secret"));

            services.AddTransient<IAuthenticationService, AuthenticationService>();

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
        }

        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Org.ERM API",
                    Version = "v1"
                });
                var securityScheme = new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "bearer",
                };

                c.AddSecurityDefinition("Bearer", securityScheme);

                // Add security requirements globally.  If needs to be unique per operation then use IOperationFilter.
                var securityRequirement = new OpenApiSecurityRequirement();
                securityRequirement.Add(securityScheme, new string[] { });
                c.AddSecurityRequirement(securityRequirement);
            });
        }
    }
}
