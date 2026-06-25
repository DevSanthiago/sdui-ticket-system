using System.Threading;
using System.Threading.Tasks;
using TicketSystem.API.Dtos.Analytics.Dashboard;

namespace TicketSystem.API.Services.Analytics.HistoricalDashboard;

public interface IDowntimeHistoricalService
{
    Task<DowntimeDashboardDto> GetDashboardAnalyticsAsync(DashboardFilterDto filter, CancellationToken cancellationToken);
}