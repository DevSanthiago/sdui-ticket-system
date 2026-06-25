namespace TicketSystem.API.Dtos
{
    public record LinePrefixResponseDto
    {
        public int Id { get; init; }
        public string Value { get; init; } = string.Empty;
        public string Label { get; init; } = string.Empty;
        public bool IsActive { get; init; }
    }
}