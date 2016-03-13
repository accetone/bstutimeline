using site.Domain;

namespace site.Data.Abscract
{
    public interface IImageService
    {
        string GetThumbUrl(News news);
        string GetThumbUrl(News news, bool suspendCache);
    }
}
