using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNet.Mvc;
using site.Data.Abscract;
using site.Dto;

namespace site.Controllers
{
    [Route("api/[controller]")]
    public class NewsController : Controller
    {
        private INewsService NewsService { get; }
        private IImageService ImageService { get; }

        public NewsController(INewsService newsService, IImageService imageService)
        {
            NewsService = newsService;
            ImageService = imageService;
        }

        [HttpGet]
        public IEnumerable<NewsDto> Get(int skip, int take)
        {
            if (take == 0) take = 10;

            return NewsService
                .ReadChunk(skip, take)
                .Select(x => new NewsDto(x, ImageService))
                .ToList();
        }
    }
}
