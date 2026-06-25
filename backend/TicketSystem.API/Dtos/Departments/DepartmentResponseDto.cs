using System.Collections.Generic;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record DepartmentResponseDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
        public string? CardColorHex { get; init; }
        public string IconName { get; init; } = string.Empty;
        public List<string> Badges { get; init; } = new();
        public bool IsActive { get; init; }
        public JsonElement FormSchema { get; init; }
        public List<string> AllowedRoles { get; init; } = new();
    }
}