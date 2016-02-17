using System.Net.Http;
using site.Data.Abscract;
using site.Domain;

namespace site.Data
{
    public class HttpImageService : IImageService
    {
        public string GetThumbUrl(News news)
        {
            var url = $"https://www.belstu.by/usdata/news/{news.GroupId}/previewbig.jpg";

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
