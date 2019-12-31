using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Org.ERM.WebApi.Tests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Org.ERM.WebApi.Tests.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static void ConfigureInMemoryDB(this IServiceCollection services)
        {
            // Remove the app's DatabaseContext registration.
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add DatabaseContext using an in-memory database for testing.
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase("org-erm");
                options.EnableSensitiveDataLogging(true);
            });

            // Build the service provider.
            var sp = services.BuildServiceProvider();

            // Create a scope to obtain a reference to the database
            // context (DatabaseContext).
            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                var logger = scopedServices
                    .GetRequiredService<ILogger<BaseTest>>();

                // Ensure the database is created.
                db.Database.EnsureCreated();

                try
                {
                    // Seed the database with test data.
                    DBUtilities.InitializeDbForTests(db);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred seeding the " +
                        "database with test messages. Error: {Message}", ex.Message);
                }
            }
        }
    }
}
