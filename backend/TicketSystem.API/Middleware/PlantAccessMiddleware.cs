using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace TicketSystem.API.Middleware
{
    public class PlantAccessMiddleware
    {
        private const string PlantHeader = "X-Plant-Id";
        private const string PlantClaim = "PlantId";
        private const string AdminRole = "admin";
        private const string DeniedMessage = "Somente administradores podem alternar entre filiais dentro do Ticket System.";

        private readonly RequestDelegate _next;

        public PlantAccessMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path;
            if (path.StartsWithSegments("/api/plants") || path.StartsWithSegments("/api/auth"))
            {
                await _next(context);
                return;
            }

            var user = context.User;

            if (user?.Identity?.IsAuthenticated == true && !user.IsInRole(AdminRole))
            {
                var requestedPlant = context.Request.Headers[PlantHeader].ToString();
                var allowedPlant = user.FindFirst(PlantClaim)?.Value;

                if (!string.IsNullOrEmpty(requestedPlant)
                    && !string.IsNullOrEmpty(allowedPlant)
                    && requestedPlant != allowedPlant)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { message = DeniedMessage });
                    return;
                }
            }

            await _next(context);
        }
    }
}
