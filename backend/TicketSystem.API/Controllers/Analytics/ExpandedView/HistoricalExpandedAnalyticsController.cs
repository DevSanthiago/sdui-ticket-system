using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.API.Dtos.Analytics.Dashboard;
using TicketSystem.API.Services.Analytics.ExpandedView;
using System.Threading;
using System.Threading.Tasks;

namespace TicketSystem.API.Controllers.Analytics.ExpandedView;

[Authorize]
[ApiController]
[Route("api/analytics/expanded")]
public class HistoricalExpandedAnalyticsController : ControllerBase
{
    private readonly IHistoricalExpandedAnalyticsService _historicalExpandedService;

    public HistoricalExpandedAnalyticsController(IHistoricalExpandedAnalyticsService historicalExpandedService)
    {
        _historicalExpandedService = historicalExpandedService;
    }

    [HttpGet("downtime-historical")]
    public async Task<ActionResult<DowntimeDashboardDto>> GetHistoricalExpandedDashboard(
        [FromQuery] DashboardFilterDto filter, 
        CancellationToken cancellationToken)
    {
        var metrics = await _historicalExpandedService.GetExpandedAnalyticsAsync(filter, cancellationToken);
        return Ok(metrics);
    }
}