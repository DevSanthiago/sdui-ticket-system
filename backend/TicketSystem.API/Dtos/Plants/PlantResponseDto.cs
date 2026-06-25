namespace TicketSystem.API.Dtos
{
    public record PlantResponseDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string Slug { get; init; } = string.Empty;
        public bool IsActive { get; init; }
    }
}