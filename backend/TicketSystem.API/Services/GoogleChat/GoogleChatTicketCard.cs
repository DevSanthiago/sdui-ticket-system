using System;
using System.Collections.Generic;

namespace TicketSystem.API.Services.GoogleChat
{
    public record GoogleChatTicketField(string Label, string Value);

    public record GoogleChatTicketCard
    {
        public int TicketId { get; init; }
        public string DepartmentName { get; init; } = string.Empty;
        public string? LineName { get; init; }
        public string RequesterName { get; init; } = string.Empty;
        public DateTimeOffset CreatedAt { get; init; }
        public bool IsLineStopped { get; init; }
        public IReadOnlyList<GoogleChatTicketField> Fields { get; init; } = Array.Empty<GoogleChatTicketField>();
    }
}
