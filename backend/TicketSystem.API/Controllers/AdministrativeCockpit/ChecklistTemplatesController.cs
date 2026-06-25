using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Models;
using TicketSystem.API.Domain.Exceptions;
using TicketSystem.API.Services;
using System.Text.Json;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/checklist-templates")]
    public class ChecklistTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public ChecklistTemplatesController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.ChecklistTemplates
                .Where(c => c.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(c => c.IsActive);

            var templates = await query.OrderBy(c => c.Name).ToListAsync();

            var response = templates.Select(MapToResponse).ToList();
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var template = await _context.ChecklistTemplates
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id && c.PlantId == currentPlantId);

            if (template is null)
                return NotFound(new { message = "Checklist não encontrado nesta unidade." });

            return Ok(MapToResponse(template));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> CreateChecklistTemplate(CreateChecklistTemplateDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0)
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var isDuplicate = await _context.ChecklistTemplates
                    .AnyAsync(c => c.PlantId == currentPlantId && c.Name == dto.Name.Trim());

                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe um checklist com o nome '{dto.Name}' nesta unidade." });

                var schemaString = JsonSerializer.Serialize(dto.Schema);
                var allowedRolesString = JsonSerializer.Serialize(dto.AllowedRoles ?? new List<string>());

                var template = new ChecklistTemplate(
                    plantId: currentPlantId,
                    name: dto.Name.Trim(),
                    description: dto.Description?.Trim(),
                    cardColorHex: dto.CardColorHex?.Trim(),
                    iconName: dto.IconName.Trim(),
                    schema: schemaString,
                    allowedRoles: allowedRolesString,
                    departmentId: dto.DepartmentId,
                    triggerFieldId: dto.TriggerFieldId?.Trim(),
                    triggerFieldValue: dto.TriggerFieldValue?.Trim()
                );

                _context.ChecklistTemplates.Add(template);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = template.Id }, MapToResponse(template));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> UpdateChecklistTemplate(int id, UpdateChecklistTemplateDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();

                var template = await _context.ChecklistTemplates
                    .FirstOrDefaultAsync(c => c.Id == id && c.PlantId == currentPlantId);

                if (template is null) return NotFound(new { message = "Checklist não encontrado nesta unidade." });

                var isDuplicate = await _context.ChecklistTemplates
                    .AnyAsync(c => c.PlantId == currentPlantId && c.Name == dto.Name.Trim() && c.Id != id);

                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe outro checklist com o nome '{dto.Name}' nesta unidade." });

                var schemaString = JsonSerializer.Serialize(dto.Schema);

                template.Update(
                    name: dto.Name.Trim(),
                    description: dto.Description?.Trim(),
                    cardColorHex: dto.CardColorHex?.Trim(),
                    iconName: dto.IconName.Trim(),
                    isActive: dto.IsActive
                );

                template.UpdateSchema(schemaString);

                var allowedRolesString = JsonSerializer.Serialize(dto.AllowedRoles ?? new List<string>());
                template.UpdateAllowedRoles(allowedRolesString);

                template.UpdateTrigger(dto.DepartmentId, dto.TriggerFieldId?.Trim(), dto.TriggerFieldValue?.Trim());

                await _context.SaveChangesAsync();

                return Ok(MapToResponse(template));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> ToggleChecklistStatus(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var template = await _context.ChecklistTemplates
                .FirstOrDefaultAsync(c => c.Id == id && c.PlantId == currentPlantId);

            if (template is null) return NotFound(new { message = "Checklist não encontrado nesta unidade." });

            template.ToggleStatus();
            await _context.SaveChangesAsync();

            var statusStr = template.IsActive ? "ativado" : "desativado";
            return Ok(new { message = $"Checklist {statusStr} com sucesso.", isActive = template.IsActive });
        }

        private static ChecklistTemplateResponseDto MapToResponse(ChecklistTemplate c)
        {
            List<string> rolesList = new();
            if (!string.IsNullOrWhiteSpace(c.AllowedRoles))
            {
                try { rolesList = JsonSerializer.Deserialize<List<string>>(c.AllowedRoles) ?? new List<string>(); }
                catch { }
            }

            JsonElement schemaElement;
            try
            {
                schemaElement = string.IsNullOrWhiteSpace(c.Schema)
                    ? JsonDocument.Parse("{}").RootElement
                    : JsonDocument.Parse(c.Schema).RootElement;
            }
            catch
            {
                schemaElement = JsonDocument.Parse("{}").RootElement;
            }

            return new ChecklistTemplateResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CardColorHex = c.CardColorHex,
                IconName = c.IconName,
                IsActive = c.IsActive,
                Schema = schemaElement,
                AllowedRoles = rolesList,
                DepartmentId = c.DepartmentId,
                TriggerFieldId = c.TriggerFieldId,
                TriggerFieldValue = c.TriggerFieldValue,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            };
        }
    }
}
