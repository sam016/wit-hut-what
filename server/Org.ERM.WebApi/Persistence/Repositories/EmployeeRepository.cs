using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;
using System.Threading.Tasks;

namespace Org.ERM.WebApi.Persistence.Repositories
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task<Employee> GetByEmailAsync(string email);
    }

    public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(ApplicationDbContext context) : base(context, context.Employee)
        { }

        public async Task<Employee> GetByEmailAsync(string email)
        {
            var items = await DBSet.ToListAsync();
            return await DBSet.FirstOrDefaultAsync(x => x.Email == email);
        }
    }
}
