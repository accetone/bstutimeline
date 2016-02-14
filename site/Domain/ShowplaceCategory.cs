namespace site.Domain
{
    public class ShowplaceCategory
    {
        public int Id { get; set; }
        public int ShowplaceId { get; set; }

        public virtual Showplace Showplace { get; set; }
    }
}
