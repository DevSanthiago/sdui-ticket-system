namespace TicketSystem.API.Models
{
    public class LinePrefix
    {
        public int Id { get; private set; }

        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public string Value { get; private set; } = string.Empty;
        public string Label { get; private set; } = string.Empty;
        public bool IsActive { get; private set; } = true;

        protected LinePrefix() { }

        public static LinePrefix Create(int plantId, string value, string label)
        {
            if (plantId <= 0) throw new ArgumentException("A planta é obrigatória.");
            if (string.IsNullOrWhiteSpace(value)) throw new ArgumentException("O valor do prefixo é obrigatório.");

            return new LinePrefix
            {
                PlantId = plantId,
                Value = value.Trim().ToUpper(),
                Label = label.Trim(),
                IsActive = true
            };
        }

        public void Update(string value, string label)
        {
            Value = value.Trim().ToUpper();
            Label = label.Trim();
        }

        public void ToggleStatus()
        {
            IsActive = !IsActive;
        }
    }
}