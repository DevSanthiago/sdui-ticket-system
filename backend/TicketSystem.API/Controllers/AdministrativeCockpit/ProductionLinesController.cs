using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Models;
using TicketSystem.API.Domain.Exceptions;
using TicketSystem.API.Services;
using System.Security.Claims;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/production-lines")]
    [Authorize]
    public class ProductionLinesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public ProductionLinesController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductionLines([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.ProductionLines
                .Where(pl => pl.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(pl => pl.IsActive);

            var response = await query
                .OrderBy(pl => pl.Prefix)
                .ThenBy(pl => pl.LineName)
                .Select(pl => new ProductionLineResponseDto
                {
                    Id = pl.Id,
                    LineName = pl.LineName,
                    Prefix = pl.Prefix,
                    Description = pl.Description,
                    IsActive = pl.IsActive,
                    CreatedAt = pl.CreatedAt,
                    UpdatedAt = pl.UpdatedAt,
                    CreatedByUserName = "Sistema",
                    UpdatedByUserName = null
                })
                .ToListAsync();

            return Ok(response);
        }

        [HttpGet("by-prefix")]
        public async Task<IActionResult> GetLinesByPrefix([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.ProductionLines
                .Where(pl => pl.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(pl => pl.IsActive);

            var lines = await query
                .OrderBy(pl => pl.Prefix)
                .ThenBy(pl => pl.LineName)
                .ToListAsync();

            var prefixesFromDb = await _context.LinePrefixes
                .Where(p => p.PlantId == currentPlantId)
                .AsNoTracking()
                .ToListAsync();

            var groupedLines = lines
                .GroupBy(l => l.Prefix)
                .Select(g => new ProductionLinesByPrefixDto
                {
                    Prefix = g.Key,
                    PrefixLabel = prefixesFromDb.FirstOrDefault(p => p.Value == g.Key)?.Label ?? g.Key,
                    Lines = g.Select(MapToResponseDto).ToList()
                })
                .OrderBy(g => g.Prefix)
                .ToList();

            return Ok(groupedLines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductionLineById(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var line = await _context.ProductionLines
                .AsNoTracking()
                .FirstOrDefaultAsync(pl => pl.Id == id && pl.PlantId == currentPlantId);

            if (line is null) return NotFound(new { message = "Linha de produção não encontrada nesta unidade." });

            return Ok(MapToResponseDto(line));
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> CreateProductionLine(CreateProductionLineDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0) 
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var currentUserId = GetCurrentUserId();

                var isDuplicate = await _context.ProductionLines
                    .AnyAsync(pl => pl.PlantId == currentPlantId && pl.LineName == dto.LineName.Trim().ToUpper());
                
                if (isDuplicate) 
                    return BadRequest(new { message = $"Já existe uma linha com o nome '{dto.LineName}' nesta unidade." });

                var line = ProductionLine.Create(currentPlantId, dto.LineName, dto.Prefix, dto.Description, currentUserId);

                _context.ProductionLines.Add(line);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductionLineById), new { id = line.Id }, MapToResponseDto(line));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> UpdateProductionLine(int id, UpdateProductionLineDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                var currentUserId = GetCurrentUserId();

                var line = await _context.ProductionLines
                    .FirstOrDefaultAsync(pl => pl.Id == id && pl.PlantId == currentPlantId);
                
                if (line is null) return NotFound(new { message = "Linha de produção não encontrada nesta unidade." });

                var isDuplicate = await _context.ProductionLines
                    .AnyAsync(pl => pl.PlantId == currentPlantId && pl.LineName == dto.LineName.Trim().ToUpper() && pl.Id != id);
                
                if (isDuplicate) 
                    return BadRequest(new { message = $"Já existe outra linha com o nome '{dto.LineName}' nesta unidade." });

                line.Update(dto.LineName, dto.Prefix, dto.Description, currentUserId);

                if (dto.IsActive != line.IsActive)
                {
                    if (dto.IsActive) line.Activate(currentUserId);
                    else line.Deactivate(currentUserId);
                }

                await _context.SaveChangesAsync();
                return Ok(MapToResponseDto(line));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/deactivate")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> DeactivateProductionLine(int id)
        {
            int currentPlantId = _userContext.GetPlantId();
            var currentUserId = GetCurrentUserId();

            var line = await _context.ProductionLines
                .FirstOrDefaultAsync(pl => pl.Id == id && pl.PlantId == currentPlantId); 
            
            if (line is null) return NotFound(new { message = "Linha de produção não encontrada nesta unidade." });

            line.Deactivate(currentUserId);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Linha de produção desativada com sucesso." });
        }

        [HttpPost("{id}/activate")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> ActivateProductionLine(int id)
        {
            int currentPlantId = _userContext.GetPlantId();
            var currentUserId = GetCurrentUserId();

            var line = await _context.ProductionLines
                .FirstOrDefaultAsync(pl => pl.Id == id && pl.PlantId == currentPlantId); 
            
            if (line is null) return NotFound(new { message = "Linha de produção não encontrada nesta unidade." });

            line.Activate(currentUserId);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Linha de produção ativada com sucesso." });
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> DeleteProductionLine(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var line = await _context.ProductionLines
                .FirstOrDefaultAsync(pl => pl.Id == id && pl.PlantId == currentPlantId); 
            
            if (line is null) return NotFound(new { message = "Linha de produção não encontrada nesta unidade." });

            var hasTickets = await _context.Tickets.AnyAsync(t => t.ProductionLineId == id && t.PlantId == currentPlantId);
            if (hasTickets)
                return BadRequest(new { message = "Não é possível excluir esta linha pois existem tickets associados a ela. Você pode desativá-la ao invés de excluir." });

            _context.ProductionLines.Remove(line);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Linha de produção excluída com sucesso." });
        }

        private int GetCurrentUserId()
        {
            if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) && id > 0)
                return id;

            throw new UnauthorizedAccessException("Usuário não autenticado ou token inválido.");
        }

        private static ProductionLineResponseDto MapToResponseDto(ProductionLine line)
        {
            return new ProductionLineResponseDto
            {
                Id = line.Id,
                LineName = line.LineName,
                Prefix = line.Prefix,
                Description = line.Description,
                IsActive = line.IsActive,
                CreatedAt = line.CreatedAt,
                UpdatedAt = line.UpdatedAt,
                CreatedByUserName = "Sistema",
                UpdatedByUserName = null
            };
        }
    }
}