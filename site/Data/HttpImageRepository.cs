using System.Net.Http;
using Microsoft.Extensions.OptionsModel;
using site.Data.Abscract;
using site.Domain;
using site.Options;

namespace site.Data
{
    public class HttpImageRepository : IImageRepository
    {
        private FileSystem FsOptions { get; }

        public HttpImageRepository(IOptions<FileSystem> options)
        {
            FsOptions = options.Value;
        }

        public string GetThumbUrl(News news)
        {
            var url = $"https://www.belstu.by/usdata/news/{news.GroupId}/{FsOptions.ThumbsFilename}";

            var client = new HttpClient();
            var requestMessage = new HttpRequestMessage(HttpMethod.Get, url);
            var response = client.SendAsync(requestMessage);
            var result = response.Result.Content.ReadAsStringAsync().Result;

            response.Result.Dispose();
            requestMessage.Dispose();
            client.Dispose();

            return result.Contains("404 | БГТУ") ? "" : url;
        }
    }
}
