using Microsoft.Extensions.OptionsModel;
using site.Data.Abscract;
using site.Domain;
using site.Options;

namespace site.Data.Repositories
{
    public class DirectImageRepository : IImageRepository
    {
        private FileSystem FsOptions { get; }

        public DirectImageRepository(IOptions<FileSystem> options)
        {
            FsOptions = options.Value;
        }

        public string GetThumbUrl(News news)
        {
            return $"https://www.belstu.by/usdata/news/{news.GroupId}/{FsOptions.ThumbsFilename}";
        }
    }
}
