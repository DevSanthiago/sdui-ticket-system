using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record ExternalLoginRequestDto
    {
        [Required(ErrorMessage = "A matrícula é obrigatória.")]
        public int Registration { get; init; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; init; } = string.Empty;
    }
}