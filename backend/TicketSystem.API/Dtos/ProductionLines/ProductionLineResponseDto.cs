using System;

namespace TicketSystem.API.Dtos
{
    public record ProductionLineResponseDto
    {
        public int Id { get; init; }
        public string LineName { get; init; } = string.Empty;
        public string Prefix { get; init; } = string.Empty;
        public string? Description { get; init; }
        public bool IsActive { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        
        public string CreatedByUserName { get; init; } = string.Empty;
        public string? UpdatedByUserName { get; init; } 
    }
}