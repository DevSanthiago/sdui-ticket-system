using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChecklistLifecycleAndTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChecklistContent",
                table: "Tickets",
                type: "json",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "ChecklistStatus",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ChecklistTemplateId",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "ChecklistTemplates",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TriggerFieldId",
                table: "ChecklistTemplates",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TriggerFieldValue",
                table: "ChecklistTemplates",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ChecklistTemplates_DepartmentId_IsActive",
                table: "ChecklistTemplates",
                columns: new[] { "DepartmentId", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ChecklistTemplates_DepartmentId_IsActive",
                table: "ChecklistTemplates");

            migrationBuilder.DropColumn(
                name: "ChecklistContent",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ChecklistStatus",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ChecklistTemplateId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "ChecklistTemplates");

            migrationBuilder.DropColumn(
                name: "TriggerFieldId",
                table: "ChecklistTemplates");

            migrationBuilder.DropColumn(
                name: "TriggerFieldValue",
                table: "ChecklistTemplates");
        }
    }
}
