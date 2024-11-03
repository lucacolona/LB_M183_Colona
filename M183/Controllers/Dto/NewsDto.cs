namespace M183.Controllers.Dto
{
    public class NewsDto
    {
        public string Header { get; set; }
        public string Detail { get; set; }
        public int AuthorId { get; set; }
        public bool IsAdminNews { get; set; }
    }
}
