using System;
using System.Collections.Generic;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record ChecklistTemplateResponseDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string? Description { get; init; }
        public string? CardColorHex { get; init; }
        public string IconName { get; init; } = string.Empty;
        public bool IsActive { get; init; }
        public JsonElement Schema { get; init; }
        public List<string> AllowedRoles { get; init; } = new();
        public int? DepartmentId { get; init; }
        public string? TriggerFieldId { get; init; }
        public string? TriggerFieldValue { get; init; }
        public DateTimeOffset CreatedAt { get; init; }
        public DateTimeOffset? UpdatedAt { get; init; }
    }
}
