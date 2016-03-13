using site.Domain;

namespace site.Data.Abscract
{
    public interface IImageCache
    {
        string GetThumbUrl(News news);
        void SetThumbUrl(News news, string url);
    }
}
