using System;
using System.Collections.Generic;

namespace TicketSystem.API.Services.GoogleChat
{
    public record GoogleChatTicketField(string Label, string Value);

    public enum GoogleChatTicketEvent
    {
        Created,
        Started,
        Resolved
    }

    public record GoogleChatTicketCard
    {
        public GoogleChatTicketEvent Event { get; init; } = GoogleChatTicketEvent.Created;
        public int TicketId { get; init; }
        public string DepartmentName { get; init; } = string.Empty;
        public string? LineName { get; init; }
        public string RequesterName { get; init; } = string.Empty;
        public DateTimeOffset CreatedAt { get; init; }
        public bool IsLineStopped { get; init; }
        public string? TechnicianName { get; init; }
        public DateTimeOffset? StartedAt { get; init; }
        public DateTimeOffset? FinishedAt { get; init; }
        public IReadOnlyList<GoogleChatTicketField> Fields { get; init; } = Array.Empty<GoogleChatTicketField>();
    }
}
