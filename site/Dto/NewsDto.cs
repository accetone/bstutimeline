using site.Data.Abscract;
using site.Domain;

namespace site.Dto
{
    public class NewsDto
    {
        public int Id;
        public string Title;
        public string Place;
        public string Date;
        public string Thumb;
        public int Views;
        public string Url;

        public NewsDto(News news, IImageService imageService)
        {
            Id = news.Id;
            Title = news.Title;
            Place = news.ShowplaceCategory.Showplace.Name;
            Date = news.EndDate == null 
                ? news.StartDate.ToString("dd.MM.yy")
                : $"{news.StartDate.ToString("dd.MM.yy")} - {news.EndDate.Value.ToString("dd.MM.yy")}";
            Thumb = imageService.GetThumbUrl(news);
            Views = news.Views;
            Url = $"https://{news.ShowplaceCategory.Showplace.Host}{news.Ref}";
        }
    }
}
