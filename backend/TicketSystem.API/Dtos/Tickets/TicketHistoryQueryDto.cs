namespace TicketSystem.API.Dtos;

public record TicketHistoryQueryDto
{
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public int? DepartmentId { get; init; }
    public string? Search { get; init; }
    public string? DynamicFilters { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}