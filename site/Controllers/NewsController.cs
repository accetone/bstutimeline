﻿using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNet.Mvc;
using site.Data.Abscract;
using site.Dto;

namespace site.Controllers
{
    [Route("api/[controller]/[action]")]
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
        public IEnumerable<NewsDto> Feed(int skip, int take)
        {
            if (take == 0 || take > 50) take = 10;

            return NewsService
                .ReadChunk(skip, take)
                .Select(x => new NewsDto(x, ImageService))
                .ToList();
        }
        
        [HttpGet]
        public IEnumerable<NewsDto> Actual()
        {
            return NewsService
                .ReadActual()
                .Select(x => new NewsDto(x, ImageService))
                .ToList();
        }
    }
}
