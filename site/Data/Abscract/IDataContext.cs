using Microsoft.Data.Entity;
using site.Domain;

namespace site.Data.Abscract
{
    public interface IDataContext
    {
        DbSet<News> News { get; set; }
    }
}
