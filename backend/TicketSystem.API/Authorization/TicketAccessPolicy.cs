using System.Collections.Generic;
using System.Linq;

namespace TicketSystem.API.Authorization
{
    public static class TicketAccessPolicy
    {
        public const string CanManageTickets = "CanManageTickets";

        private static readonly HashSet<string> ViewOnlyRoles = new()
        {
            "productionoperator",
            "productionmonitor",
            "productionleader",
            "qualityoperator",
            "qualityleader",
            "qualityassistant",
            "kioskdisplay"
        };

        public static bool CanManage(IEnumerable<string> roles)
            => roles is not null && roles.Any(role => !IsViewOnly(role));

        public static bool IsViewOnly(string role)
            => ViewOnlyRoles.Contains(Normalize(role));

        private static string Normalize(string role)
            => new string((role ?? string.Empty).Where(char.IsLetterOrDigit).ToArray()).ToLowerInvariant();
    }
}
