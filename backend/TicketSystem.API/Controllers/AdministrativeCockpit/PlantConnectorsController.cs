using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Enums;
using TicketSystem.API.Models;
using TicketSystem.API.Services;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/plant-connectors")]
    public class PlantConnectorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;

        public PlantConnectorsController(AppDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] ConnectorPanel panel = ConnectorPanel.Andon)
        {
            int currentPlantId = _userContext.GetPlantId();

            var connectors = await _context.PlantConnectors
                .Where(c => c.PlantId == currentPlantId && c.Panel == panel)
                .AsNoTracking()
                .OrderBy(c => c.Id)
                .ToListAsync();

            var prefixLabels = await GetPrefixLabels(currentPlantId);
            var activeLines = await _context.ProductionLines
                .Where(l => l.PlantId == currentPlantId && l.IsActive)
                .AsNoTracking()
                .Select(l => new { l.Prefix })
                .ToListAsync();

            var response = connectors.Select(c => new PlantConnectorResponseDto
            {
                Id = c.Id,
                Source = c.Source,
                Prefix = c.Prefix,
                PrefixLabel = c.Prefix == null ? null : prefixLabels.GetValueOrDefault(c.Prefix, c.Prefix),
                LineCount = c.Prefix == null
                    ? activeLines.Count
                    : activeLines.Count(l => l.Prefix == c.Prefix),
                CreatedAt = c.CreatedAt
            }).ToList();

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> Create(CreatePlantConnectorDto dto)
        {
            int currentPlantId = _userContext.GetPlantId();
            if (currentPlantId <= 0)
                return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

            var prefix = string.IsNullOrWhiteSpace(dto.Prefix) ? null : dto.Prefix.Trim();

            var isDuplicate = await _context.PlantConnectors
                .AnyAsync(c => c.PlantId == currentPlantId && c.Panel == dto.Panel && c.Source == dto.Source && c.Prefix == prefix);

            if (isDuplicate)
                return BadRequest(new { message = "Este conector já está cadastrado nesta unidade." });

            if (prefix != null)
            {
                var prefixExists = await _context.LinePrefixes
                    .AnyAsync(p => p.PlantId == currentPlantId && p.Value == prefix);

                if (!prefixExists)
                    return BadRequest(new { message = "Prefixo não encontrado nesta unidade." });
            }

            var connector = new PlantConnector(currentPlantId, dto.Source, prefix, dto.Panel);
            _context.PlantConnectors.Add(connector);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Conector adicionado com sucesso." });
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "CanManageSystem")]
        public async Task<IActionResult> Delete(int id)
        {
            int currentPlantId = _userContext.GetPlantId();

            var connector = await _context.PlantConnectors
                .FirstOrDefaultAsync(c => c.Id == id && c.PlantId == currentPlantId);

            if (connector is null)
                return NotFound(new { message = "Conector não encontrado nesta unidade." });

            _context.PlantConnectors.Remove(connector);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Conector removido com sucesso." });
        }

        [HttpGet("board")]
        [Authorize]
        public async Task<IActionResult> GetBoard()
        {
            int currentPlantId = _userContext.GetPlantId();

            var connectors = await _context.PlantConnectors
                .Where(c => c.PlantId == currentPlantId && c.Panel == ConnectorPanel.Andon && c.Source == ConnectorSource.ProductionLines)
                .AsNoTracking()
                .ToListAsync();

            if (connectors.Count == 0)
                return Ok(new List<BoardCardDto>());

            var allLines = connectors.Any(c => c.Prefix == null);
            var prefixes = connectors
                .Where(c => c.Prefix != null)
                .Select(c => c.Prefix!)
                .Distinct()
                .ToList();

            var linesQuery = _context.ProductionLines
                .Where(l => l.PlantId == currentPlantId && l.IsActive);

            if (!allLines)
                linesQuery = linesQuery.Where(l => prefixes.Contains(l.Prefix));

            var lines = await linesQuery.AsNoTracking().ToListAsync();

            var counts = await _context.Tickets
                .Where(t => t.PlantId == currentPlantId
                    && t.ProductionLineId != null
                    && (t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress))
                .GroupBy(t => t.ProductionLineId!.Value)
                .Select(g => new { LineId = g.Key, Count = g.Count() })
                .ToListAsync();

            var countByLine = counts.ToDictionary(c => c.LineId, c => c.Count);
            var prefixLabels = await GetPrefixLabels(currentPlantId);

            var cards = lines
                .Select(l => new BoardCardDto
                {
                    LineId = l.Id,
                    LineName = l.LineName,
                    Prefix = l.Prefix,
                    PrefixLabel = prefixLabels.GetValueOrDefault(l.Prefix, l.Prefix),
                    OpenCount = countByLine.GetValueOrDefault(l.Id, 0)
                })
                .OrderBy(c => c.Prefix)
                .ThenBy(c => c.LineName)
                .ToList();

            return Ok(cards);
        }

        [HttpGet("heatmap")]
        [Authorize]
        public async Task<IActionResult> GetHeatmap()
        {
            int currentPlantId = _userContext.GetPlantId();

            var connectors = await _context.PlantConnectors
                .Where(c => c.PlantId == currentPlantId && c.Panel == ConnectorPanel.Heatmap && c.Source == ConnectorSource.ProductionLines)
                .AsNoTracking()
                .ToListAsync();

            if (connectors.Count == 0)
                return Ok(new List<HeatmapTileDto>());

            var allLines = connectors.Any(c => c.Prefix == null);
            var prefixes = connectors
                .Where(c => c.Prefix != null)
                .Select(c => c.Prefix!)
                .Distinct()
                .ToList();

            var linesQuery = _context.ProductionLines
                .Where(l => l.PlantId == currentPlantId && l.IsActive);

            if (!allLines)
                linesQuery = linesQuery.Where(l => prefixes.Contains(l.Prefix));

            var lines = await linesQuery.AsNoTracking().ToListAsync();

            var openTickets = await _context.Tickets
                .Where(t => t.PlantId == currentPlantId
                    && t.ProductionLineId != null
                    && (t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress))
                .GroupBy(t => t.ProductionLineId!.Value)
                .Select(g => new
                {
                    LineId = g.Key,
                    Count = g.Count(),
                    OldestOpenStoppedAt = g
                        .Where(t => t.IsLineStopped)
                        .Min(t => (DateTimeOffset?)t.CreatedAt)
                })
                .ToListAsync();

            var byLine = openTickets.ToDictionary(x => x.LineId);
            var prefixLabels = await GetPrefixLabels(currentPlantId);

            var tiles = lines
                .Select(l =>
                {
                    byLine.TryGetValue(l.Id, out var agg);
                    return new HeatmapTileDto
                    {
                        LineId = l.Id,
                        LineName = l.LineName,
                        Prefix = l.Prefix,
                        PrefixLabel = prefixLabels.GetValueOrDefault(l.Prefix, l.Prefix),
                        OpenCount = agg?.Count ?? 0,
                        OldestOpenStoppedAt = agg?.OldestOpenStoppedAt
                    };
                })
                .OrderBy(t => t.Prefix)
                .ThenByDescending(t => t.OpenCount)
                .ToList();

            return Ok(tiles);
        }

        private async Task<Dictionary<string, string>> GetPrefixLabels(int plantId)
        {
            var prefixes = await _context.LinePrefixes
                .Where(p => p.PlantId == plantId)
                .AsNoTracking()
                .Select(p => new { p.Value, p.Label })
                .ToListAsync();

            return prefixes.ToDictionary(p => p.Value, p => p.Label);
        }
    }
}
