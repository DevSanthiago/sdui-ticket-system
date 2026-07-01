using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace TicketSystem.API.Services.GoogleChat
{
    public class GoogleChatNotifier : IGoogleChatNotifier
    {
        public const string HttpClientName = "GoogleChat";

        private static readonly TimeZoneInfo BrazilTimeZone = ResolveBrazilTimeZone();

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GoogleChatNotifier> _logger;

        public GoogleChatNotifier(IHttpClientFactory httpClientFactory, IConfiguration configuration, ILogger<GoogleChatNotifier> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        public Task NotifyTicketCreatedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default)
            => SendAsync(card with { Event = GoogleChatTicketEvent.Created }, cancellationToken);

        public Task NotifyTicketStartedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default)
            => SendAsync(card with { Event = GoogleChatTicketEvent.Started }, cancellationToken);

        public Task NotifyTicketResolvedAsync(GoogleChatTicketCard card, CancellationToken cancellationToken = default)
            => SendAsync(card with { Event = GoogleChatTicketEvent.Resolved }, cancellationToken);

        private async Task SendAsync(GoogleChatTicketCard card, CancellationToken cancellationToken)
        {
            var webhookUrl = ResolveWebhookUrl(card.DepartmentName);
            if (string.IsNullOrWhiteSpace(webhookUrl))
                return;

            try
            {
                var payload = BuildCardPayload(card);
                var client = _httpClientFactory.CreateClient(HttpClientName);

                var response = await client.PostAsJsonAsync(webhookUrl, payload, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogWarning("Falha ao enviar card do ticket {TicketId} ao Google Chat. Status {Status}. Corpo: {Body}",
                        card.TicketId, (int)response.StatusCode, body);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao notificar o Google Chat sobre o ticket {TicketId}.", card.TicketId);
            }
        }

        private static object BuildCardPayload(GoogleChatTicketCard card)
        {
            var (title, widgets) = card.Event switch
            {
                GoogleChatTicketEvent.Started => BuildStartedCard(card),
                GoogleChatTicketEvent.Resolved => BuildResolvedCard(card),
                _ => BuildCreatedCard(card)
            };

            return new
            {
                cardsV2 = new[]
                {
                    new
                    {
                        cardId = BuildCardId(card),
                        card = new
                        {
                            header = new
                            {
                                title,
                                subtitle = card.DepartmentName
                            },
                            sections = new[]
                            {
                                new { widgets = widgets.ToArray() }
                            }
                        }
                    }
                }
            };
        }

        private static (string Title, List<object> Widgets) BuildCreatedCard(GoogleChatTicketCard card)
        {
            var title = card.TicketId > 0 ? $"🎫 Novo Ticket #{card.TicketId}" : "🎫 Novo Ticket";
            if (!string.IsNullOrWhiteSpace(card.LineName))
                title += $" — {card.LineName}";

            var widgets = new List<object>
            {
                Decorated("Solicitante", string.IsNullOrWhiteSpace(card.RequesterName) ? "—" : card.RequesterName),
                Decorated("Data / Hora", FormatDate(card.CreatedAt)),
                Decorated("Status da linha", card.IsLineStopped ? "🔴 LINHA PARADA" : "🟢 E-Ticket gerado")
            };

            foreach (var field in card.Fields)
            {
                if (string.IsNullOrWhiteSpace(field.Value))
                    continue;
                widgets.Add(Decorated(field.Label, field.Value));
            }

            return (title, widgets);
        }

        private static (string Title, List<object> Widgets) BuildStartedCard(GoogleChatTicketCard card)
        {
            var title = card.TicketId > 0 ? $"🔧 Em Atendimento #{card.TicketId}" : "🔧 Em Atendimento";
            if (!string.IsNullOrWhiteSpace(card.LineName))
                title += $" — {card.LineName}";

            var widgets = new List<object>
            {
                Decorated("Técnico", string.IsNullOrWhiteSpace(card.TechnicianName) ? "—" : card.TechnicianName),
                Decorated("Assumido em", card.StartedAt.HasValue ? FormatDate(card.StartedAt.Value) : "—"),
                Decorated("Solicitante", string.IsNullOrWhiteSpace(card.RequesterName) ? "—" : card.RequesterName)
            };

            return (title, widgets);
        }

        private static (string Title, List<object> Widgets) BuildResolvedCard(GoogleChatTicketCard card)
        {
            var title = card.TicketId > 0 ? $"✅ Atendimento Encerrado #{card.TicketId}" : "✅ Atendimento Encerrado";
            if (!string.IsNullOrWhiteSpace(card.LineName))
                title += $" — {card.LineName}";

            var widgets = new List<object>
            {
                Decorated("Técnico", string.IsNullOrWhiteSpace(card.TechnicianName) ? "—" : card.TechnicianName),
                Decorated("Encerrado em", card.FinishedAt.HasValue ? FormatDate(card.FinishedAt.Value) : "—")
            };

            if (card.StartedAt.HasValue && card.FinishedAt.HasValue)
                widgets.Add(Decorated("Duração", FormatDuration(card.FinishedAt.Value - card.StartedAt.Value)));

            widgets.Add(Decorated("Solicitante", string.IsNullOrWhiteSpace(card.RequesterName) ? "—" : card.RequesterName));

            return (title, widgets);
        }

        private string? ResolveWebhookUrl(string departmentName)
        {
            if (string.IsNullOrWhiteSpace(departmentName))
                return null;

            return _configuration.GetSection("GoogleChat:DepartmentWebhooks")[departmentName];
        }

        private static string BuildCardId(GoogleChatTicketCard card) => card.Event switch
        {
            GoogleChatTicketEvent.Started => $"ticket-{card.TicketId}-started",
            GoogleChatTicketEvent.Resolved => $"ticket-{card.TicketId}-resolved",
            _ => $"ticket-{card.TicketId}"
        };

        private static object Decorated(string topLabel, string text)
            => new { decoratedText = new { topLabel, text } };

        private static string FormatDate(DateTimeOffset createdAt)
        {
            var local = TimeZoneInfo.ConvertTime(createdAt, BrazilTimeZone);
            return local.ToString("dd/MM/yyyy HH:mm", CultureInfo.GetCultureInfo("pt-BR"));
        }

        private static string FormatDuration(TimeSpan duration)
        {
            if (duration < TimeSpan.Zero)
                duration = TimeSpan.Zero;

            var totalMinutes = (int)Math.Round(duration.TotalMinutes);
            var hours = totalMinutes / 60;
            var minutes = totalMinutes % 60;

            return hours > 0 ? $"{hours}h {minutes}min" : $"{minutes}min";
        }

        private static TimeZoneInfo ResolveBrazilTimeZone()
        {
            foreach (var id in new[] { "America/Sao_Paulo", "E. South America Standard Time" })
            {
                try { return TimeZoneInfo.FindSystemTimeZoneById(id); }
                catch (TimeZoneNotFoundException) { }
                catch (InvalidTimeZoneException) { }
            }
            return TimeZoneInfo.Utc;
        }
    }
}
