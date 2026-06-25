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

public class HistoricalExpandedAnalyticsService : IHistoricalExpandedAnalyticsService
{
    private readonly AppDbContext _context;

    public HistoricalExpandedAnalyticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DowntimeDashboardDto> GetExpandedAnalyticsAsync(DashboardFilterDto filter, CancellationToken cancellationToken)
    {
        var brtZone = TimeZoneInfo.FindSystemTimeZoneById(
            Environment.OSVersion.Platform == PlatformID.Win32NT ? "E. South America Standard Time" : "America/Sao_Paulo");
        var nowBrt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, brtZone);

        DateTime targetStartDate = filter.StartDate?.Date ?? nowBrt.Date.AddDays(-7);
        DateTime targetEndDate = filter.EndDate?.Date.AddDays(1) ?? nowBrt.Date.AddDays(1);
        string formatString = "yyyy-MM-ddTHH:mm:ss";

        if (!string.IsNullOrEmpty(filter.Shift) && filter.StartDate.HasValue)
        {
            var shift = filter.Shift.ToLower();
            DateTime baseDate = filter.StartDate.Value.Date;

            if (shift == "adm")
            {
                targetStartDate = baseDate.Add(new TimeSpan(7, 28, 0));
                targetEndDate = baseDate.Add(new TimeSpan(17, 28, 0));
            }
            else if (shift == "t2")
            {
                targetStartDate = baseDate.Add(new TimeSpan(17, 28, 0));
                targetEndDate = baseDate.AddDays(1).Add(new TimeSpan(7, 28, 0));
            }

            if (nowBrt < targetEndDate) targetEndDate = nowBrt;
        }

        var groupByMode = (!string.IsNullOrEmpty(filter.Shift)) ? "hour" : (filter.GroupBy?.ToLower() ?? "day");

        DateTime currentBucket = groupByMode switch
        {
            "minute" => new DateTime(targetStartDate.Year, targetStartDate.Month, targetStartDate.Day, targetStartDate.Hour, targetStartDate.Minute, 0),
            "hour" => new DateTime(targetStartDate.Year, targetStartDate.Month, targetStartDate.Day, targetStartDate.Hour, 0, 0),
            "month" => new DateTime(targetStartDate.Year, targetStartDate.Month, 1),
            "week" => targetStartDate.Date.AddDays(-(int)targetStartDate.DayOfWeek),
            _ => targetStartDate.Date
        };

        DateTime endBucketBoundary = groupByMode switch
        {
            "minute" => new DateTime(targetEndDate.Year, targetEndDate.Month, targetEndDate.Day, targetEndDate.Hour, targetEndDate.Minute, 0),
            "hour" => new DateTime(targetEndDate.Year, targetEndDate.Month, targetEndDate.Day, targetEndDate.Hour, 0, 0),
            "month" => new DateTime(targetEndDate.Year, targetEndDate.Month, 1),
            "week" => targetEndDate.Date.AddDays(-(int)targetEndDate.DayOfWeek),
            _ => targetEndDate.Date
        };

        var volumeBuckets = new Dictionary<string, int>();
        var openBuckets = new Dictionary<string, int>();
        var responseBuckets = new Dictionary<string, List<double>>();
        var downtimeBuckets = new Dictionary<string, double>();
        
        int safetyCounter = 0;
        while (currentBucket <= endBucketBoundary && safetyCounter < 5000)
        {
            var key = currentBucket.ToString(formatString);
            volumeBuckets[key] = 0;
            openBuckets[key] = 0;
            responseBuckets[key] = new List<double>();
            downtimeBuckets[key] = 0.0;
            
            currentBucket = groupByMode switch
            {
                "minute" => currentBucket.AddMinutes(1),
                "hour" => currentBucket.AddHours(1),
                "month" => currentBucket.AddMonths(1),
                "week" => currentBucket.AddDays(7),
                _ => currentBucket.AddDays(1)
            };
            safetyCounter++;
        }

        var query = _context.Tickets.AsNoTracking().AsQueryable();

        if (filter.PlantId.HasValue) query = query.Where(t => t.PlantId == filter.PlantId.Value);
        if (filter.DepartmentId.HasValue) query = query.Where(t => t.DepartmentId == filter.DepartmentId.Value);

        var startUtc = TimeZoneInfo.ConvertTimeToUtc(targetStartDate, brtZone);
        var endUtc = TimeZoneInfo.ConvertTimeToUtc(targetEndDate, brtZone);
        query = query.Where(t => t.CreatedAt >= startUtc && t.CreatedAt < endUtc);

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

        foreach (var t in rawData)
        {
            var d = TimeZoneInfo.ConvertTimeFromUtc(t.CreatedAt.UtcDateTime, brtZone);
            string key = groupByMode switch
            {
                "minute" => new DateTime(d.Year, d.Month, d.Day, d.Hour, d.Minute, 0).ToString(formatString),
                "hour" => new DateTime(d.Year, d.Month, d.Day, d.Hour, 0, 0).ToString(formatString),
                "month" => new DateTime(d.Year, d.Month, 1).ToString(formatString),
                "week" => d.Date.AddDays(-(int)d.DayOfWeek).ToString(formatString),
                _ => d.Date.ToString(formatString)
            };

            if (volumeBuckets.ContainsKey(key))
            {
                volumeBuckets[key]++;
                
                if (t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress)
                    openBuckets[key]++;
                    
                if (t.StartedAt != null)
                    responseBuckets[key].Add((t.StartedAt.Value - t.CreatedAt).TotalMinutes);
                    
                if (t.IsLineStopped && t.FinishedAt != null)
                    downtimeBuckets[key] += (t.FinishedAt.Value - t.CreatedAt).TotalMinutes / 60.0;
            }
        }

        var volumeSeries = volumeBuckets.Select(b => new TimeSeriesAnalyticsDto(b.Key, b.Value)).OrderBy(x => x.Date).ToList();
        var openSeries = openBuckets.Select(b => new OpenTicketsSeriesDto(b.Key, b.Value)).OrderBy(x => x.Date).ToList();
        var responseSeries = responseBuckets.Select(b => new ResponseTimeSeriesDto(b.Key, b.Value.Any() ? b.Value.Average() : 0.0)).OrderBy(x => x.Date).ToList();
        var downtimeSeries = downtimeBuckets.Select(b => new DowntimeSeriesDto(b.Key, b.Value)).OrderBy(x => x.Date).ToList();

        return new DowntimeDashboardDto(
            globalKpis,
            departmentAnalytics,
            volumeSeries,
            openSeries,
            responseSeries,
            downtimeSeries
        );
    }
}