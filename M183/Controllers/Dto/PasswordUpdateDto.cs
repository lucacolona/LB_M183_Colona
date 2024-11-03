namespace M183.Controllers.Dto
{
    public class PasswordUpdateDto
    {
        public int UserId { get; set; }
        public string NewPassword { get; set; }
        public bool IsAdmin { get; set; }
    }
}
