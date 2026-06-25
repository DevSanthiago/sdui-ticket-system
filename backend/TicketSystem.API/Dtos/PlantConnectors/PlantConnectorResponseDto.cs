using TicketSystem.API.Enums;

namespace TicketSystem.API.Dtos
{
    public record PlantConnectorResponseDto
    {
        public int Id { get; init; }
        public ConnectorSource Source { get; init; }
        public string? Prefix { get; init; }
        public string? PrefixLabel { get; init; }
        public int LineCount { get; init; }
        public DateTimeOffset CreatedAt { get; init; }
    }
}
