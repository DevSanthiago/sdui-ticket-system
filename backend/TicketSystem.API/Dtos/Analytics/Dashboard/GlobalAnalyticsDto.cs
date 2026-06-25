namespace TicketSystem.API.Dtos.Analytics.Dashboard;

public record GlobalAnalyticsDto(
    int TotalTickets,
    int OpenTickets,
    double AverageResponseTimeMinutes,
    double AverageResolutionTimeMinutes,  
    double TotalDowntimeHours             
);