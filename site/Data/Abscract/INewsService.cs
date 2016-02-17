using System.Collections.Generic;
using site.Domain;

namespace site.Data.Abscract
{
    public interface INewsService
    {
        IEnumerable<News> ReadChunk(int skip, int take);
    }
}
