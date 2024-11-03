using Google.Authenticator;
using M183.Controllers.Dto;
using M183.Data;
using M183.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace M183.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NewsAppContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public AuthController(NewsAppContext context, IConfiguration configuration, IUserService userService)
        {
            _context = context;
            _configuration = configuration;
            _userService = userService;
        }

        /// <summary>
        /// Enable 2FA for user using password and username
        /// </summary>
        /// <response code="200">Login successfull</response>
        /// <response code="400">Bad request</response>
        /// <response code="401">Login failed</response>
        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public ActionResult<Auth2FADto> Enable2FA()
        {
            var user = _context.Users.Find(_userService.GetUserId());
            if (user == null)
            {
                return NotFound(string.Format("User {0} not found", _userService.GetUsername()));
            }
            {
                var secretKey = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 10);
                string userUniqueKey = user.Username + secretKey;
                string issuer = _configuration.GetSection("Jwt:Issuer").Value!;
                TwoFactorAuthenticator authenticator = new TwoFactorAuthenticator();
                SetupCode setupInfo = authenticator.GenerateSetupCode(issuer, user.Username, userUniqueKey, false, 3);

                user.SecretKey2FA = secretKey;
                _context.Update(user);
                _context.SaveChanges();

                Auth2FADto auth2FADto = new Auth2FADto();
                auth2FADto.QrCodeSetupImageUrl = setupInfo.QrCodeSetupImageUrl;

                return Ok(auth2FADto);
            }
        }
    }
}
