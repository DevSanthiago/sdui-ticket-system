using System.Threading.Tasks;

namespace TicketSystem.API.Services.Realtime
{
    public interface IChecklistNotifier
    {
        Task NotifyChangedAsync(params int[] userIds);
    }
}
