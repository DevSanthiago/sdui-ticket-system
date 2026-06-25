namespace TicketSystem.API.Dtos
{
    public record HeatmapTileDto
    {
        public int LineId { get; init; }
        public string LineName { get; init; } = string.Empty;
        public string Prefix { get; init; } = string.Empty;
        public string PrefixLabel { get; init; } = string.Empty;
        public int OpenCount { get; init; }
        public DateTimeOffset? OldestOpenStoppedAt { get; init; }
    }
}
