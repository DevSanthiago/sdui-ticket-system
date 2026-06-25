using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos.Analytics.ExpandedView;
using TicketSystem.API.Dtos.Analytics.Dashboard;
using TicketSystem.API.Enums;

namespace TicketSystem.API.Services.Analytics.LiveDashboard;

public class LiveDowntimeDashboardService : ILiveDowntimeDashboardService
{
    private readonly AppDbContext _context;

    public LiveDowntimeDashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DowntimeDashboardDto> GetLiveAnalyticsAsync(int? plantId, int? departmentId, string? shift, CancellationToken cancellationToken)
    {
        var brtZone = TimeZoneInfo.FindSystemTimeZoneById(
            Environment.OSVersion.Platform == PlatformID.Win32NT ? "E. South America Standard Time" : "America/Sao_Paulo");
        var nowBrt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brtZone);
        
        DateTime startDate;
        DateTime endDate = nowBrt;
        string formatString = "yyyy-MM-ddTHH:mm:ss";
        var buckets = new Dictionary<string, int>();

        if (!string.IsNullOrEmpty(shift))
        {
            shift = shift.ToLower();
            DateTime targetDate = nowBrt.Date;

            if (shift == "adm")
            {
                if (nowBrt.TimeOfDay < new TimeSpan(7, 28, 0))
                    targetDate = targetDate.AddDays(-1);

                startDate = targetDate.Add(new TimeSpan(7, 28, 0));
                endDate = targetDate.Add(new TimeSpan(17, 28, 0));
                
                if (nowBrt < endDate) endDate = nowBrt;
            }
            else
            {
                if (nowBrt.TimeOfDay < new TimeSpan(17, 28, 0))
                    targetDate = targetDate.AddDays(-1);

                startDate = targetDate.Add(new TimeSpan(17, 28, 0));
                endDate = targetDate.AddDays(1).Add(new TimeSpan(7, 28, 0));
                
                if (nowBrt < endDate) endDate = nowBrt;
            }
        }
        else
        {
            startDate = nowBrt.AddHours(-24);
        }

        int startMinuteBucket = (startDate.Minute / 30) * 30;
        var currentBucket = new DateTime(startDate.Year, startDate.Month, startDate.Day, startDate.Hour, startMinuteBucket, 0);
        var endBucket = new DateTime(endDate.Year, endDate.Month, endDate.Day, endDate.Hour, endDate.Minute, 0);

        while (currentBucket <= endBucket)
        {
            buckets[currentBucket.ToString(formatString)] = 0;
            currentBucket = currentBucket.AddMinutes(30);
        }

        var startDateUtc = TimeZoneInfo.ConvertTimeToUtc(startDate, brtZone);
        var endDateUtc = TimeZoneInfo.ConvertTimeToUtc(endDate, brtZone);

        var query = _context.Tickets.AsNoTracking()
            .Where(t => t.CreatedAt >= startDateUtc && t.CreatedAt <= endDateUtc);

        if (plantId.HasValue) query = query.Where(t => t.PlantId == plantId.Value);
        if (departmentId.HasValue) query = query.Where(t => t.DepartmentId == departmentId.Value);

        var totalTickets = await query.CountAsync(cancellationToken);
        var openTickets = await query.CountAsync(t => t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress, cancellationToken);
        
        var avgResponse = await query.Where(t => t.StartedAt != null).AverageAsync(t => (double?)EF.Functions.DateDiffMinute(t.CreatedAt, t.StartedAt), cancellationToken) ?? 0.0;
        var avgResolution = await query.Where(t => t.StartedAt != null && t.FinishedAt != null).AverageAsync(t => (double?)EF.Functions.DateDiffMinute(t.StartedAt, t.FinishedAt), cancellationToken) ?? 0.0;
        var totalDowntime = await query.Where(t => t.IsLineStopped && t.FinishedAt != null).SumAsync(t => (double?)EF.Functions.DateDiffMinute(t.CreatedAt, t.FinishedAt) / 60.0, cancellationToken) ?? 0.0;

        var globalAnalytics = new GlobalAnalyticsDto(totalTickets, openTickets, avgResponse, avgResolution, totalDowntime);

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

        var datesRaw = await query.Select(t => t.CreatedAt).ToListAsync(cancellationToken);

        foreach (var dRaw in datesRaw)
        {
            var d = TimeZoneInfo.ConvertTimeFromUtc(dRaw.UtcDateTime, brtZone);
            int minuteBucket = (d.Minute / 30) * 30;
            string key = new DateTime(d.Year, d.Month, d.Day, d.Hour, minuteBucket, 0).ToString(formatString);

            if (buckets.ContainsKey(key))
                buckets[key]++;
        }

        var timeSeries = buckets.Select(b => new TimeSeriesAnalyticsDto(b.Key, b.Value))
                                .OrderBy(x => x.Date)
                                .ToList();

        return new DowntimeDashboardDto(
            globalAnalytics, departmentAnalytics, timeSeries,
            new List<OpenTicketsSeriesDto>(), new List<ResponseTimeSeriesDto>(), new List<DowntimeSeriesDto>()
        );
    }
}