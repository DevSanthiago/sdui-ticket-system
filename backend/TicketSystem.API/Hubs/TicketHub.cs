using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TicketSystem.API.Hubs
{
    [Authorize]
    public class TicketHub : Hub
    {
        private const string AdminRole = "admin";
        private const string PlantClaim = "PlantId";

        public static string PlantGroup(int plantId) => $"plant-{plantId}";

        public override async Task OnConnectedAsync()
        {
            var plantId = ResolvePlantId();
            if (plantId > 0)
                await Groups.AddToGroupAsync(Context.ConnectionId, PlantGroup(plantId));

            await base.OnConnectedAsync();
        }

        private int ResolvePlantId()
        {
            var requested = Context.GetHttpContext()?.Request.Query["plantId"].ToString();
            var claim = Context.User?.FindFirst(PlantClaim)?.Value;

            var isMaster = Context.User?.IsInRole(AdminRole) == true;

            var chosen = isMaster && !string.IsNullOrEmpty(requested) ? requested : claim;

            return int.TryParse(chosen, out var id) ? id : 0;
        }
    }
}
