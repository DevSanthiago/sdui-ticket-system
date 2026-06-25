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
    [Route("api/departments")]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public DepartmentsController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.Departments
                .Where(d => d.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(d => d.IsActive);

            var departments = await query.OrderBy(d => d.Name).ToListAsync();

            var response = departments.Select(MapToResponse).ToList();
            return Ok(response);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var dept = await _context.Departments
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == id && d.PlantId == currentPlantId);

            if (dept is null)
                return NotFound(new { message = "Departamento não encontrado nesta unidade." });

            return Ok(MapToResponse(dept));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> CreateDepartment(CreateDepartmentDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0) 
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var isDuplicate = await _context.Departments
                    .AnyAsync(d => d.PlantId == currentPlantId && d.Name == dto.Name.Trim());
                
                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe um departamento com o nome '{dto.Name}' nesta unidade." });

                var schemaString = JsonSerializer.Serialize(dto.FormSchema);
                var badgesString = JsonSerializer.Serialize(dto.Badges ?? new List<string>());
                
                var allowedRolesString = JsonSerializer.Serialize(dto.AllowedRoles ?? new List<string>());

                var department = new Department(
                    plantId: currentPlantId,
                    name: dto.Name.Trim(), 
                    description: dto.Description?.Trim(), 
                    cardColorHex: dto.CardColorHex?.Trim(), 
                    badges: badgesString, 
                    iconName: dto.IconName.Trim(), 
                    formSchema: schemaString,
                    allowedRoles: allowedRolesString
                );

                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = department.Id }, MapToResponse(department));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> UpdateDepartment(int id, UpdateDepartmentDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();

                var department = await _context.Departments
                    .FirstOrDefaultAsync(d => d.Id == id && d.PlantId == currentPlantId);

                if (department is null) return NotFound(new { message = "Departamento não encontrado nesta unidade." });

                var isDuplicate = await _context.Departments
                    .AnyAsync(d => d.PlantId == currentPlantId && d.Name == dto.Name.Trim() && d.Id != id);
                
                if (isDuplicate)
                    return BadRequest(new { message = $"Já existe outro departamento com o nome '{dto.Name}' nesta unidade." });

                var badgesString = JsonSerializer.Serialize(dto.Badges ?? new List<string>());
                var schemaString = JsonSerializer.Serialize(dto.FormSchema);

                department.Update(
                    name: dto.Name.Trim(), 
                    description: dto.Description?.Trim(), 
                    cardColorHex: dto.CardColorHex?.Trim(), 
                    badges: badgesString, 
                    iconName: dto.IconName.Trim(), 
                    isActive: dto.IsActive
                );
                
                department.UpdateSchema(schemaString);

                var allowedRolesString = JsonSerializer.Serialize(dto.AllowedRoles ?? new List<string>());
                department.UpdateAllowedRoles(allowedRolesString);

                await _context.SaveChangesAsync();

                return Ok(MapToResponse(department));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> ToggleDepartmentStatus(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var department = await _context.Departments
                .FirstOrDefaultAsync(d => d.Id == id && d.PlantId == currentPlantId);

            if (department is null) return NotFound(new { message = "Departamento não encontrado nesta unidade." });

            department.ToggleStatus();
            await _context.SaveChangesAsync();

            var statusStr = department.IsActive ? "ativado" : "desativado";
            return Ok(new { message = $"Departamento {statusStr} com sucesso.", isActive = department.IsActive });
        }

        private static DepartmentResponseDto MapToResponse(Department d)
        {
            List<string> badgesList = new();
            if (!string.IsNullOrWhiteSpace(d.Badges))
            {
                try { badgesList = JsonSerializer.Deserialize<List<string>>(d.Badges) ?? new List<string>(); }
                catch {}
            }

            List<string> rolesList = new();
            if (!string.IsNullOrWhiteSpace(d.AllowedRoles))
            {
                try { rolesList = JsonSerializer.Deserialize<List<string>>(d.AllowedRoles) ?? new List<string>(); }
                catch {}
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