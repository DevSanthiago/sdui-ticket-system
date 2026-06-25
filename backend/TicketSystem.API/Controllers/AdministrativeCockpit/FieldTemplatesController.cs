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
    [Route("api/field-templates")]
    public class FieldTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public FieldTemplatesController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            int currentPlantId = _userContext.GetPlantId();

            var templates = await _context.FieldTemplates
                .Where(t => t.PlantId == currentPlantId)
                .AsNoTracking()
                .OrderBy(t => t.Name)
                .ToListAsync();

            var response = templates.Select(MapToResponse).ToList();
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var template = await _context.FieldTemplates
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId);

            if (template is null)
                return NotFound(new { message = "Tipo de campo não encontrado nesta unidade." });

            return Ok(MapToResponse(template));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> CreateFieldTemplate(CreateFieldTemplateDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0)
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var isDuplicate = await _context.FieldTemplates
                    .AnyAsync(t => t.PlantId == currentPlantId && t.Name == dto.Name.Trim());

                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe um tipo de campo com o nome '{dto.Name}' nesta unidade." });

                var schemaString = JsonSerializer.Serialize(dto.Schema);

                var template = new FieldTemplate(
                    plantId: currentPlantId,
                    name: dto.Name.Trim(),
                    schema: schemaString
                );

                _context.FieldTemplates.Add(template);
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
        public async Task<IActionResult> UpdateFieldTemplate(int id, UpdateFieldTemplateDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();

                var template = await _context.FieldTemplates
                    .FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId);

                if (template is null)
                    return NotFound(new { message = "Tipo de campo não encontrado nesta unidade." });

                var isDuplicate = await _context.FieldTemplates
                    .AnyAsync(t => t.PlantId == currentPlantId && t.Name == dto.Name.Trim() && t.Id != id);

                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe outro tipo de campo com o nome '{dto.Name}' nesta unidade." });

                template.UpdateName(dto.Name.Trim());
                template.UpdateSchema(JsonSerializer.Serialize(dto.Schema));

                await _context.SaveChangesAsync();

                return Ok(MapToResponse(template));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> DeleteFieldTemplate(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var template = await _context.FieldTemplates
                .FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId);

            if (template is null)
                return NotFound(new { message = "Tipo de campo não encontrado nesta unidade." });

            _context.FieldTemplates.Remove(template);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tipo de campo excluído com sucesso." });
        }

        private static FieldTemplateResponseDto MapToResponse(FieldTemplate t)
        {
            JsonElement schemaElement;
            try
            {
                schemaElement = string.IsNullOrWhiteSpace(t.Schema)
                    ? JsonDocument.Parse("{}").RootElement
                    : JsonDocument.Parse(t.Schema).RootElement;
            }
            catch
            {
                schemaElement = JsonDocument.Parse("{}").RootElement;
            }

            return new FieldTemplateResponseDto
            {
                Id = t.Id,
                Name = t.Name,
                Schema = schemaElement,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt
            };
        }
    }
}
