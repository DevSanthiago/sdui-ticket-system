using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.API.Dtos.Analytics.Dashboard;
using TicketSystem.API.Services.Analytics.LiveDashboard;

namespace TicketSystem.API.Controllers.Analytics.LiveDashboard;

[Authorize]
[ApiController]
[Route("api/analytics/dashboard/live")]
public class LiveDowntimeDashboardController : ControllerBase
{
    private readonly ILiveDowntimeDashboardService _dashboardService;

    public LiveDowntimeDashboardController(ILiveDowntimeDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult<DowntimeDashboardDto>> GetLiveDashboard(
        [FromQuery] int? plantId,
        [FromQuery] int? departmentId,
        [FromQuery] string? shift,
        CancellationToken cancellationToken)
    {
        var metrics = await _dashboardService.GetLiveAnalyticsAsync(plantId, departmentId, shift ?? string.Empty, cancellationToken);
        return Ok(metrics);
    }
}