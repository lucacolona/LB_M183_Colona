using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace M183.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public UserService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public int GetUserId()
        {
            return Convert.ToInt32(ReadUserClaim(ClaimTypes.NameIdentifier));
        }

        public string GetUsername()
        {
            return ReadUserClaim(ClaimTypes.Name);
        }

        public bool IsAdmin()
        {
            return ReadUserClaim(ClaimTypes.Role) == "admin";
        }

        private string ReadUserClaim(string claim)
        {
            if (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.User != null)
            {
                string? claimValue = _contextAccessor.HttpContext.User.FindFirstValue(claim);
                if (claimValue != null)
                {
                    return claimValue;
                }
            }
            throw new InvalidOperationException("User is not logged in");
        }
    }
}