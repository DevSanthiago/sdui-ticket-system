using System.Threading;
using System.Threading.Tasks;
using TicketSystem.API.Dtos.Analytics.Dashboard;

namespace TicketSystem.API.Services.Analytics.ExpandedView;

public interface IHistoricalExpandedAnalyticsService
{
    Task<DowntimeDashboardDto> GetExpandedAnalyticsAsync(DashboardFilterDto filter, CancellationToken cancellationToken);
}