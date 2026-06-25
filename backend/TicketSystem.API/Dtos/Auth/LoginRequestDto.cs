using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record LoginRequestDto
    {
        [Required(ErrorMessage = "A matrícula é obrigatória.")]
        public int Registration { get; init; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; init; } = string.Empty;

        public int PlantId { get; init; }
    }
}