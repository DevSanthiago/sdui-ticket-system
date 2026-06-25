using System.Collections.Generic;

namespace TicketSystem.API.Dtos
{
    public record ProductionLinesByPrefixDto
    {
        public string Prefix { get; init; } = string.Empty;
        public string PrefixLabel { get; init; } = string.Empty;
        public List<ProductionLineResponseDto> Lines { get; init; } = new();
    }
}