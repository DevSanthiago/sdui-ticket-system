namespace TicketSystem.API.Dtos
{
    public record ExternalUserListResponseDto
    {
        public int TotalCount { get; init; }
        public int Page { get; init; }
        public int PageSize { get; init; }
        public List<ExternalUserSummaryDto> Items { get; init; } = new();
    }
}