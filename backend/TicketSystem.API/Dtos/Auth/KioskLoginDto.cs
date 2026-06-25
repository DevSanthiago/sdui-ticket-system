using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record KioskLoginDto
    {
        [Required(ErrorMessage = "A chave do dispositivo é obrigatória.")]
        public string DeviceKey { get; init; } = string.Empty;

        [Required(ErrorMessage = "A planta é obrigatória.")]
        public int PlantId { get; init; }

        public string? DisplayName { get; init; }
    }
}
