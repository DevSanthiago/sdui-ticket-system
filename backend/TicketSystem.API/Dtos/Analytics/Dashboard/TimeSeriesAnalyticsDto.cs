namespace TicketSystem.API.Dtos.Analytics.Dashboard;

public record TimeSeriesAnalyticsDto(
    string Date,
    int TicketCount
);