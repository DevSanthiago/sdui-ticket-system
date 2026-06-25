using System.Threading;
using System.Threading.Tasks;
using TicketSystem.API.Dtos.Analytics.Dashboard;

namespace TicketSystem.API.Services.Analytics.LiveDashboard;

public interface ILiveDowntimeDashboardService
{
    Task<DowntimeDashboardDto> GetLiveAnalyticsAsync(int? plantId, int? departmentId, string shift, CancellationToken cancellationToken);
}