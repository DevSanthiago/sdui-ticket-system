namespace TicketSystem.API.Dtos.Analytics.Dashboard;

public record DepartmentAnalyticsDto(
    int DepartmentId,
    string DepartmentName,
    int TotalTickets,
    double AverageResponseTimeMinutes,
    double AverageResolutionTimeMinutes
);