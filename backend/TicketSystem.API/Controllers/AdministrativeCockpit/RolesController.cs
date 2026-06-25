using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.API.Services;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly ExternalAuthService _externalAuthService;

        public RolesController(ExternalAuthService externalAuthService)
        {
            _externalAuthService = externalAuthService;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRoles()
        {
            try
            {
                var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");

                if (string.IsNullOrWhiteSpace(token))
                    return Unauthorized(new { message = "Token de autenticação não encontrado." });

                var roles = await _externalAuthService.GetAllRolesAsync(token);

                var excludedRoles = new[] { "admin" };

                var response = roles
                    .Where(r => !string.IsNullOrWhiteSpace(r.Name) && 
                                !excludedRoles.Contains(r.Name.ToLower()))
                    .Select(r => new 
                    {
                        label = r.Name, 
                        value = r.Name!.ToLower()
                    }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Houve um erro interno ao buscar as roles disponíveis.", details = ex.Message });
            }
        }
    }
}