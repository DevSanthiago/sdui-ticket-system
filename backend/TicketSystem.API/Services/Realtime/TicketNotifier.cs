using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketSystem.API.Hubs;

namespace TicketSystem.API.Services.Realtime
{
    public class TicketNotifier : ITicketNotifier
    {
        private const string TicketCreatedEvent = "TicketCreated";
        private const string TicketChangedEvent = "TicketChanged";

        private readonly IHubContext<TicketHub> _hub;

        public TicketNotifier(IHubContext<TicketHub> hub)
        {
            _hub = hub;
        }

        public Task NotifyTicketCreatedAsync(int plantId, int ticketId, int departmentId)
        {
            if (plantId <= 0)
                return Task.CompletedTask;

            return _hub.Clients
                .Group(TicketHub.PlantGroup(plantId))
                .SendAsync(TicketCreatedEvent, new { ticketId, departmentId });
        }

        public Task NotifyTicketChangedAsync(int plantId, int ticketId, int departmentId, string status)
        {
            if (plantId <= 0)
                return Task.CompletedTask;

            return _hub.Clients
                .Group(TicketHub.PlantGroup(plantId))
                .SendAsync(TicketChangedEvent, new { ticketId, departmentId, status });
        }
    }
}
