using site.Domain;

namespace site.Data.Abscract
{
    public interface IImageRepository
    {
        string GetThumbUrl(News news);
    }
}
