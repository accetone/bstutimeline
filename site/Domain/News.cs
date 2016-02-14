using System;

namespace site.Domain
{
    public class News
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Ref { get; set; }
        public int ShowplaceCategoryId { get; set; }
        public bool IsModerated { get; set; }
        public Guid GroupId { get; set; }
        public int Views { get; set; }
        
        public virtual ShowplaceCategory ShowplaceCategory { get; set; }
    }
}
