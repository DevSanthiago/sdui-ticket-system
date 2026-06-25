using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketSystem.API.Hubs;

namespace TicketSystem.API.Services.Realtime
{
    public class ChecklistNotifier : IChecklistNotifier
    {
        private const string ChecklistChangedEvent = "ChecklistChanged";

        private readonly IHubContext<ChecklistHub> _hub;

        public ChecklistNotifier(IHubContext<ChecklistHub> hub)
        {
            _hub = hub;
        }

        public async Task NotifyChangedAsync(params int[] userIds)
        {
            foreach (var userId in userIds.Where(id => id > 0).Distinct())
                await _hub.Clients.User(userId.ToString()).SendAsync(ChecklistChangedEvent);
        }
    }
}
