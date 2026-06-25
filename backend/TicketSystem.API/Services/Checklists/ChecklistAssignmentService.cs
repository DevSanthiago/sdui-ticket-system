using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Models;

namespace TicketSystem.API.Services.Checklists
{
    public class ChecklistAssignmentService : IChecklistAssignmentService
    {
        private readonly AppDbContext _context;

        public ChecklistAssignmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChecklistTemplate?> FindApplicableTemplateAsync(
            int plantId, int departmentId, string dynamicAnswersJson, CancellationToken cancellationToken)
        {
            var candidates = await _context.ChecklistTemplates
                .Where(c => c.PlantId == plantId
                            && c.IsActive
                            && c.DepartmentId == departmentId
                            && c.TriggerFieldId != null
                            && c.TriggerFieldValue != null)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            if (candidates.Count == 0)
                return null;

            var answers = ParseAnswers(dynamicAnswersJson);

            return candidates.FirstOrDefault(template => template.MatchesTrigger(departmentId, answers));
        }

        private static IReadOnlyDictionary<string, string?> ParseAnswers(string json)
        {
            var dict = new Dictionary<string, string?>();

            if (string.IsNullOrWhiteSpace(json))
                return dict;

            try
            {
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.ValueKind != JsonValueKind.Object)
                    return dict;

                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    dict[prop.Name] = prop.Value.ValueKind switch
                    {
                        JsonValueKind.String => prop.Value.GetString(),
                        JsonValueKind.Number => prop.Value.ToString(),
                        JsonValueKind.True => "true",
                        JsonValueKind.False => "false",
                        JsonValueKind.Null => null,
                        _ => prop.Value.ToString()
                    };
                }
            }
            catch
            {
            }

            return dict;
        }
    }
}
