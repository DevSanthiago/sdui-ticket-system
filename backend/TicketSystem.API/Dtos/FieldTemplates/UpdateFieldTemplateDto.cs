using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record UpdateFieldTemplateDto
    {
        [Required(ErrorMessage = "O nome do tipo de campo é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome do tipo de campo deve ter no máximo 100 caracteres.")]
        public string Name { get; init; } = string.Empty;

        [Required(ErrorMessage = "A configuração do tipo de campo (Schema) é obrigatória.")]
        public JsonElement Schema { get; init; }
    }
}
