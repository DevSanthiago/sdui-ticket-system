using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Services;

namespace TicketSystem.API.Controllers;

[ApiController]
[Route("api/tickets-history")]
[Authorize]
public class TicketHistoryController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IUserContext _userContext;

    public TicketHistoryController(AppDbContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<TicketHistoryItemDto>>> GetHistory([FromQuery] TicketHistoryQueryDto query)
    {
        var plantId = _userContext.GetPlantId();

        var queryable = _context.Tickets
            .AsNoTracking()
            .Include(t => t.Department)
            .Include(t => t.ProductionLine)
            .Where(t => t.PlantId == plantId);

        if (query.DepartmentId.HasValue)
        {
            queryable = queryable.Where(t => t.DepartmentId == query.DepartmentId.Value);
        }

        if (query.StartDate.HasValue)
        {
            var startOffset = new DateTimeOffset(query.StartDate.Value, TimeSpan.Zero);
            queryable = queryable.Where(t => t.CreatedAt >= startOffset);
        }

        if (query.EndDate.HasValue)
        {
            var endOffset = new DateTimeOffset(query.EndDate.Value.Date.AddDays(1).AddTicks(-1), TimeSpan.Zero);
            queryable = queryable.Where(t => t.CreatedAt <= endOffset);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.ToLower();
            queryable = queryable.Where(t => 
                t.Id.ToString() == searchTerm || 
                (t.ProductionLine != null && t.ProductionLine.LineName.ToLower().Contains(searchTerm)));
        }

        string? statusFilter = null;

        if (!string.IsNullOrWhiteSpace(query.DynamicFilters))
        {
            try
            {
                var filters = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(query.DynamicFilters);
                if (filters != null)
                {
                    foreach (var filter in filters)
                    {
                        if (filter.Key == "status") 
                        { 
                            statusFilter = filter.Value; 
                            continue; 
                        }

                        if (string.IsNullOrWhiteSpace(filter.Value)) continue;

                        var searchValue = filter.Value;
                        queryable = queryable.Where(t => t.DynamicAnswers.Contains(searchValue));
                    }
                }
            }
            catch 
            {
            }
        }

        if (statusFilter == "TODOS") {
        } else if (statusFilter == "ABERTO") {
            queryable = queryable.Where(t => t.Status == TicketSystem.API.Enums.TicketStatus.Open);
        } else if (statusFilter == "EM_ANDAMENTO") {
            queryable = queryable.Where(t => t.Status == TicketSystem.API.Enums.TicketStatus.InProgress);
        } else if (statusFilter == "RESOLVIDO") {
            queryable = queryable.Where(t => t.Status == TicketSystem.API.Enums.TicketStatus.Resolved);
        } else if (string.IsNullOrWhiteSpace(query.DynamicFilters) && !query.StartDate.HasValue && string.IsNullOrWhiteSpace(query.Search)) {
            queryable = queryable.Where(t => false); 
        } else {
            queryable = queryable.Where(t => t.Status == TicketSystem.API.Enums.TicketStatus.Resolved);
        }

        var totalCount = await queryable.CountAsync();

        var ticketsFromDb = await queryable
            .OrderByDescending(t => t.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(t => new 
            {
                t.Id,
                t.DepartmentId,
                DepartmentName = t.Department != null ? t.Department.Name : null,
                LineName = t.ProductionLine != null ? t.ProductionLine.LineName : null,
                t.MonitorName,
                t.CreatedAt,
                t.IsLineStopped,
                t.Status,
                t.DynamicAnswers,
                t.StartedAt,
                t.FinishedAt,
                t.TechnicianName,
                t.ResolutionFeedback
            })
            .ToListAsync();

        var now = DateTimeOffset.UtcNow;
        var tickets = ticketsFromDb.Select(t => new TicketHistoryItemDto
        {
            Id = t.Id,
            DepartmentId = t.DepartmentId,
            DepartmentName = t.DepartmentName,
            LineName = t.LineName,
            MonitorName = t.MonitorName,
            CreatedAt = t.CreatedAt,
            IsLineStopped = t.IsLineStopped,
            Status = (int)t.Status,
            DynamicAnswers = t.DynamicAnswers,
            StartedAt = t.StartedAt,
            FinishedAt = t.FinishedAt,
            TechnicianName = t.TechnicianName,
            ResolutionFeedback = t.ResolutionFeedback,
            CanAddFeedback = (now - t.CreatedAt).TotalHours <= 24
        }).ToList();

        var result = new PaginatedResultDto<TicketHistoryItemDto>
        {
            Items = tickets,
            TotalCount = totalCount,
            CurrentPage = query.Page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };

        return Ok(result);
    }
}