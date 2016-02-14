using System.Linq;
using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class NewsRepository : INewsRepository
    {
        private IDataContext Db { get; }

        public NewsRepository(IDataContext db)
        {
            Db = db;
        }

        public IQueryable<News> GetAll()
        {
            return Db.News;
        } 
    }
}
