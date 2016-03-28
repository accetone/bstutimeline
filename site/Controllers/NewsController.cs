using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNet.Mvc;
using site.Data.Abscract;
using site.Dto;

namespace site.Controllers
{
    [Route("api/[controller]/[action]")]
    public class NewsController : Controller
    {
        private IFeedNewsService FeedService { get; }
        private IUpcomingNewsService UpcomingService { get; }
        private IImageService ImageService { get; }

        public NewsController(IFeedNewsService feedService, IUpcomingNewsService upcomingService, IImageService imageService)
        {
            FeedService = feedService;
            UpcomingService = upcomingService;
            ImageService = imageService;
        }

        [HttpGet]
        public IEnumerable<NewsDto> Feed(int skip, int take)
        {
            if (take == 0 || take > 50) take = 10;

            return FeedService
                .ReadChunk(skip, take)
                .Select(x => new NewsDto(x, ImageService))
                .ToList();
        }
        
        [HttpGet]
        public IEnumerable<NewsDto> Upcoming(int skip, int take)
        {
            if (take == 0 || take > 50) take = 10;

            return UpcomingService
                .ReadChunk(skip, take)
                .Select(x => new NewsDto(x, ImageService))
                .ToList();
        }
    }
}
