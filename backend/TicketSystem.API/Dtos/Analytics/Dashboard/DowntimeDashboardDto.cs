using TicketSystem.API.Dtos.Analytics.ExpandedView;
namespace TicketSystem.API.Dtos.Analytics.Dashboard;

public record DowntimeDashboardDto(
    GlobalAnalyticsDto GlobalAnalytics,
    IEnumerable<DepartmentAnalyticsDto> DepartmentAnalytics,
    IEnumerable<TimeSeriesAnalyticsDto> TimeSeriesAnalytics,
    IEnumerable<OpenTicketsSeriesDto> OpenTicketsSeries, 
    IEnumerable<ResponseTimeSeriesDto> ResponseTimeSeries, 
    IEnumerable<DowntimeSeriesDto> DowntimeSeries
);