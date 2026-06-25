namespace TicketSystem.API.Models
{
    public class Department
    {
        public int Id { get; private set; }
        
        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public string Name { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public string? CardColorHex { get; private set; }
        public string Badges { get; private set; } = "[]";
        public string IconName { get; private set; } = string.Empty;
        public bool IsActive { get; private set; } = true;
        public string FormSchema { get; private set; } = "{}";
        public string AllowedRoles { get; private set; } = "[]";

        public ICollection<Ticket> Tickets { get; private set; } = new List<Ticket>();

        protected Department() { }

        public Department(int plantId, string name, string? description, string? cardColorHex, string badges, string iconName, string formSchema, string allowedRoles)
        {
            PlantId = plantId;
            Name = name;
            Description = description;
            CardColorHex = cardColorHex;
            Badges = badges;
            IconName = iconName;
            FormSchema = formSchema;
            AllowedRoles = string.IsNullOrWhiteSpace(allowedRoles) ? "[]" : allowedRoles;
        }

        public void Update(string name, string? description, string? cardColorHex, string badges, string iconName, bool isActive)
        {
            Name = name;
            Description = description;
            CardColorHex = cardColorHex;
            Badges = badges;
            IconName = iconName;
            IsActive = isActive;
        }

        public void UpdateSchema(string newSchema)
        {
            FormSchema = newSchema;
        }

        public void UpdateAllowedRoles(string allowedRoles)
        {
            AllowedRoles = string.IsNullOrWhiteSpace(allowedRoles) ? "[]" : allowedRoles;
        }

        public bool CanBeManagedBy(IEnumerable<string> userRoles)
        {
            if (userRoles.Contains("admin"))
                return true;

            try
            {
                var allowedList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(AllowedRoles) ?? new List<string>();
                return userRoles.Any(role => allowedList.Contains(role));
            }
            catch
            {
                return false;
            }
        }

        public void ToggleStatus()
        {
            IsActive = !IsActive;
        }
    }
}