using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record FieldTemplateResponseDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public JsonElement Schema { get; init; }
        public DateTimeOffset CreatedAt { get; init; }
        public DateTimeOffset? UpdatedAt { get; init; }
    }
}
