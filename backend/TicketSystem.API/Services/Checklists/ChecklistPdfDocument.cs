using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace TicketSystem.API.Services.Checklists
{
    public class ChecklistPdfDocument : IDocument
    {
        private const string BrandBlue = "#2B6CB0";
        private const string LightBlue = "#EBF8FF";
        private const string BorderGrey = "#CBD5E0";
        private const string SubtleGrey = "#F7FAFC";

        private readonly ChecklistPdfModel _model;

        public ChecklistPdfDocument(ChecklistPdfModel model)
        {
            _model = model;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(9).FontColor("#1A202C"));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
        }

        private void ComposeHeader(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Border(1).BorderColor(BorderGrey).Padding(10).Row(row =>
                {
                    row.ConstantItem(130).AlignLeft().AlignMiddle().Height(34).Element(logo =>
                    {
                        if (_model.LogoImage is { Length: > 0 } bytes)
                            logo.AlignLeft().Image(bytes).FitArea();
                    });

                    row.RelativeItem().AlignMiddle().Column(col =>
                    {
                        col.Item().AlignCenter().Text(_model.Title).FontSize(14).Bold().FontColor(BrandBlue);
                        if (!string.IsNullOrWhiteSpace(_model.DepartmentName))
                            col.Item().AlignCenter().Text(_model.DepartmentName!).FontSize(9).FontColor(Colors.Grey.Darken1);
                    });

                    row.ConstantItem(130).AlignRight().AlignMiddle().Column(col =>
                    {
                        if (!string.IsNullOrWhiteSpace(_model.DocumentCode))
                            col.Item().AlignRight().Text(_model.DocumentCode!).FontSize(13).Bold();
                        col.Item().AlignRight().Text($"Ticket #{_model.TicketId}").FontSize(9).FontColor(Colors.Grey.Darken1);
                        if (!string.IsNullOrWhiteSpace(_model.LineName))
                            col.Item().AlignRight().Text(_model.LineName).FontSize(9).FontColor(Colors.Grey.Darken1);
                    });
                });

                if (HasMetadata())
                    column.Item().Element(ComposeMetadataBar);
            });
        }

        private bool HasMetadata()
            => !string.IsNullOrWhiteSpace(_model.EmissionDate)
               || !string.IsNullOrWhiteSpace(_model.Revision)
               || !string.IsNullOrWhiteSpace(_model.ElaboratedBy)
               || !string.IsNullOrWhiteSpace(_model.ApprovedBy);

        private void ComposeMetadataBar(IContainer container)
        {
            container.Background(LightBlue).BorderHorizontal(1).BorderColor(BorderGrey)
                .PaddingVertical(5).PaddingHorizontal(10).Row(row =>
            {
                MetadataCell(row, "Emissão", _model.EmissionDate);
                MetadataCell(row, "Revisão", _model.Revision);
                MetadataCell(row, "Elaborado por", _model.ElaboratedBy);
                MetadataCell(row, "Aprovado por", _model.ApprovedBy);
            });
        }

        private static void MetadataCell(RowDescriptor row, string label, string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return;

            row.RelativeItem().Column(col =>
            {
                col.Item().Text(label.ToUpperInvariant()).FontSize(7).FontColor(Colors.Grey.Darken1).LetterSpacing(0.05f);
                col.Item().Text(value!).FontSize(9).SemiBold();
            });
        }

        private void ComposeContent(IContainer container)
        {
            container.PaddingTop(14).Column(column =>
            {
                column.Spacing(16);

                if (_model.Fields.Count > 0)
                    column.Item().Element(ComposeFields);

                if (_model.Items.Count > 0)
                    column.Item().Element(ComposeItems);

                if (!string.IsNullOrWhiteSpace(_model.SignedBy))
                    column.Item().Element(ComposeSignature);
            });
        }

        private void ComposeFields(IContainer container)
        {
            container.Border(1).BorderColor(BorderGrey).Column(column =>
            {
                foreach (var (field, index) in _model.Fields.Select((f, i) => (f, i)))
                {
                    column.Item()
                        .Background(index % 2 == 0 ? SubtleGrey : Colors.White)
                        .BorderBottom(index < _model.Fields.Count - 1 ? 1 : 0).BorderColor(BorderGrey)
                        .PaddingVertical(6).PaddingHorizontal(10).Row(row =>
                    {
                        row.ConstantItem(170).Text(field.Label).SemiBold();
                        row.RelativeItem().Text(string.IsNullOrWhiteSpace(field.Value) ? "—" : field.Value);
                    });
                }
            });
        }

        private void ComposeItems(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().PaddingBottom(6).Text("Itens de Verificação").FontSize(11).Bold().FontColor(BrandBlue);

                var half = (_model.Items.Count + 1) / 2;
                var left = _model.Items.Take(half).ToList();
                var right = _model.Items.Skip(half).ToList();

                column.Item().Row(row =>
                {
                    row.RelativeItem().PaddingRight(8).Element(c => ComposeItemColumn(c, left));
                    row.RelativeItem().PaddingLeft(8).Element(c => ComposeItemColumn(c, right));
                });
            });
        }

        private static void ComposeItemColumn(IContainer container, List<ChecklistPdfItem> items)
        {
            container.Column(column =>
            {
                column.Spacing(3);
                foreach (var item in items)
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(20).AlignTop().Text(item.Checked ? "[X]" : "[ ]").FontFamily(Fonts.Consolas)
                            .FontColor(item.Checked ? BrandBlue : Colors.Grey.Medium);
                        row.RelativeItem().Text(item.Label).FontSize(8.5f);
                    });
                }
            });
        }

        private void ComposeSignature(IContainer container)
        {
            container.PaddingTop(8).Background(SubtleGrey).Border(1).BorderColor(BorderGrey).Padding(10).Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("Responsável pelo preenchimento").FontSize(7).FontColor(Colors.Grey.Darken1).LetterSpacing(0.05f);
                    col.Item().Text(_model.SignedBy!).FontSize(11).SemiBold();
                });

                if (!string.IsNullOrWhiteSpace(_model.SignedAt))
                {
                    row.ConstantItem(200).AlignRight().Column(col =>
                    {
                        col.Item().AlignRight().Text("DATA / HORA").FontSize(7).FontColor(Colors.Grey.Darken1).LetterSpacing(0.05f);
                        col.Item().AlignRight().Text(_model.SignedAt!).FontSize(11).SemiBold();
                    });
                }
            });
        }

        private void ComposeFooter(IContainer container)
        {
            container.PaddingTop(8).BorderTop(1).BorderColor(BorderGrey).PaddingTop(4).Row(row =>
            {
                row.RelativeItem().Text("Ticket System").FontSize(8).FontColor(Colors.Grey.Darken1);
                row.RelativeItem().AlignCenter().Text(text =>
                {
                    text.DefaultTextStyle(x => x.FontSize(8).FontColor(Colors.Grey.Darken1));
                    text.Span("Página ");
                    text.CurrentPageNumber();
                    text.Span(" de ");
                    text.TotalPages();
                });
                row.RelativeItem().AlignRight().Text($"Gerado em {System.DateTime.Now:dd/MM/yyyy HH:mm}")
                    .FontSize(8).FontColor(Colors.Grey.Darken1);
            });
        }
    }
}
