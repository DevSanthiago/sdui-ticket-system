using System.Collections.Generic;
using System.Reflection;
using System.Text.Json;
using TicketSystem.API.Models;

namespace TicketSystem.API.Services.Checklists
{
    public class ChecklistPdfModelBuilder : IChecklistPdfModelBuilder
    {
        private const string LogoResourceName = "TicketSystem.API.Assets.logo.png";

        private static readonly Lazy<byte[]?> LogoBytes = new(LoadLogo);

        public ChecklistPdfModel Build(Ticket ticket, ChecklistTemplate? template)
        {
            var content = ParseContent(ticket.ChecklistContent);
            var schema = ParseSchema(template?.Schema);

            return new ChecklistPdfModel
            {
                Title = schema.Title,
                DocumentCode = schema.DocumentCode,
                EmissionDate = schema.EmissionDate,
                Revision = schema.Revision,
                ElaboratedBy = schema.ElaboratedBy,
                ApprovedBy = schema.ApprovedBy,
                TicketId = ticket.Id,
                LineName = ticket.ProductionLine?.LineName ?? string.Empty,
                DepartmentName = ticket.Department?.Name,
                SignedBy = content.SignedBy,
                SignedAt = content.SignedAt,
                LogoImage = LogoBytes.Value,
                Fields = BuildFields(schema.Fields, content.Fields),
                Items = BuildItems(schema.Items, content.Checks)
            };
        }

        private static List<ChecklistPdfField> BuildFields(IReadOnlyList<SchemaEntry> schemaFields, JsonElement contentFields)
        {
            var fields = new List<ChecklistPdfField>();
            foreach (var field in schemaFields)
                fields.Add(new ChecklistPdfField(field.Label, GetStringValue(contentFields, field.Id)));
            return fields;
        }

        private static List<ChecklistPdfItem> BuildItems(IReadOnlyList<SchemaEntry> schemaItems, JsonElement contentChecks)
        {
            var items = new List<ChecklistPdfItem>();
            foreach (var item in schemaItems)
                items.Add(new ChecklistPdfItem(item.Label, GetBoolValue(contentChecks, item.Id)));
            return items;
        }

        private static ParsedContent ParseContent(string? checklistContent)
        {
            var parsed = new ParsedContent();
            if (string.IsNullOrWhiteSpace(checklistContent))
                return parsed;

            try
            {
                using var doc = JsonDocument.Parse(checklistContent);
                var root = doc.RootElement;

                if (root.TryGetProperty("fields", out var f) && f.ValueKind == JsonValueKind.Object)
                    parsed.Fields = f.Clone();
                if (root.TryGetProperty("checks", out var c) && c.ValueKind == JsonValueKind.Object)
                    parsed.Checks = c.Clone();
                if (root.TryGetProperty("signedBy", out var sb)) parsed.SignedBy = sb.GetString();
                if (root.TryGetProperty("signedAt", out var sa)) parsed.SignedAt = sa.GetString();
            }
            catch
            {
            }

            return parsed;
        }

        private static ParsedSchema ParseSchema(string? schemaJson)
        {
            var parsed = new ParsedSchema();
            if (string.IsNullOrWhiteSpace(schemaJson))
                return parsed;

            try
            {
                using var doc = JsonDocument.Parse(schemaJson);
                var root = doc.RootElement;

                parsed.Title = GetSchemaString(root, "title") ?? parsed.Title;
                parsed.DocumentCode = GetSchemaString(root, "documentCode");
                parsed.EmissionDate = GetSchemaString(root, "emissionDate");
                parsed.Revision = GetSchemaString(root, "revision");
                parsed.ElaboratedBy = GetSchemaString(root, "elaboratedBy");
                parsed.ApprovedBy = GetSchemaString(root, "approvedBy");
                parsed.Fields = ReadEntries(root, "fields");
                parsed.Items = ReadEntries(root, "items");
            }
            catch
            {
            }

            return parsed;
        }

        private static List<SchemaEntry> ReadEntries(JsonElement root, string propertyName)
        {
            var entries = new List<SchemaEntry>();
            if (!root.TryGetProperty(propertyName, out var array) || array.ValueKind != JsonValueKind.Array)
                return entries;

            foreach (var element in array.EnumerateArray())
            {
                var id = element.TryGetProperty("id", out var fid) ? fid.GetString() : null;
                if (string.IsNullOrWhiteSpace(id)) continue;

                var label = element.TryGetProperty("label", out var fl) ? fl.GetString() : id;
                entries.Add(new SchemaEntry(id!, label ?? id!));
            }

            return entries;
        }

        private static string? GetSchemaString(JsonElement root, string key)
            => root.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.String
                ? value.GetString()
                : null;

        private static string GetStringValue(JsonElement obj, string key)
        {
            if (obj.ValueKind != JsonValueKind.Object || !obj.TryGetProperty(key, out var value))
                return string.Empty;

            return value.ValueKind switch
            {
                JsonValueKind.String => value.GetString() ?? string.Empty,
                JsonValueKind.Number => value.ToString(),
                JsonValueKind.True => "Sim",
                JsonValueKind.False => "Não",
                _ => string.Empty
            };
        }

        private static bool GetBoolValue(JsonElement obj, string key)
            => obj.ValueKind == JsonValueKind.Object
               && obj.TryGetProperty(key, out var value)
               && value.ValueKind == JsonValueKind.True;

        private static byte[]? LoadLogo()
        {
            using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(LogoResourceName);
            if (stream is null)
                return null;

            using var memory = new MemoryStream();
            stream.CopyTo(memory);
            return memory.ToArray();
        }

        private sealed record SchemaEntry(string Id, string Label);

        private sealed class ParsedContent
        {
            public JsonElement Fields { get; set; }
            public JsonElement Checks { get; set; }
            public string? SignedBy { get; set; }
            public string? SignedAt { get; set; }
        }

        private sealed class ParsedSchema
        {
            public string Title { get; set; } = "Checklist";
            public string? DocumentCode { get; set; }
            public string? EmissionDate { get; set; }
            public string? Revision { get; set; }
            public string? ElaboratedBy { get; set; }
            public string? ApprovedBy { get; set; }
            public IReadOnlyList<SchemaEntry> Fields { get; set; } = new List<SchemaEntry>();
            public IReadOnlyList<SchemaEntry> Items { get; set; } = new List<SchemaEntry>();
        }
    }
}
