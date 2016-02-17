using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class DirectImageService : IImageService
    {
        public string GetThumbUrl(News news)
        {
            return $"https://www.belstu.by/usdata/news/{news.GroupId}/previewbig.jpg";
        }
    }
}
