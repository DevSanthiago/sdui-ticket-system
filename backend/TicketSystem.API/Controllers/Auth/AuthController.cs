using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TicketSystem.API.Authorization;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ExternalAuthService _externalAuthService;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(ExternalAuthService externalAuthService, IConfiguration configuration, AppDbContext context)
        {
            _externalAuthService = externalAuthService;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (request.Registration <= 0)
                return BadRequest(new { message = "Matrícula inválida." });

            try
            {
                var externalLogin = await _externalAuthService.LoginAsync(request.Registration, request.Password);

                if (string.IsNullOrWhiteSpace(externalLogin?.Token))
                    return Unauthorized(new { message = "Falha ao obter token no serviço externo." });

                var user = await _externalAuthService.GetUserByRegistrationAsync(request.Registration, externalLogin.Token);

                if (user is null)
                    return Unauthorized(new { message = "Usuário não encontrado na base externa." });

                var roles = await _externalAuthService.GetUserRolesAsync(user.Id, externalLogin.Token);
                
                var roleDetails = roles?
                    .Where(r => !string.IsNullOrWhiteSpace(r.Name))
                    .Select(r => new UserRoleResponseDto(r.Name!, r.Description ?? r.Name!))
                    .ToList() ?? new List<UserRoleResponseDto>();

                var roleNames = roleDetails.Select(r => r.Name).ToList();

                var selectedPlantId = await _context.Plants
                    .Where(p => p.IsActive && p.Id == request.PlantId)
                    .Select(p => (int?)p.Id)
                    .FirstOrDefaultAsync();

                selectedPlantId ??= await _context.Plants
                    .Where(p => p.IsActive)
                    .OrderBy(p => p.Name)
                    .Select(p => (int?)p.Id)
                    .FirstOrDefaultAsync();

                var token = GenerateJwtToken(user, roleNames, selectedPlantId);

                return Ok(new
                {
                    token,
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.Registration,
                        user.Department,
                        roles = roleDetails,
                        canManageTickets = TicketAccessPolicy.CanManage(roleNames)
                    }
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Matrícula ou senha inválidos." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao processar autenticação.", details = ex.Message });
            }
        }

        [HttpGet("validate")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Token inválido ou expirado." });

            var canManageTickets = TicketAccessPolicy.CanManage(
                User.FindAll(ClaimTypes.Role).Select(c => c.Value));

            return Ok(new { message = "Token válido", userId, canManageTickets });
        }

        [HttpPost("kiosk")]
        public async Task<IActionResult> KioskLogin([FromBody] KioskLoginDto dto)
        {
            var configuredKey = _configuration["Kiosk:ApiKey"];
            if (string.IsNullOrWhiteSpace(configuredKey) || dto.DeviceKey != configuredKey)
                return Unauthorized(new { message = "Chave de dispositivo inválida." });

            var plant = await _context.Plants
                .FirstOrDefaultAsync(p => p.IsActive && p.Id == dto.PlantId);

            if (plant is null)
                return BadRequest(new { message = "Planta inválida ou inativa." });

            var token = GenerateKioskToken(plant.Id, dto.DisplayName);

            return Ok(new
            {
                token,
                plantId = plant.Id,
                plantName = plant.Name,
                displayName = string.IsNullOrWhiteSpace(dto.DisplayName) ? "Kiosk Display" : dto.DisplayName
            });
        }

        private string GenerateKioskToken(int plantId, string? displayName)
        {
            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("A chave JWT não está configurada.");
            var key = Encoding.UTF8.GetBytes(keyString);

            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expireHours = int.TryParse(_configuration["Kiosk:ExpireHours"], out var parsedHours) ? parsedHours : 8760;

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, "0"),
                new(ClaimTypes.Name, string.IsNullOrWhiteSpace(displayName) ? "Kiosk Display" : displayName),
                new(ClaimTypes.Role, "kiosk-display"),
                new("PlantId", plantId.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddHours(expireHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateJwtToken(ExternalUserSummaryDto user, List<string> roles, int? plantId)
        {
            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("A chave JWT não está configurada.");
            var key = Encoding.UTF8.GetBytes(keyString);
            
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expireHours = int.TryParse(_configuration["Jwt:ExpireHours"], out var parsedHours) ? parsedHours : 8;

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name ?? string.Empty),
                new("Registration", user.Registration.ToString()),
                new("Department", user.Department ?? string.Empty),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (plantId.HasValue)
                claims.Add(new Claim("PlantId", plantId.Value.ToString()));

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddHours(expireHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}