namespace TicketSystem.API.Dtos;

public record TicketHistoryItemDto
{
    public int Id { get; init; }
    public int DepartmentId { get; init; }
    public string? DepartmentName { get; init; }
    public string? LineName { get; init; }
    public string? MonitorName { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public bool IsLineStopped { get; init; }
    public int Status { get; init; }
    public string? DynamicAnswers { get; init; }

    public DateTimeOffset? StartedAt { get; init; }
    public DateTimeOffset? FinishedAt { get; init; }
    public string? TechnicianName { get; init; }
    public string? ResolutionFeedback { get; init; }
    public bool CanAddFeedback { get; init; }
}