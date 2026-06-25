using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos.Analytics.ExpandedView;
using TicketSystem.API.Enums;
using TicketSystem.API.Dtos.Analytics.Dashboard;

namespace TicketSystem.API.Services.Analytics.ExpandedView;

public class LiveExpandedAnalyticsService : ILiveExpandedAnalyticsService
{
    private readonly AppDbContext _context;

    public LiveExpandedAnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DowntimeDashboardDto> GetExpandedAnalyticsAsync(DashboardFilterDto filter, CancellationToken cancellationToken)
    {
        var brtZone = TimeZoneInfo.FindSystemTimeZoneById(Environment.OSVersion.Platform == PlatformID.Win32NT ? "E. South America Standard Time" : "America/Sao_Paulo");
        var nowBrt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brtZone);

        var targetEndDate = nowBrt;
        var targetStartDate = nowBrt.AddHours(-24);

        var query = _context.Tickets.AsNoTracking().AsQueryable();

        if (filter.PlantId.HasValue) query = query.Where(t => t.PlantId == filter.PlantId.Value);
        if (filter.DepartmentId.HasValue) query = query.Where(t => t.DepartmentId == filter.DepartmentId.Value);

        var startUtc = TimeZoneInfo.ConvertTimeToUtc(targetStartDate, brtZone);
        var endUtc = TimeZoneInfo.ConvertTimeToUtc(targetEndDate, brtZone);
        query = query.Where(t => t.CreatedAt >= startUtc && t.CreatedAt <= endUtc);

        var totalTickets = await query.CountAsync(cancellationToken);
        var openTickets = await query.CountAsync(t => t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress, cancellationToken);
        var avgResponse = await query.Where(t => t.StartedAt != null).AverageAsync(t => (double?)EF.Functions.DateDiffMinute(t.CreatedAt, t.StartedAt), cancellationToken) ?? 0.0;
        var avgResolution = await query.Where(t => t.StartedAt != null && t.FinishedAt != null).AverageAsync(t => (double?)EF.Functions.DateDiffMinute(t.StartedAt, t.FinishedAt), cancellationToken) ?? 0.0;
        var totalDowntime = await query.Where(t => t.IsLineStopped && t.FinishedAt != null).SumAsync(t => (double?)EF.Functions.DateDiffMinute(t.CreatedAt, t.FinishedAt) / 60.0, cancellationToken) ?? 0.0;

        var globalKpis = new GlobalAnalyticsDto(totalTickets, openTickets, avgResponse, avgResolution, totalDowntime);

        var departmentMetricsRaw = await query
            .GroupBy(t => new { t.DepartmentId, t.Department.Name })
            .Select(g => new {
                g.Key.DepartmentId, DepartmentName = g.Key.Name, TotalTickets = g.Count(),
                AvgResponse = g.Where(t => t.StartedAt != null).Average(t => (double?)EF.Functions.DateDiffMinute(t.CreatedAt, t.StartedAt)),
                AvgResolution = g.Where(t => t.StartedAt != null && t.FinishedAt != null).Average(t => (double?)EF.Functions.DateDiffMinute(t.StartedAt, t.FinishedAt))
            }).ToListAsync(cancellationToken);

        var departmentAnalytics = departmentMetricsRaw.Select(x => new DepartmentAnalyticsDto(
            x.DepartmentId, x.DepartmentName, x.TotalTickets, x.AvgResponse ?? 0.0, x.AvgResolution ?? 0.0
        )).OrderByDescending(x => x.TotalTickets).ToList();

        var rawData = await query.Select(t => new { t.CreatedAt, t.Status, t.StartedAt, t.FinishedAt, t.IsLineStopped }).ToListAsync(cancellationToken);

        Func<DateTimeOffset, DateTime> groupSelector = dRaw => {
            var d = TimeZoneInfo.ConvertTimeFromUtc(dRaw.UtcDateTime, brtZone);
            int minuteBucket = (d.Minute / 30) * 30;
            return new DateTime(d.Year, d.Month, d.Day, d.Hour, minuteBucket, 0);
        };

        var volumeSeries = rawData.GroupBy(x => groupSelector(x.CreatedAt)).Select(g => new TicketVolumeSeriesDto(g.Key.ToString("O"), g.Count())).OrderBy(x => x.Date).ToList();
        var openSeries = rawData.GroupBy(x => groupSelector(x.CreatedAt)).Select(g => new OpenTicketsSeriesDto(g.Key.ToString("O"), g.Count(x => x.Status == TicketStatus.Open || x.Status == TicketStatus.InProgress))).OrderBy(x => x.Date).ToList();
        var responseSeries = rawData.Where(x => x.StartedAt != null).GroupBy(x => groupSelector(x.CreatedAt)).Select(g => new ResponseTimeSeriesDto(g.Key.ToString("O"), g.Average(x => (x.StartedAt!.Value - x.CreatedAt).TotalMinutes))).OrderBy(x => x.Date).ToList();
        var downtimeSeries = rawData.Where(x => x.IsLineStopped && x.FinishedAt != null).GroupBy(x => groupSelector(x.CreatedAt)).Select(g => new DowntimeSeriesDto(g.Key.ToString("O"), g.Sum(x => (x.FinishedAt!.Value - x.CreatedAt).TotalMinutes) / 60.0)).OrderBy(x => x.Date).ToList();

        return new DowntimeDashboardDto(globalKpis, departmentAnalytics, volumeSeries.Select(x => new TimeSeriesAnalyticsDto(x.Date, x.Value)).ToList(), openSeries, responseSeries, downtimeSeries);
    }
}