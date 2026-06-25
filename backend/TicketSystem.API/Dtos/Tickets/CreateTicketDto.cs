using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace TicketSystem.API.Dtos
{
    public record CreateTicketDto
    {
        [Required(ErrorMessage = "O departamento é obrigatório.")]
        public int DepartmentId { get; init; }

        public int? ProductionLineId { get; init; }

        public bool IsLineStopped { get; init; }
        
        public string? LineStoppedTime { get; init; }

        [Required(ErrorMessage = "As respostas dinâmicas do formulário são obrigatórias.")]
        public JsonElement DynamicAnswers { get; init; }
    }
}