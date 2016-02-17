using site.Domain;

namespace site.Data.Abscract
{
    public interface IImageService
    {
        string GetThumbUrl(News news);
    }
}
