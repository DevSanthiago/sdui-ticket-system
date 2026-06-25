using System.Threading;
using System.Threading.Tasks;
using TicketSystem.API.Models;

namespace TicketSystem.API.Services.Checklists
{
    public interface IChecklistAssignmentService
    {
        Task<ChecklistTemplate?> FindApplicableTemplateAsync(
            int plantId, int departmentId, string dynamicAnswersJson, CancellationToken cancellationToken);
    }
}
