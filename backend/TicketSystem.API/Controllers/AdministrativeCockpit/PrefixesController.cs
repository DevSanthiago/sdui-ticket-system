using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Models;
using TicketSystem.API.Domain.Exceptions;
using TicketSystem.API.Services;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/prefixes")]
    [Authorize]
    public class PrefixesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public PrefixesController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetPrefixes([FromQuery] bool includeInactive = false)
        {
            int currentPlantId = _userContext.GetPlantId();

            var query = _context.LinePrefixes
                .Where(p => p.PlantId == currentPlantId)
                .AsNoTracking();

            if (!includeInactive)
                query = query.Where(p => p.IsActive);

            var response = await query
                .OrderBy(p => p.Label)
                .Select(p => new LinePrefixResponseDto
                {
                    Id = p.Id,
                    Value = p.Value,
                    Label = p.Label,
                    IsActive = p.IsActive
                })
                .ToListAsync();

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> CreatePrefix(CreateLinePrefixDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0) 
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var isDuplicate = await _context.LinePrefixes
                    .AnyAsync(p => p.PlantId == currentPlantId && p.Value == dto.Value.Trim().ToUpper());
                
                if (isDuplicate) 
                    return BadRequest(new { message = "Este prefixo já está cadastrado nesta unidade." });

                var prefix = LinePrefix.Create(currentPlantId, dto.Value, dto.Label);

                _context.LinePrefixes.Add(prefix);
                await _context.SaveChangesAsync();

                var responseDto = new LinePrefixResponseDto
                {
                    Id = prefix.Id,
                    Value = prefix.Value,
                    Label = prefix.Label,
                    IsActive = prefix.IsActive
                };

                return StatusCode(StatusCodes.Status201Created, responseDto);
            }
            catch (Exception ex) when (ex is ArgumentException || ex is DomainException)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> DeletePrefix(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var prefix = await _context.LinePrefixes
                .FirstOrDefaultAsync(p => p.Id == id && p.PlantId == currentPlantId); // <--- Isolamento
            
            if (prefix == null) return NotFound(new { message = "Prefixo não encontrado nesta unidade." });

            var hasLines = await _context.ProductionLines
                .AnyAsync(l => l.PlantId == currentPlantId && l.Prefix == prefix.Value);
            
            if (hasLines)
                return BadRequest(new { message = "Não é possível excluir um prefixo que possui linhas associadas." });

            _context.LinePrefixes.Remove(prefix);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Prefixo removido com sucesso." });
        }
    }
}