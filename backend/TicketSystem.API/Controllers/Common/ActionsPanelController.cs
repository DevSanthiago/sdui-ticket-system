using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Models;
using TicketSystem.API.Services;
using System.Text.Json;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/actions-panel")]
    [Authorize] 
    public class ActionsPanelController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public ActionsPanelController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.Departments
                .Where(d => d.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(d => d.IsActive);

            var panels = await query.OrderBy(d => d.Name).ToListAsync();

            var response = panels.Select(MapToResponse).ToList();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var panel = await _context.Departments
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == id && d.PlantId == currentPlantId);

            if (panel is null)
                return NotFound(new { message = "Painel de ação não encontrado nesta unidade." });

            return Ok(MapToResponse(panel));
        }

        private static DepartmentResponseDto MapToResponse(Department d)
        {
            List<string> badgesList = new();
            if (!string.IsNullOrWhiteSpace(d.Badges))
            {
                try { badgesList = JsonSerializer.Deserialize<List<string>>(d.Badges) ?? new List<string>(); }
                catch { }
            }

            List<string> rolesList = new();
            if (!string.IsNullOrWhiteSpace(d.AllowedRoles))
            {
                try { rolesList = JsonSerializer.Deserialize<List<string>>(d.AllowedRoles) ?? new List<string>(); }
                catch { }
            }

            JsonElement formSchemaElement;
            try
            {
                formSchemaElement = string.IsNullOrWhiteSpace(d.FormSchema)
                    ? JsonDocument.Parse("{}").RootElement
                    : JsonDocument.Parse(d.FormSchema).RootElement;
            }
            catch
            {
                formSchemaElement = JsonDocument.Parse("{}").RootElement;
            }

            return new DepartmentResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                CardColorHex = d.CardColorHex,
                IconName = d.IconName,
                Badges = badgesList,
                IsActive = d.IsActive,
                FormSchema = formSchemaElement,
                AllowedRoles = rolesList
            };
        }
    }
}