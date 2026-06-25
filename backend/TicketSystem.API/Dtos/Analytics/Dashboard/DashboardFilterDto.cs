using System;

namespace TicketSystem.API.Dtos.Analytics.Dashboard;

public record DashboardFilterDto(
    DateTime? StartDate,
    DateTime? EndDate,
    int? PlantId,
    int? DepartmentId,
    string? GroupBy,
    string? Preset,
    string? Shift
);