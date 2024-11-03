using System.ComponentModel.DataAnnotations;
using M183.Controllers.Helper;

namespace M183.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public UserRole UserRole { get; set; }
        public string? SecretKey2FA { get; set; }
        public int FailedLoginsCount { get; set; }

    }
}
