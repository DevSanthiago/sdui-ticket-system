using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record TicketHandshakeDto
    {
        public string? Token { get; init; }

        [Required(ErrorMessage = "O ID do técnico é obrigatório.")]
        public int TechnicianId { get; init; }

        public string TechnicianName { get; init; } = "Técnico";
    }
}