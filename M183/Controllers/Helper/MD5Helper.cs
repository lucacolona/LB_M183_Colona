using System.Runtime.ConstrainedExecution;
using System.Security.Cryptography;
using System.Text;

namespace M183.Controllers.Helper
{
    public class MD5Helper
    {
        private MD5Helper() { }

        public static string ComputeMD5Hash(string password)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] md5Bytes = MD5.Create().ComputeHash(passwordBytes);
            return BitConverter.ToString(md5Bytes).Replace("-", "");
        }
    }
}
