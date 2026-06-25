namespace TicketSystem.API.Dtos
{
    public record ExternalRoleDto
    {
        public long Id { get; init; }
        public string? Name { get; init; }
        public string? Description { get; init; }
    }
}