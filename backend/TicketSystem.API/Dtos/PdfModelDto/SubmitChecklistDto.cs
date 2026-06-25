using System.ComponentModel.DataAnnotations;

namespace TicketSystem.API.Dtos
{
    public record SubmitChecklistDto
    {
        [Required(ErrorMessage = "O ID do ticket é obrigatório.")]
        public int TicketId { get; init; }

        [Required(ErrorMessage = "O conteúdo do checklist é obrigatório.")]
        public string ChecklistContent { get; init; } = string.Empty;
    }
}