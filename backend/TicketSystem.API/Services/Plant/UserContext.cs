using Microsoft.AspNetCore.Http;

namespace TicketSystem.API.Services
{
    public class UserContext : IUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContext(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetPlantId()
        {
            var headerValue = _httpContextAccessor.HttpContext?.Request.Headers["X-Plant-Id"].ToString();

            if (int.TryParse(headerValue, out int plantId))
            {
                return plantId;
            }

            return 0; 
        }
    }
}