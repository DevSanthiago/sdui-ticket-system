using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.API.Dtos.Analytics.Dashboard;
using TicketSystem.API.Services.Analytics.HistoricalDashboard;

namespace TicketSystem.API.Controllers.Analytics;

[Authorize]
[ApiController]
[Route("api/analytics/historical")]
public class DowntimeHistoricalController : ControllerBase
{
    private readonly IDowntimeHistoricalService _historicalService;

    public DowntimeHistoricalController(IDowntimeHistoricalService historicalService)
    {
        _historicalService = historicalService;
    }

    [HttpGet("range")]
    public async Task<ActionResult<DowntimeDashboardDto>> GetHistoricalDashboard(
        [FromQuery] DashboardFilterDto filter, 
        CancellationToken cancellationToken)
    {
        var metrics = await _historicalService.GetDashboardAnalyticsAsync(filter, cancellationToken);
        return Ok(metrics);
    }
}