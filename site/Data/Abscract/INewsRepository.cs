using System.Linq;
using site.Domain;

namespace site.Data.Abscract
{
    public interface INewsRepository
    {
        IQueryable<News> GetAll();
    }
}
