using TicketSystem.API.Enums;

namespace TicketSystem.API.Models
{
    public class PlantConnector
    {
        public int Id { get; private set; }

        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public ConnectorSource Source { get; private set; }
        public ConnectorPanel Panel { get; private set; }
        public string? Prefix { get; private set; }

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;

        protected PlantConnector() { }

        public PlantConnector(int plantId, ConnectorSource source, string? prefix, ConnectorPanel panel)
        {
            PlantId = plantId;
            Source = source;
            Panel = panel;
            Prefix = string.IsNullOrWhiteSpace(prefix) ? null : prefix.Trim();
        }
    }
}
