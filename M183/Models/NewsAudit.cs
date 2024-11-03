using System.ComponentModel.DataAnnotations;

namespace M183.Models
{
    public class NewsAudit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int NewsId { get; set; }

        [Required]
        public string Action { get; set; }

        [Required]
        public int AuthorId { get; set; }
    }
}