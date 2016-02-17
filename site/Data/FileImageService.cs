using System.IO;
using Microsoft.Extensions.OptionsModel;
using site.Data.Abscract;
using site.Domain;
using site.Options;

namespace site.Data
{
    public class FileImageService : IImageService
    {
        private FileSystem FsOptions { get; }

        public FileImageService(IOptions<FileSystem> options)
        {
            FsOptions = options.Value;
        }

        public string GetThumbUrl(News news)
        {
            var url = $"https://www.belstu.by/usdata/news/{news.GroupId}/{FsOptions.ThumbsFilename}";
            var filename = $"{FsOptions.ThumbsPath}\\{news.GroupId}\\{FsOptions.ThumbsFilename}";

            return File.Exists(filename) ? url : "";
        }
    }
}
