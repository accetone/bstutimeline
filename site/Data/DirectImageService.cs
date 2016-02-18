using Microsoft.Extensions.OptionsModel;
using site.Data.Abscract;
using site.Domain;
using site.Options;

namespace site.Data
{
    public class DirectImageService : IImageService
    {
        private FileSystem FsOptions { get; }

        public DirectImageService(IOptions<FileSystem> options)
        {
            FsOptions = options.Value;
        }

        public string GetThumbUrl(News news)
        {
            return $"https://www.belstu.by/usdata/news/{news.GroupId}/{FsOptions.ThumbsFilename}";
        }
    }
}
