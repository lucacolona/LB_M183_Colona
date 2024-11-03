using System.ComponentModel.DataAnnotations;

namespace M183.Models
{
    public class News
    {
        [Key]
        public int Id { get; set; }
        public string Header { get; set; }
        public string Detail { get; set; }
        public DateTime PostedDate { get; set; }
        public bool IsAdminNews { get; set; }

        public int AuthorId { get; set; }
        public User Author { get; set; }
    }
}
