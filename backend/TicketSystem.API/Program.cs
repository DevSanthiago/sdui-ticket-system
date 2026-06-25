using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TicketSystem.API.Services;
using TicketSystem.API.Services.Analytics;
using TicketSystem.API.Services.Analytics.HistoricalDashboard;
using TicketSystem.API.Services.Analytics.LiveDashboard;
using TicketSystem.API.Services.Analytics.ExpandedView;
using TicketSystem.API.Services.Checklists;
using TicketSystem.API.Services.Realtime;
using TicketSystem.API.Hubs;
using TicketSystem.API.Authorization;
using TicketSystem.API.Middleware;
using QuestPDF.Infrastructure;
using TicketSystem.API.Data;
using TicketSystem.API.Data.Seeders;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

QuestPDF.Settings.License = LicenseType.Community;

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TicketSystem.API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
    .UseSnakeCaseNamingConvention()
);

builder.Services.AddHttpClient("AccessControlAPI", client =>
{
    client.BaseAddress = new Uri("http://localhost:8083");
});

builder.Services.AddScoped<ExternalAuthService>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("A Chave JWT não foi encontrada nas configurações.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken)
                    && (path.StartsWithSegments("/hubs/checklists") || path.StartsWithSegments("/hubs/tickets")))
                    context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanManageSystem", policy => 
        policy.RequireRole("admin"));

    options.AddPolicy(TicketAccessPolicy.CanManageTickets, policy =>
        policy.RequireAssertion(context =>
            TicketAccessPolicy.CanManage(
                context.User.FindAll(ClaimTypes.Role).Select(c => c.Value))));
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserContext, UserContext>();

builder.Services.AddScoped<ILiveDowntimeDashboardService, LiveDowntimeDashboardService>();
builder.Services.AddScoped<IDowntimeHistoricalService, DowntimeHistoricalService>();
builder.Services.AddScoped<ILiveExpandedAnalyticsService, LiveExpandedAnalyticsService>();
builder.Services.AddScoped<IHistoricalExpandedAnalyticsService, HistoricalExpandedAnalyticsService>();

builder.Services.AddScoped<IChecklistAssignmentService, ChecklistAssignmentService>();
builder.Services.AddSingleton<IChecklistPdfModelBuilder, ChecklistPdfModelBuilder>();
builder.Services.AddScoped<IChecklistNotifier, ChecklistNotifier>();
builder.Services.AddScoped<ITicketNotifier, TicketNotifier>();

builder.Services.AddSignalR();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        await ProductionLineSeeder.SeedAsync(context);
        await DepartmentSeeder.SeedAsync(context);
        await FieldTemplateSeeder.SeedAsync(context);
        await ChecklistTemplateSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Erro fatal ao inicializar o banco de dados.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseForwardedHeaders();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<PlantAccessMiddleware>();
app.UseMiddleware<KioskAccessMiddleware>();
app.MapControllers();
app.MapHub<ChecklistHub>("/hubs/checklists");
app.MapHub<TicketHub>("/hubs/tickets");

await app.RunAsync();