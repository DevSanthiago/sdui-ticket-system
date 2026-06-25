namespace TicketSystem.API.Models
{
    public class ProductionLine
    {
        public int Id { get; private set; }

        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public string LineName { get; private set; } = string.Empty;
        public string Prefix { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public bool IsActive { get; private set; } = true;
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; private set; }
        public int CreatedByUserId { get; private set; }
        public int? UpdatedByUserId { get; private set; }

        public ICollection<Ticket> Tickets { get; private set; } = new List<Ticket>();

        protected ProductionLine() { }

        public static ProductionLine Create(int plantId, string lineName, string prefix, string? description, int createdByUserId)
        {
            if (plantId <= 0) throw new ArgumentException("A planta é obrigatória.");
            if (string.IsNullOrWhiteSpace(lineName)) throw new ArgumentException("O nome da linha é obrigatório.");
            if (string.IsNullOrWhiteSpace(prefix)) throw new ArgumentException("O prefixo é obrigatório.");

            return new ProductionLine
            {
                PlantId = plantId,
                LineName = lineName.Trim().ToUpper(),
                Prefix = prefix.Trim().ToUpper(),
                Description = description?.Trim(),
                CreatedByUserId = createdByUserId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
        }

        public void Update(string lineName, string prefix, string? description, int updatedByUserId)
        {
            LineName = lineName.Trim().ToUpper();
            Prefix = prefix.Trim().ToUpper();
            Description = description?.Trim();
            UpdatedByUserId = updatedByUserId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate(int updatedByUserId)
        {
            IsActive = false;
            UpdatedByUserId = updatedByUserId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Activate(int updatedByUserId)
        {
            IsActive = true;
            UpdatedByUserId = updatedByUserId;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}