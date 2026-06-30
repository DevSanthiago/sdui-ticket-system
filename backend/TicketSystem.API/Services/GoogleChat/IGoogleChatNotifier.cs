using System.Threading;
using System.Threading.Tasks;

namespace TicketSystem.API.Services.GoogleChat
{
    public interface IGoogleChatNotifier
    {
        Task NotifyTicketCreatedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default);
    }
}
