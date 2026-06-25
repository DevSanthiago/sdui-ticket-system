using System.ComponentModel.DataAnnotations;
using TicketSystem.API.Enums;

namespace TicketSystem.API.Dtos
{
    public record CreatePlantConnectorDto
    {
        [Required(ErrorMessage = "A fonte do conector é obrigatória.")]
        public ConnectorSource Source { get; init; }

        public ConnectorPanel Panel { get; init; } = ConnectorPanel.Andon;

        [StringLength(10, ErrorMessage = "O prefixo deve ter no máximo 10 caracteres.")]
        public string? Prefix { get; init; }
    }
}
