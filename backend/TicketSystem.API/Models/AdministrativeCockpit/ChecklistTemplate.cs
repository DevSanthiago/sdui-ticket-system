namespace TicketSystem.API.Models
{
    public class ChecklistTemplate
    {
        public int Id { get; private set; }

        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public string Name { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public string? CardColorHex { get; private set; }
        public string IconName { get; private set; } = string.Empty;
        public bool IsActive { get; private set; } = true;
        public string Schema { get; private set; } = "{}";
        public string AllowedRoles { get; private set; } = "[]";

        public int? DepartmentId { get; private set; }
        public string? TriggerFieldId { get; private set; }
        public string? TriggerFieldValue { get; private set; }

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? UpdatedAt { get; private set; }

        protected ChecklistTemplate() { }

        public ChecklistTemplate(int plantId, string name, string? description, string? cardColorHex, string iconName, string schema, string allowedRoles,
            int? departmentId = null, string? triggerFieldId = null, string? triggerFieldValue = null)
        {
            PlantId = plantId;
            Name = name;
            Description = description;
            CardColorHex = cardColorHex;
            IconName = iconName;
            Schema = string.IsNullOrWhiteSpace(schema) ? "{}" : schema;
            AllowedRoles = string.IsNullOrWhiteSpace(allowedRoles) ? "[]" : allowedRoles;
            DepartmentId = departmentId;
            TriggerFieldId = string.IsNullOrWhiteSpace(triggerFieldId) ? null : triggerFieldId;
            TriggerFieldValue = string.IsNullOrWhiteSpace(triggerFieldValue) ? null : triggerFieldValue;
        }

        public void Update(string name, string? description, string? cardColorHex, string iconName, bool isActive)
        {
            Name = name;
            Description = description;
            CardColorHex = cardColorHex;
            IconName = iconName;
            IsActive = isActive;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void UpdateTrigger(int? departmentId, string? triggerFieldId, string? triggerFieldValue)
        {
            DepartmentId = departmentId;
            TriggerFieldId = string.IsNullOrWhiteSpace(triggerFieldId) ? null : triggerFieldId;
            TriggerFieldValue = string.IsNullOrWhiteSpace(triggerFieldValue) ? null : triggerFieldValue;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public bool MatchesTrigger(int ticketDepartmentId, IReadOnlyDictionary<string, string?> dynamicAnswers)
        {
            if (!IsActive) return false;
            if (DepartmentId is null || DepartmentId != ticketDepartmentId) return false;
            if (string.IsNullOrWhiteSpace(TriggerFieldId) || string.IsNullOrWhiteSpace(TriggerFieldValue)) return false;

            return dynamicAnswers.TryGetValue(TriggerFieldId, out var value)
                   && string.Equals(value, TriggerFieldValue, StringComparison.OrdinalIgnoreCase);
        }

        public void UpdateSchema(string newSchema)
        {
            Schema = string.IsNullOrWhiteSpace(newSchema) ? "{}" : newSchema;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void UpdateAllowedRoles(string allowedRoles)
        {
            AllowedRoles = string.IsNullOrWhiteSpace(allowedRoles) ? "[]" : allowedRoles;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public void ToggleStatus()
        {
            IsActive = !IsActive;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public bool CanBeManagedBy(IEnumerable<string> userRoles)
        {
            if (userRoles.Contains("admin") || userRoles.Contains("specialist"))
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
    }
}
