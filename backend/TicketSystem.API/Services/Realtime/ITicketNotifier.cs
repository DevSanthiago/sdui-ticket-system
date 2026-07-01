using System.Threading.Tasks;

namespace TicketSystem.API.Services.Realtime
{
    public interface ITicketNotifier
    {
        Task NotifyTicketCreatedAsync(int plantId, int ticketId, int departmentId);
        Task NotifyTicketChangedAsync(int plantId, int ticketId, int departmentId, string status);
    }
}
