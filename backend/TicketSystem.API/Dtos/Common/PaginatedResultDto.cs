namespace TicketSystem.API.Dtos;

public record PaginatedResultDto<T>
{
    public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();
    public int TotalCount { get; init; }
    public int CurrentPage { get; init; }
    public int TotalPages { get; init; }
}