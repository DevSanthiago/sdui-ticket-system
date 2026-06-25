using TicketSystem.API.Models;

namespace TicketSystem.API.Services.Checklists
{
    public interface IChecklistPdfModelBuilder
    {
        ChecklistPdfModel Build(Ticket ticket, ChecklistTemplate? template);
    }
}
