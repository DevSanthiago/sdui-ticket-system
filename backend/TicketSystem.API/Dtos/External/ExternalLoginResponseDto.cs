namespace TicketSystem.API.Dtos
{
    public record ExternalLoginResponseDto
    {
        public string? Token { get; init; }
        public string? RefreshToken { get; init; }
        public DateTime RefreshExpires { get; init; }
    }
}