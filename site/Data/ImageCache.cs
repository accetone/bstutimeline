using System.Collections.Generic;
using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class ImageCache : IImageCache
    {
        private Dictionary<int, string> ThumbUrls { get; }

        public ImageCache()
        {
            ThumbUrls = new Dictionary<int, string>();
        }

        public string GetThumbUrl(News news)
        {
            return ThumbUrls.ContainsKey(news.Id) 
                ? ThumbUrls[news.Id]
                : null;
        }

        public void SetThumbUrl(News news, string url)
        {
            ThumbUrls[news.Id] = url;
        }
    }
}
