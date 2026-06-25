using Microsoft.EntityFrameworkCore;
using TicketSystem.API.Models;
using TicketSystem.API.Enums;

namespace TicketSystem.API.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Plant> Plants { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<ProductionLine> ProductionLines { get; set; }
        public DbSet<LinePrefix> LinePrefixes { get; set; }
        public DbSet<ChecklistTemplate> ChecklistTemplates { get; set; }
        public DbSet<FieldTemplate> FieldTemplates { get; set; }
        public DbSet<PlantConnector> PlantConnectors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Plant>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.HasIndex(e => e.Slug).IsUnique();
            });

            modelBuilder.Entity<LinePrefix>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Value).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Label).IsRequired().HasMaxLength(50);
                entity.Property(e => e.IsActive).HasDefaultValue(true);

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.LinePrefixes)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ProductionLine>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.LineName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Prefix).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Description).HasMaxLength(200);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

                entity.HasIndex(e => e.LineName).IsUnique();
                entity.HasIndex(e => e.Prefix);

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.ProductionLines)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.CardColorHex).HasMaxLength(10);
                entity.Property(e => e.IconName).IsRequired().HasMaxLength(50);
                
                entity.Property(e => e.Badges).HasColumnType("json");
                entity.Property(e => e.FormSchema).HasColumnType("json");

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.Departments)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ChecklistTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.CardColorHex).HasMaxLength(10);
                entity.Property(e => e.IconName).IsRequired().HasMaxLength(50);

                entity.Property(e => e.Schema).HasColumnType("json");
                entity.Property(e => e.AllowedRoles).HasColumnType("json");

                entity.Property(e => e.TriggerFieldId).HasMaxLength(150);
                entity.Property(e => e.TriggerFieldValue).HasMaxLength(150);
                entity.HasIndex(e => new { e.DepartmentId, e.IsActive });

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.ChecklistTemplates)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<FieldTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Schema).HasColumnType("json");

                entity.HasIndex(e => new { e.PlantId, e.Name }).IsUnique();

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.FieldTemplates)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PlantConnector>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Source).HasConversion<int>();
                entity.Property(e => e.Panel).HasConversion<int>().HasDefaultValue(ConnectorPanel.Andon);
                entity.Property(e => e.Prefix).HasMaxLength(10);

                entity.HasOne(e => e.Plant)
                      .WithMany(p => p.PlantConnectors)
                      .HasForeignKey(e => e.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.MonitorName).IsRequired().HasMaxLength(150);
                entity.Property(e => e.TechnicianName).HasMaxLength(150);
                entity.Property(e => e.LineStoppedTime).HasMaxLength(50);
                
                entity.Property(e => e.DynamicAnswers).HasColumnType("json");

                entity.Property(e => e.ResolutionFeedback).HasMaxLength(2000);

                entity.Property(e => e.ChecklistStatus).HasConversion<int>();
                entity.Property(e => e.ChecklistContent).HasColumnType("json");

                entity.HasOne(t => t.Plant)
                      .WithMany(p => p.Tickets)
                      .HasForeignKey(t => t.PlantId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.Department)
                      .WithMany(d => d.Tickets)
                      .HasForeignKey(t => t.DepartmentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(t => t.ProductionLine)
                      .WithMany(p => p.Tickets)
                      .HasForeignKey(t => t.ProductionLineId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}