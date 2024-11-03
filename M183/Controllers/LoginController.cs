using Google.Authenticator;
using M183.Controllers.Dto;
using M183.Controllers.Helper;
using M183.Data;
using M183.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace M183.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly NewsAppContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<LoginController> _logger;

        private static Dictionary<string, int> failedLoginAttempts = new Dictionary<string, int>();

        public LoginController(NewsAppContext context, IConfiguration configuration, ILogger<LoginController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Login a user using password and username
        /// </summary>
        /// <response code="200">Login successfull</response>
        /// <response code="400">Bad request</response>
        /// <response code="401">Login failed</response>
        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public ActionResult<User> Login(LoginDto request)
        {
            if (request.Username.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
            {
                AddFailedLogin("System");
                return BadRequest();
            }
            string username = request.Username;
            string passwordHash = MD5Helper.ComputeMD5Hash(request.Password);

            User? user = _context.Users
                .Where(u => u.Username == username)
                .FirstOrDefault();

            if (user == null)
            {
                AddFailedLogin(username);
                return Unauthorized("login failed");
            }

            if (user.Password != passwordHash)
            {
                AddFailedLogin(user);
                return Unauthorized("login failed");

            }

            if (user.SecretKey2FA != null)
            {
                string secretKey = user.SecretKey2FA;
                string userUniqueKey = user.Username + secretKey;
                TwoFactorAuthenticator authenticator = new TwoFactorAuthenticator();
                bool isAuthenticated = authenticator.ValidateTwoFactorPIN(userUniqueKey, request.UserKey);
                if (!isAuthenticated)
                {
                    AddFailedLogin(user);
                    return Unauthorized("login failed");
                }

                _context.Update(user);
                _context.SaveChanges();
            }

            return Ok(CreateToken(user));
        }

        private void AddFailedLogin(User user)
        {
            user.FailedLoginsCount += 1;

            if (user.FailedLoginsCount >= 10)
            {
                _logger.LogCritical($"[{DateTime.Now}] Unauthorized: User {user.Username} login failed {user.FailedLoginsCount} times");
                user.FailedLoginsCount = 0;
            }
            else
            {
                _logger.LogWarning($"[{DateTime.Now}] Unauthorized: User {user.Username} login failed");
            }
            _context.Update(user);
            _context.SaveChanges();
        }

        private void AddFailedLogin(string username)
        {
            _logger.LogWarning($"[{DateTime.Now}] Unauthorized: User {username} login failed");
        }

        private string CreateToken(User user)
        {
            string issuer = _configuration.GetSection("Jwt:Issuer").Value!;
            string audience = _configuration.GetSection("Jwt:Audience").Value!;

            List<Claim> claims = new List<Claim> {
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                    new(JwtRegisteredClaimNames.UniqueName, user.Username),
                    new(ClaimTypes.Role,  nameof(user.UserRole).ToLower())
            };

            string base64Key = _configuration.GetSection("Jwt:Key").Value!;
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Convert.FromBase64String(base64Key));

            SigningCredentials credentials = new SigningCredentials(
                    securityKey,
                    SecurityAlgorithms.HmacSha512Signature);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
             );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
