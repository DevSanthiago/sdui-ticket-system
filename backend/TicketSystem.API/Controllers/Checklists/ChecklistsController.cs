using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Enums;
using TicketSystem.API.Models;
using TicketSystem.API.Domain.Exceptions;
using TicketSystem.API.Services;
using TicketSystem.API.Services.Checklists;
using TicketSystem.API.Services.Realtime;
using System.Security.Claims;
using System.Text.Json;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/checklists")]
    [Authorize]
    public class ChecklistsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;
        private readonly IChecklistPdfModelBuilder _pdfModelBuilder;
        private readonly IChecklistNotifier _checklistNotifier;

        public ChecklistsController(AppDbContext context, IUserContext userContext, IChecklistPdfModelBuilder pdfModelBuilder, IChecklistNotifier checklistNotifier)
        {
            _context = context;
            _userContext = userContext;
            _pdfModelBuilder = pdfModelBuilder;
            _checklistNotifier = checklistNotifier;
        }

        [HttpGet("pending-status")]
        public async Task<IActionResult> GetPendingStatus()
        {
            var userId = GetCurrentUserId();

            var pending = await _context.Tickets
                .Where(t => t.MonitorId == userId && t.ChecklistStatus == ChecklistStatus.Pending)
                .OrderBy(t => t.CreatedAt)
                .Select(t => new { t.Id })
                .FirstOrDefaultAsync();

            return Ok(new { hasPending = pending != null, pendingTicketId = pending?.Id });
        }

        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox()
        {
            int currentPlantId = _userContext.GetPlantId();
            var userId = GetCurrentUserId();

            var relevant = await _context.Tickets
                .Where(t => t.PlantId == currentPlantId
                            && t.ChecklistStatus != ChecklistStatus.NotRequired
                            && ((t.MonitorId == userId && t.ChecklistStatus == ChecklistStatus.Pending)
                                || (t.TechnicianId == userId && t.ChecklistStatus == ChecklistStatus.Completed)))
                .Include(t => t.Department)
                .Include(t => t.ProductionLine)
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();

            var toFill = relevant
                .Where(t => t.MonitorId == userId && t.ChecklistStatus == ChecklistStatus.Pending)
                .Select(MapInboxItem)
                .ToList();

            var received = relevant
                .Where(t => t.TechnicianId == userId && t.ChecklistStatus == ChecklistStatus.Completed)
                .Select(MapInboxItem)
                .ToList();

            return Ok(new
            {
                toFill,
                received,
                counts = new { toFill = toFill.Count, received = received.Count }
            });
        }

        private static object MapInboxItem(Ticket t) => new
        {
            id = t.Id,
            departmentId = t.DepartmentId,
            departmentName = t.Department?.Name,
            lineName = t.ProductionLine?.LineName,
            monitorName = t.MonitorName,
            technicianName = t.TechnicianName,
            checklistStatus = (int)t.ChecklistStatus,
            checklistTemplateId = t.ChecklistTemplateId,
            checklistContent = t.ChecklistContent,
            dynamicAnswers = ParseDynamicAnswers(t.DynamicAnswers),
            createdAt = t.CreatedAt,
            startedAt = t.StartedAt,
            finishedAt = t.FinishedAt
        };

        private static object ParseDynamicAnswers(string json)
        {
            if (string.IsNullOrWhiteSpace(json)) return new object();
            try
            {
                return JsonSerializer.Deserialize<object>(json) ?? new object();
            }
            catch
            {
                return new object();
            }
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitChecklist([FromBody] SubmitChecklistDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == dto.TicketId);
                if (ticket == null)
                    return NotFound(new { message = "Ticket não encontrado." });

                ticket.SubmitChecklist(userId, dto.ChecklistContent);
                await _context.SaveChangesAsync();

                await _checklistNotifier.NotifyChangedAsync(ticket.MonitorId, ticket.TechnicianId ?? 0);

                return Ok(new { message = "Checklist enviado com sucesso!" });
            }
            catch (DomainException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao enviar o checklist.", details = ex.Message });
            }
        }

        [HttpGet("{ticketId}/pdf")]
        public async Task<IActionResult> DownloadPdf(int ticketId)
        {
            int currentPlantId = _userContext.GetPlantId();

            var ticket = await _context.Tickets
                .Include(t => t.ProductionLine)
                .Include(t => t.Department)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == ticketId && t.PlantId == currentPlantId);

            if (ticket == null)
                return NotFound(new { message = "Ticket não encontrado nesta unidade." });

            if (string.IsNullOrWhiteSpace(ticket.ChecklistContent))
                return BadRequest(new { message = "Este ticket não possui um checklist preenchido." });

            ChecklistTemplate? template = null;
            if (ticket.ChecklistTemplateId is int templateId)
            {
                template = await _context.ChecklistTemplates
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == templateId);
            }

            var model = _pdfModelBuilder.Build(ticket, template);
            var bytes = new ChecklistPdfDocument(model).GeneratePdf();

            return File(bytes, "application/pdf", $"checklist_{ticketId}.pdf");
        }

        private int GetCurrentUserId()
        {
            var idString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(idString, out int userId))
                throw new UnauthorizedAccessException("Usuário inválido ou não autenticado.");
            return userId;
        }
    }
}
