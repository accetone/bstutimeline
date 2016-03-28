using System;
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
            var date = DateTime.Now.Date.AddDays(1);

            return NewsRepository
                .GetAll()

                .Include(x => x.ShowplaceCategory)
                .Include(x => x.ShowplaceCategory.Showplace)

                .Where(x => x.IsModerated)
                .Where(x => x.StartDate < date)
                .OrderByDescending(x => x.StartDate)

                .GroupBy(x => x.GroupId)
                .Skip(skip)
                .Take(take)
                .ToList()

                .Select(x => x.OrderBy(y => y.ShowplaceCategory.Showplace.Priority).First());
        }

        public IEnumerable<News> ReadActual()
        {
            var start = DateTime.Now.Date.AddDays(-2);
            var end = DateTime.Now.Date.AddDays(+3);

            return NewsRepository
                .GetAll()

                .Include(x => x.ShowplaceCategory)
                .Include(x => x.ShowplaceCategory.Showplace)

                .Where(x => x.StartDate >= start && x.StartDate < end)
                .OrderByDescending(x => x.StartDate)

                .GroupBy(x => x.GroupId)
                .ToList()

                .Select(x => x.OrderBy(y => y.ShowplaceCategory.Showplace.Priority).First());
        } 
    }
}
