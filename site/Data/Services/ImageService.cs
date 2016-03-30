using site.Data.Abscract;
using site.Domain;

namespace site.Data.Services
{
    public class ImageService : IImageService
    {
        private IImageRepository Repository { get; set; }
        private IImageCache Cache { get; set; }

        public ImageService(IImageRepository repository, IImageCache cache)
        {
            Repository = repository;
            Cache = cache;
        }

        public string GetThumbUrl(News news)
        {
            var url = Cache.GetThumbUrl(news);

            if (url == null)
            {
                url = Repository.GetThumbUrl(news);
                Cache.SetThumbUrl(news, url);
            }

            return url;
        }

        public string GetThumbUrl(News news, bool suspendCache)
        {
            return suspendCache
                ? Repository.GetThumbUrl(news)
                : GetThumbUrl(news);
        }
    }
}
