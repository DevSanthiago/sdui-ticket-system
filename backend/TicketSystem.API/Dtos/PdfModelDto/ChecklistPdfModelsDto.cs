namespace TicketSystem.API.Dtos
{
    public record ChecklistContentData
    {
        public string ProdutoAtual { get; init; } = string.Empty;
        public string ProdutoSetup { get; init; } = string.Empty;
        public string LiderLinha { get; init; } = string.Empty;
        public string Observacao { get; init; } = string.Empty;
        public List<bool> Checks { get; init; } = new(); 
        public string AssinadoPor { get; init; } = string.Empty;
        public string DataAssinatura { get; init; } = string.Empty;
    }
}