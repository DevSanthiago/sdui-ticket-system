namespace TicketSystem.API.Models
{
    public class FieldTemplate
    {
        public int Id { get; private set; }

        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public string Name { get; private set; } = string.Empty;
        public string Schema { get; private set; } = "{}";

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedAt { get; private set; }

        protected FieldTemplate() { }

        public FieldTemplate(int plantId, string name, string schema)
        {
            PlantId = plantId;
            Name = name;
            Schema = string.IsNullOrWhiteSpace(schema) ? "{}" : schema;
        }

        public void UpdateName(string name)
        {
            Name = name;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void UpdateSchema(string newSchema)
        {
            Schema = string.IsNullOrWhiteSpace(newSchema) ? "{}" : newSchema;
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }
}
