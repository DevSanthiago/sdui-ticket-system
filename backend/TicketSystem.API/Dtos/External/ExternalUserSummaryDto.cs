namespace TicketSystem.API.Dtos
{
    public record ExternalUserSummaryDto
    {
        public long Id { get; init; }
        public int Registration { get; init; }
        public string? Name { get; init; }
        public string? Email { get; init; }
        public string? Department { get; init; }
    }
}