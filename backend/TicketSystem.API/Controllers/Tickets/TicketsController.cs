using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Data;
using TicketSystem.API.Dtos;
using TicketSystem.API.Enums;
using TicketSystem.API.Models;
using TicketSystem.API.Domain.Exceptions;
using TicketSystem.API.Services;
using TicketSystem.API.Services.Checklists;
using TicketSystem.API.Services.Realtime;
using TicketSystem.API.Services.GoogleChat;
using TicketSystem.API.Authorization;
using System.Security.Claims;
using System.Text.Json;

namespace TicketSystem.API.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUserContext _userContext;
        private readonly IChecklistAssignmentService _checklistAssignment;
        private readonly IChecklistNotifier _checklistNotifier;
        private readonly ITicketNotifier _ticketNotifier;
        private readonly IGoogleChatNotifier _googleChatNotifier;

        public TicketsController(AppDbContext context, IUserContext userContext, IChecklistAssignmentService checklistAssignment, IChecklistNotifier checklistNotifier, ITicketNotifier ticketNotifier, IGoogleChatNotifier googleChatNotifier)
        {
            _context = context;
            _userContext = userContext;
            _checklistAssignment = checklistAssignment;
            _checklistNotifier = checklistNotifier;
            _ticketNotifier = ticketNotifier;
            _googleChatNotifier = googleChatNotifier;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();

                var tickets = await _context.Tickets
                    .Where(t => t.PlantId == currentPlantId)
                    .Include(t => t.Department)
                    .Include(t => t.ProductionLine)
                    .OrderByDescending(t => t.CreatedAt)
                    .AsNoTracking()
                    .ToListAsync();

                var response = tickets.Select(t => new
                {
                    id = t.Id,
                    departmentId = t.DepartmentId,
                    departmentName = t.Department?.Name,
                    lineName = t.ProductionLine?.LineName,
                    monitorName = t.MonitorName,
                    technicianName = t.TechnicianName,
                    isLineStopped = t.IsLineStopped,
                    lineStoppedTime = t.LineStoppedTime,
                    status = (int)t.Status,
                    createdAt = t.CreatedAt,
                    startedAt = t.StartedAt,
                    finishedAt = t.FinishedAt,
                    resolutionFeedback = t.ResolutionFeedback,
                    checklistStatus = (int)t.ChecklistStatus,
                    checklistTemplateId = t.ChecklistTemplateId,
                    checklistContent = t.ChecklistContent,
                    dynamicAnswers = ParseDynamicAnswers(t.DynamicAnswers)
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao buscar tickets.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                if (currentPlantId <= 0) 
                    return BadRequest(new { message = "Contexto de unidade (Fábrica) não informado ou inválido." });

                var (monitorId, monitorName) = GetCurrentUser();

                var pendingChecklist = await _context.Tickets
                    .Where(t => t.MonitorId == monitorId && t.ChecklistStatus == ChecklistStatus.Pending)
                    .Select(t => new { t.Id })
                    .FirstOrDefaultAsync();

                if (pendingChecklist != null)
                {
                    return BadRequest(new
                    {
                        message = "Você possui um checklist pendente de preenchimento. Conclua-o na Caixa de Entrada antes de abrir um novo ticket.",
                        code = "CHECKLIST_PENDING",
                        pendingTicketId = pendingChecklist.Id
                    });
                }

                ProductionLine? productionLine = null;
                if (dto.ProductionLineId.HasValue)
                {
                    productionLine = await _context.ProductionLines
                        .FirstOrDefaultAsync(pl => pl.Id == dto.ProductionLineId.Value && pl.PlantId == currentPlantId);

                    if (productionLine == null)
                        return NotFound(new { message = "Linha de produção não encontrada para esta unidade." });
                }

                string dynamicAnswersJson = "{}";
                if (dto.DynamicAnswers.ValueKind != JsonValueKind.Undefined && dto.DynamicAnswers.ValueKind != JsonValueKind.Null)
                {
                    dynamicAnswersJson = JsonSerializer.Serialize(dto.DynamicAnswers);
                }

                var ticket = Ticket.Create(
                    plantId: currentPlantId,
                    departmentId: dto.DepartmentId,
                    monitorId: monitorId,
                    monitorName: monitorName,
                    line: productionLine,
                    isLineStopped: dto.IsLineStopped,
                    lineStoppedTime: dto.LineStoppedTime,
                    dynamicAnswers: dynamicAnswersJson
                );

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                await _ticketNotifier.NotifyTicketCreatedAsync(currentPlantId, ticket.Id, ticket.DepartmentId);

                var department = await _context.Departments
                    .AsNoTracking()
                    .FirstOrDefaultAsync(d => d.Id == ticket.DepartmentId && d.PlantId == currentPlantId);

                await _googleChatNotifier.NotifyTicketCreatedAsync(new GoogleChatTicketCard
                {
                    TicketId = ticket.Id,
                    DepartmentName = department?.Name ?? "Departamento",
                    LineName = productionLine?.LineName,
                    RequesterName = monitorName,
                    CreatedAt = ticket.CreatedAt,
                    IsLineStopped = ticket.IsLineStopped,
                    Fields = BuildChatFields(department?.FormSchema, dynamicAnswersJson, productionLine?.LineName)
                }, HttpContext.RequestAborted);

                return CreatedAtAction(nameof(GetAllTickets), new { id = ticket.Id }, new
                { 
                    message = "Ticket aberto com sucesso!",
                    ticketId = ticket.Id,
                    lineName = productionLine?.LineName
                });
            }
            catch (DomainException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao criar o ticket.", details = ex.Message });
            }
        }

        [HttpPut("{id}/start")]
        [Authorize(Policy = TicketAccessPolicy.CanManageTickets)]
        public async Task<IActionResult> StartTicket(int id)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                var (technicianId, technicianName) = GetCurrentUser();

                bool hasTicketInProgress = await _context.Tickets
                    .AnyAsync(t => t.TechnicianId == technicianId 
                                && t.Status == TicketStatus.InProgress 
                                && t.PlantId == currentPlantId);

                if (hasTicketInProgress)
                {
                    return BadRequest(new { 
                        message = "Controle de Downtime (WIP): Você já possui um ticket em atendimento. Por favor, finalize-o antes de assumir um novo ticket." 
                    });
                }
        
                var userRoles = User.Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList();

                var ticket = await _context.Tickets
                    .Include(t => t.Department)
                    .Include(t => t.ProductionLine)
                    .FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId);

                if (ticket == null)
                    return NotFound(new { message = "Ticket não encontrado nesta unidade." });

                if (ticket.Department == null)
                    return BadRequest(new { message = "Ticket inválido: Departamento não associado." });

                ticket.Start(technicianId, technicianName, userRoles);

                await _context.SaveChangesAsync();

                await _googleChatNotifier.NotifyTicketStartedAsync(new GoogleChatTicketCard
                {
                    TicketId = ticket.Id,
                    DepartmentName = ticket.Department.Name,
                    LineName = ticket.ProductionLine?.LineName,
                    RequesterName = ticket.MonitorName,
                    TechnicianName = ticket.TechnicianName,
                    StartedAt = ticket.StartedAt
                }, HttpContext.RequestAborted);

                return Ok(new { message = "Ticket assumido com sucesso!" });
            }
            catch (DomainException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao iniciar o ticket.", details = ex.Message });
            }
        }

        [HttpPut("{id}/resolve")]
        [Authorize(Policy = TicketAccessPolicy.CanManageTickets)]
        public async Task<IActionResult> ResolveTicket(int id)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                var (technicianId, _) = GetCurrentUser();

                var ticket = await _context.Tickets
                    .Include(t => t.Department)
                    .Include(t => t.ProductionLine)
                    .FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId);

                if (ticket == null)
                    return NotFound(new { message = "Ticket não encontrado nesta unidade." });

                ticket.Resolve(technicianId);

                var applicableTemplate = await _checklistAssignment.FindApplicableTemplateAsync(
                    currentPlantId, ticket.DepartmentId, ticket.DynamicAnswers, HttpContext.RequestAborted);

                if (applicableTemplate != null)
                    ticket.RequireChecklist(applicableTemplate.Id);

                await _context.SaveChangesAsync();

                if (applicableTemplate != null)
                    await _checklistNotifier.NotifyChangedAsync(ticket.MonitorId);

                await _googleChatNotifier.NotifyTicketResolvedAsync(new GoogleChatTicketCard
                {
                    TicketId = ticket.Id,
                    DepartmentName = ticket.Department?.Name ?? "Departamento",
                    LineName = ticket.ProductionLine?.LineName,
                    RequesterName = ticket.MonitorName,
                    TechnicianName = ticket.TechnicianName,
                    StartedAt = ticket.StartedAt,
                    FinishedAt = ticket.FinishedAt
                }, HttpContext.RequestAborted);

                return Ok(new
                {
                    message = "Ticket finalizado com sucesso!",
                    checklistGenerated = applicableTemplate != null
                });
            }
            catch (DomainException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao finalizar o ticket.", details = ex.Message });
            }
        }

        [HttpPatch("{id}/feedback")]
        [Authorize(Policy = TicketAccessPolicy.CanManageTickets)]
        public async Task<IActionResult> AddFeedback(int id, [FromBody] ResolveTicketDto dto)
        {
            try
            {
                int currentPlantId = _userContext.GetPlantId();
                var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id && t.PlantId == currentPlantId); 

                if (ticket == null) 
                    return NotFound(new { message = "Ticket não encontrado." });

                if (!string.IsNullOrWhiteSpace(dto.Feedback))
                {
                    ticket.AddResolutionFeedback(dto.Feedback);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Feedback salvo com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno ao salvar o feedback.", details = ex.Message });
            }
        }

        private (int UserId, string UserName) GetCurrentUser()
        {
            var idString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var name = User.FindFirst(ClaimTypes.Name)?.Value ?? "Usuário Desconhecido";

            if (!int.TryParse(idString, out int userId))
                throw new UnauthorizedAccessException("Usuário inválido ou não autenticado.");

            return (userId, name);
        }

        private static List<GoogleChatTicketField> BuildChatFields(string? formSchemaJson, string answersJson, string? lineName)
        {
            var fields = new List<GoogleChatTicketField>();

            if (string.IsNullOrWhiteSpace(formSchemaJson) || string.IsNullOrWhiteSpace(answersJson))
                return fields;

            try
            {
                using var schemaDoc = JsonDocument.Parse(formSchemaJson);
                using var answersDoc = JsonDocument.Parse(answersJson);

                if (!schemaDoc.RootElement.TryGetProperty("fields", out var schemaFields)
                    || schemaFields.ValueKind != JsonValueKind.Array)
                    return fields;

                var answers = answersDoc.RootElement;

                foreach (var field in schemaFields.EnumerateArray())
                {
                    if (!field.TryGetProperty("id", out var idElement)) continue;
                    var id = idElement.GetString();
                    if (string.IsNullOrEmpty(id)) continue;

                    if (answers.ValueKind != JsonValueKind.Object
                        || !answers.TryGetProperty(id, out var answerElement))
                        continue;

                    var label = field.TryGetProperty("label", out var labelElement)
                        ? labelElement.GetString() ?? id
                        : id;

                    var type = field.TryGetProperty("type", out var typeElement)
                        ? typeElement.GetString() ?? string.Empty
                        : string.Empty;

                    var value = StringifyAnswer(answerElement);
                    if (string.IsNullOrWhiteSpace(value)) continue;

                    if ((type == "dynamic_location" || type == "line") && !string.IsNullOrWhiteSpace(lineName))
                        value = lineName!;
                    else
                        value = ResolveOptionLabel(field, value);

                    fields.Add(new GoogleChatTicketField(label, value));
                }
            }
            catch
            {
                return fields;
            }

            return fields;
        }

        private static string StringifyAnswer(JsonElement answer)
        {
            switch (answer.ValueKind)
            {
                case JsonValueKind.True:
                    return "Sim";
                case JsonValueKind.False:
                    return "Não";
                case JsonValueKind.String:
                    return answer.GetString() ?? string.Empty;
                case JsonValueKind.Number:
                    return answer.GetRawText();
                case JsonValueKind.Array:
                    return string.Join(", ", answer.EnumerateArray().Select(StringifyAnswer).Where(v => !string.IsNullOrWhiteSpace(v)));
                default:
                    return string.Empty;
            }
        }

        private static string ResolveOptionLabel(JsonElement field, string value)
        {
            if (!field.TryGetProperty("options", out var options) || options.ValueKind != JsonValueKind.Array)
                return value;

            foreach (var option in options.EnumerateArray())
            {
                if (option.TryGetProperty("value", out var optValue)
                    && string.Equals(StringifyAnswer(optValue), value, StringComparison.Ordinal)
                    && option.TryGetProperty("label", out var optLabel))
                {
                    return optLabel.GetString() ?? value;
                }
            }

            return value;
        }

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
    }
}