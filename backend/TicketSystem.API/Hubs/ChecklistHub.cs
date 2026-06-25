using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TicketSystem.API.Hubs
{
    [Authorize]
    public class ChecklistHub : Hub
    {
    }
}
