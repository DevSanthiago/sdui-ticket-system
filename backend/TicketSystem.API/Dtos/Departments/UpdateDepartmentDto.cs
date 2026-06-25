using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record UpdateDepartmentDto
    {
        [Required(ErrorMessage = "O nome do departamento é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome do departamento deve ter no máximo 100 caracteres.")]
        public string Name { get; init; } = string.Empty;

        [StringLength(255, ErrorMessage = "A descrição deve ter no máximo 255 caracteres.")]
        public string? Description { get; init; }

        [StringLength(10, ErrorMessage = "A cor hexadecimal deve ter no máximo 10 caracteres.")]
        public string? CardColorHex { get; init; }

        [Required(ErrorMessage = "O ícone é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome do ícone deve ter no máximo 50 caracteres.")]
        public string IconName { get; init; } = string.Empty;

        public List<string> Badges { get; init; } = new();

        public bool IsActive { get; init; }

        [Required(ErrorMessage = "O schema do formulário (FormSchema) é obrigatório.")]
        public JsonElement FormSchema { get; init; }

        public List<string> AllowedRoles { get; init; } = new();
    }
}