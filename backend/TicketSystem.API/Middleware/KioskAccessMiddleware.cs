using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace TicketSystem.API.Middleware
{
    public class KioskAccessMiddleware
    {
        private const string KioskRole = "kiosk-display";

        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public KioskAccessMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var user = context.User;

            if (user?.Identity?.IsAuthenticated == true && user.IsInRole(KioskRole))
            {
                var isTicketHub = context.Request.Path.StartsWithSegments("/hubs/tickets");
                var isAuthEndpoint = context.Request.Path.StartsWithSegments("/api/auth");

                var method = context.Request.Method;
                if (!isTicketHub && !isAuthEndpoint
                    && !HttpMethods.IsGet(method) && !HttpMethods.IsHead(method) && !HttpMethods.IsOptions(method))
                {
                    await DenyAsync(context, "Dispositivo kiosk possui acesso somente de leitura.");
                    return;
                }

                var allowedIps = _configuration.GetSection("Kiosk:AllowedIps").Get<string[]>() ?? Array.Empty<string>();
                if (allowedIps.Length > 0)
                {
                    var remoteIp = context.Connection.RemoteIpAddress;
                    if (remoteIp is null || !IsIpAllowed(remoteIp, allowedIps))
                    {
                        await DenyAsync(context, "Acesso kiosk não permitido a partir deste endereço de rede.");
                        return;
                    }
                }
            }

            await _next(context);
        }

        private static async Task DenyAsync(HttpContext context, string message)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            await context.Response.WriteAsJsonAsync(new { message });
        }

        private static bool IsIpAllowed(IPAddress remoteIp, string[] allowedIps)
        {
            var address = remoteIp.IsIPv4MappedToIPv6 ? remoteIp.MapToIPv4() : remoteIp;

            foreach (var entry in allowedIps)
            {
                var trimmed = entry?.Trim();
                if (string.IsNullOrEmpty(trimmed)) continue;

                try
                {
                    if (trimmed.Contains('/'))
                    {
                        if (IPNetwork.Parse(trimmed).Contains(address))
                            return true;
                    }
                    else if (IPAddress.TryParse(trimmed, out var single))
                    {
                        var normalized = single.IsIPv4MappedToIPv6 ? single.MapToIPv4() : single;
                        if (normalized.Equals(address))
                            return true;
                    }
                }
                catch
                {
                }
            }

            return false;
        }
    }
}
