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
public class LiveExpandedAnalyticsController : ControllerBase
{
    private readonly ILiveExpandedAnalyticsService _liveExpandedService;

    public LiveExpandedAnalyticsController(ILiveExpandedAnalyticsService liveExpandedService)
    {
        _liveExpandedService = liveExpandedService;
    }

    [HttpGet("downtime-live")]
    public async Task<ActionResult<DowntimeDashboardDto>> GetLiveExpandedDashboard(
        [FromQuery] DashboardFilterDto filter, 
        CancellationToken cancellationToken)
    {
        var metrics = await _liveExpandedService.GetExpandedAnalyticsAsync(filter, cancellationToken);
        return Ok(metrics);
    }
}