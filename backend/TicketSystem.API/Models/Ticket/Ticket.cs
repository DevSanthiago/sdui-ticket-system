using TicketSystem.API.Enums;
using TicketSystem.API.Domain.Exceptions;

namespace TicketSystem.API.Models
{
    public class Ticket
    {
        public int Id { get; private set; }
        
        public int PlantId { get; private set; }
        public Plant Plant { get; private set; } = null!;

        public int DepartmentId { get; private set; }
        public Department Department { get; private set; } = null!;

        public TicketStatus Status { get; private set; } = TicketStatus.Open;

        public int MonitorId { get; private set; }
        public string MonitorName { get; private set; } = string.Empty;

        public int? ProductionLineId { get; private set; }
        public ProductionLine? ProductionLine { get; private set; }

        public bool IsLineStopped { get; private set; }
        public string? LineStoppedTime { get; private set; }

        public int? TechnicianId { get; private set; }
        public string? TechnicianName { get; private set; }

        public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? StartedAt { get; private set; }
        public DateTimeOffset? FinishedAt { get; private set; }

        public string DynamicAnswers { get; private set; } = "{}";

        public string? ResolutionFeedback { get; private set; }

        public ChecklistStatus ChecklistStatus { get; private set; } = ChecklistStatus.NotRequired;
        public string? ChecklistContent { get; private set; }
        public int? ChecklistTemplateId { get; private set; }

        protected Ticket() { }

        public static Ticket Create(int plantId, int departmentId, int monitorId, string monitorName, ProductionLine? line, bool isLineStopped, string? lineStoppedTime, string dynamicAnswers)
        {
            if (plantId <= 0) throw new DomainException("Planta inválida.");
            if (monitorId <= 0) throw new DomainException("Monitor inválido.");

            return new Ticket
            {
                PlantId = plantId,
                DepartmentId = departmentId,
                MonitorId = monitorId,
                MonitorName = monitorName,
                ProductionLineId = line?.Id,
                IsLineStopped = line != null && isLineStopped,
                LineStoppedTime = line != null && isLineStopped ? lineStoppedTime : null,
                DynamicAnswers = string.IsNullOrWhiteSpace(dynamicAnswers) ? "{}" : dynamicAnswers
            };
        }

        public void Start(int technicianId, string technicianName, IEnumerable<string> userRoles)
        {
            if (Status != TicketStatus.Open) 
                throw new DomainException("Este ticket não pode ser mais assumido pois outro técnico já está atendendo ele!");

            if (Department == null)
                throw new DomainException("O departamento associado ao ticket não foi carregado.");

            if (!Department.CanBeManagedBy(userRoles))
                throw new DomainException($"Acesso negado. Sua permissão não permite assumir tickets do departamento: {Department.Name}.");

            TechnicianId = technicianId;
            TechnicianName = technicianName;
            Status = TicketStatus.InProgress;
            StartedAt = DateTimeOffset.UtcNow;
        }

        public void Resolve(int technicianId, string? feedback = null)
        {
            if (Status != TicketStatus.InProgress) 
                throw new DomainException("Você não pode finalizar um ticket que ainda não está em andamento!");
            
            if (TechnicianId != technicianId)
                throw new DomainException("Apenas o técnico que assumiu o ticket pode finalizá-lo!");

            Status = TicketStatus.Resolved;
            FinishedAt = DateTimeOffset.UtcNow;
            
            if (!string.IsNullOrWhiteSpace(feedback))
            {
                ResolutionFeedback = feedback.Trim();
            }
        }
        public void AddResolutionFeedback(string feedback)
        {
            if (!string.IsNullOrWhiteSpace(feedback))
            {
                ResolutionFeedback = feedback.Trim();
            }
        }

        public void RequireChecklist(int checklistTemplateId)
        {
            ChecklistTemplateId = checklistTemplateId;
            ChecklistStatus = ChecklistStatus.Pending;
        }

        public void SubmitChecklist(int monitorId, string content)
        {
            if (ChecklistStatus != ChecklistStatus.Pending)
                throw new DomainException("Este ticket não possui checklist pendente para preenchimento.");

            if (MonitorId != monitorId)
                throw new DomainException("Apenas o solicitante que abriu o ticket pode preencher este checklist.");

            if (string.IsNullOrWhiteSpace(content))
                throw new DomainException("O conteúdo do checklist não pode ser vazio.");

            ChecklistContent = content;
            ChecklistStatus = ChecklistStatus.Completed;
        }
    }
}