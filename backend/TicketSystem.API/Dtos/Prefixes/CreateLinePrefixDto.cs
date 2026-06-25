using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record CreateLinePrefixDto
    {
        [Required(ErrorMessage = "O valor do prefixo é obrigatório")]
        public string Value { get; init; } = string.Empty;

        [Required(ErrorMessage = "O rótulo do prefixo é obrigatório")]
        public string Label { get; init; } = string.Empty;
    }
}