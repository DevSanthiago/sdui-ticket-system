using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record CreateProductionLineDto
    {
        [Required(ErrorMessage = "O nome da linha é obrigatório")]
        [StringLength(50, ErrorMessage = "O nome da linha deve ter no máximo 50 caracteres")]
        public string LineName { get; init; } = string.Empty;

        [Required(ErrorMessage = "O prefixo é obrigatório")]
        [StringLength(10, ErrorMessage = "O prefixo deve ter no máximo 10 caracteres")]
        public string Prefix { get; init; } = string.Empty;

        [StringLength(200, ErrorMessage = "A descrição deve ter no máximo 200 caracteres")]
        public string? Description { get; init; }
    }
}