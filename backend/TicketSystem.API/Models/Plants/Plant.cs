namespace TicketSystem.API.Models
{
    public class Plant
    {
        public int Id { get; private set; }
        public string Name { get; private set; } = string.Empty;
        public string Slug { get; private set; } = string.Empty;
        public bool IsActive { get; private set; } = true;

        public ICollection<Department> Departments { get; private set; } = new List<Department>();
        public ICollection<ProductionLine> ProductionLines { get; private set; } = new List<ProductionLine>();
        public ICollection<LinePrefix> LinePrefixes { get; private set; } = new List<LinePrefix>();
        public ICollection<Ticket> Tickets { get; private set; } = new List<Ticket>();
        public ICollection<ChecklistTemplate> ChecklistTemplates { get; private set; } = new List<ChecklistTemplate>();
        public ICollection<FieldTemplate> FieldTemplates { get; private set; } = new List<FieldTemplate>();
        public ICollection<PlantConnector> PlantConnectors { get; private set; } = new List<PlantConnector>();

        protected Plant() { }

        public Plant(string name, string slug)
        {
            Name = name;
            Slug = slug.ToLower().Trim();
            IsActive = true;
        }

        public void ToggleStatus()
        {
            IsActive = !IsActive;
        }
    }
}