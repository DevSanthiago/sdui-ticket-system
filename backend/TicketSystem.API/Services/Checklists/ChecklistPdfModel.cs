using System.Collections.Generic;

namespace TicketSystem.API.Services.Checklists
{
    public record ChecklistPdfField(string Label, string Value);
    public record ChecklistPdfItem(string Label, bool Checked);

    public class ChecklistPdfModel
    {
        public string Title { get; init; } = "Checklist";
        public string? DocumentCode { get; init; }
        public string? EmissionDate { get; init; }
        public string? Revision { get; init; }
        public string? ElaboratedBy { get; init; }
        public string? ApprovedBy { get; init; }
        public int TicketId { get; init; }
        public string LineName { get; init; } = string.Empty;
        public string? DepartmentName { get; init; }
        public string? SignedBy { get; init; }
        public string? SignedAt { get; init; }
        public byte[]? LogoImage { get; init; }
        public List<ChecklistPdfField> Fields { get; init; } = new();
        public List<ChecklistPdfItem> Items { get; init; } = new();
    }
}
