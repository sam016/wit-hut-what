using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Org.ERM.WebApi.Models.Domain;
using System.Threading.Tasks;

namespace Org.ERM.WebApi.Persistence.Repositories
{
    public interface IBaseRepository<T> where T : BaseModel
    {
        // public abstract BuildModel(ModelBuilder modelBuilder);
        Task CreateAsync(T entity);
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetByIdsAsync(IEnumerable<int> ids);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(Func<T, bool> q);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

    public abstract class BaseRepository<T> : IBaseRepository<T> where T : BaseModel, new()
    {
        protected readonly DbSet<T> DBSet;
        protected readonly DatabaseContext DBContext;

        public BaseRepository(DatabaseContext dbContext, DbSet<T> dbSet)
        {
            DBSet = dbSet;
            DBContext = dbContext;
        }

        public async Task CreateAsync(T entity)
        {
            await DBSet.AddAsync(entity);
            await DBContext.SaveChangesAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await DBSet.FindAsync(id);
        }

        public Task<IEnumerable<T>> GetByIdsAsync(IEnumerable<int> ids)
        {
            // TODO: make me async
            return Task.FromResult(DBSet.Where(item => ids.Contains(item.Id)).AsEnumerable<T>());
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await DBSet.ToListAsync();
        }

        public Task<IEnumerable<T>> GetAllAsync(Func<T, bool> q)
        {
            // TODO: find the async way to do it
            return Task.FromResult(DBSet.Where(q));
        }

        public async Task UpdateAsync(T entity)
        {
            DBContext.Entry(await DBSet.FirstOrDefaultAsync(x => x.Id == entity.Id)).CurrentValues.SetValues(entity);
            await DBContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            DBSet.Remove(entity);
            await DBContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            DBSet.Remove(new T() { Id = id });
            await DBContext.SaveChangesAsync();
        }

        public Task<bool> ExistsAsync(int id)
        {
            // TODO: make me async
            return Task.FromResult(DBSet.Where(e => e.Id == id).Count() > 0);
        }
    }
}
