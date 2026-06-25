namespace TicketSystem.API.Dtos
{
    public record LoginResponseDto
    {
        public string? Token { get; init; }
        public string? RefreshToken { get; init; }
        public DateTime RefreshExpires { get; init; }
        public string? UserName { get; init; }
        public string? Department { get; init; }
        
        public List<UserRoleResponseDto> Roles { get; init; } = new();
    }
}