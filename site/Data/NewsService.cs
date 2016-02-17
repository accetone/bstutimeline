using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.Entity;
using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class NewsService : INewsService
    {
        private INewsRepository NewsRepository { get; }

        public NewsService(INewsRepository newsRepository)
        {
            NewsRepository = newsRepository;
        }

        public IEnumerable<News> ReadChunk(int skip, int take)
        {
            return NewsRepository
                .GetAll()

                .Include(x => x.ShowplaceCategory)
                .Include(x => x.ShowplaceCategory.Showplace)

                .OrderByDescending(x => x.Id)

                .GroupBy(x => x.GroupId)
                .Skip(skip)
                .Take(take)
                .ToList()

                .Select(x => x.OrderBy(y => y.ShowplaceCategory.Showplace.Priority).First());
        }
    }
}
