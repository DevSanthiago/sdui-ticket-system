using System.Threading;
using System.Threading.Tasks;

namespace TicketSystem.API.Services.GoogleChat
{
    public interface IGoogleChatNotifier
    {
        Task NotifyTicketCreatedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default);
        Task NotifyTicketStartedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default);
        Task NotifyTicketResolvedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default);
    }
}
