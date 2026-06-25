using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/plants")]
    public class PlantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlantsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllActivePlants()
        {
            try
            {
                var plants = await _context.Plants
                    .Where(p => p.IsActive)
                    .AsNoTracking()
                    .Select(p => new PlantResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Slug = p.Slug,
                        IsActive = p.IsActive
                    })
                    .OrderBy(p => p.Name)
                    .ToListAsync();

                return Ok(plants);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar unidades.", details = ex.Message });
            }
        }
    }
}