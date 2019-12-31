using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;

namespace Org.ERM.WebApi.Persistence.Repositories
{
    public interface IOrganizationRepository : IBaseRepository<Organization> { }

    public class OrganizationRepository : BaseRepository<Organization>, IOrganizationRepository
    {
        public OrganizationRepository(ApplicationDbContext context) : base(context, context.Organization)
        { }
    }
}
