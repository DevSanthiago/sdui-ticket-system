using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record CreateChecklistTemplateDto
    {
        [Required(ErrorMessage = "O nome do checklist é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome do checklist deve ter no máximo 100 caracteres.")]
        public string Name { get; init; } = string.Empty;

        [StringLength(255, ErrorMessage = "A descrição deve ter no máximo 255 caracteres.")]
        public string? Description { get; init; }

        [StringLength(10, ErrorMessage = "A cor hexadecimal deve ter no máximo 10 caracteres.")]
        public string? CardColorHex { get; init; }

        [Required(ErrorMessage = "O ícone é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome do ícone deve ter no máximo 50 caracteres.")]
        public string IconName { get; init; } = string.Empty;

        [Required(ErrorMessage = "O schema do checklist é obrigatório.")]
        public JsonElement Schema { get; init; }

        public List<string> AllowedRoles { get; init; } = new();

        public int? DepartmentId { get; init; }

        [StringLength(150)]
        public string? TriggerFieldId { get; init; }

        [StringLength(150)]
        public string? TriggerFieldValue { get; init; }
    }
}
