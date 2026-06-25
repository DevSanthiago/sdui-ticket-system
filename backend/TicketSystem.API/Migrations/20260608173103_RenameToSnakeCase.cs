using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class RenameToSnakeCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChecklistTemplates_Plants_PlantId",
                table: "ChecklistTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Plants_PlantId",
                table: "Departments");

            migrationBuilder.DropForeignKey(
                name: "FK_FieldTemplates_Plants_PlantId",
                table: "FieldTemplates");

            migrationBuilder.DropForeignKey(
                name: "FK_LinePrefixes_Plants_PlantId",
                table: "LinePrefixes");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductionLines_Plants_PlantId",
                table: "ProductionLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Plants_PlantId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Plants",
                table: "Plants");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Departments",
                table: "Departments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductionLines",
                table: "ProductionLines");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LinePrefixes",
                table: "LinePrefixes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FieldTemplates",
                table: "FieldTemplates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChecklistTemplates",
                table: "ChecklistTemplates");

            migrationBuilder.RenameTable(
                name: "Tickets",
                newName: "tickets");

            migrationBuilder.RenameTable(
                name: "Plants",
                newName: "plants");

            migrationBuilder.RenameTable(
                name: "Departments",
                newName: "departments");

            migrationBuilder.RenameTable(
                name: "ProductionLines",
                newName: "production_lines");

            migrationBuilder.RenameTable(
                name: "LinePrefixes",
                newName: "line_prefixes");

            migrationBuilder.RenameTable(
                name: "FieldTemplates",
                newName: "field_templates");

            migrationBuilder.RenameTable(
                name: "ChecklistTemplates",
                newName: "checklist_templates");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "tickets",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "tickets",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "TechnicianName",
                table: "tickets",
                newName: "technician_name");

            migrationBuilder.RenameColumn(
                name: "TechnicianId",
                table: "tickets",
                newName: "technician_id");

            migrationBuilder.RenameColumn(
                name: "StartedAt",
                table: "tickets",
                newName: "started_at");

            migrationBuilder.RenameColumn(
                name: "ResolutionFeedback",
                table: "tickets",
                newName: "resolution_feedback");

            migrationBuilder.RenameColumn(
                name: "ProductionLineId",
                table: "tickets",
                newName: "production_line_id");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "tickets",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "MonitorName",
                table: "tickets",
                newName: "monitor_name");

            migrationBuilder.RenameColumn(
                name: "MonitorId",
                table: "tickets",
                newName: "monitor_id");

            migrationBuilder.RenameColumn(
                name: "LineStoppedTime",
                table: "tickets",
                newName: "line_stopped_time");

            migrationBuilder.RenameColumn(
                name: "IsLineStopped",
                table: "tickets",
                newName: "is_line_stopped");

            migrationBuilder.RenameColumn(
                name: "FinishedAt",
                table: "tickets",
                newName: "finished_at");

            migrationBuilder.RenameColumn(
                name: "DynamicAnswers",
                table: "tickets",
                newName: "dynamic_answers");

            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "tickets",
                newName: "department_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "tickets",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "ChecklistTemplateId",
                table: "tickets",
                newName: "checklist_template_id");

            migrationBuilder.RenameColumn(
                name: "ChecklistStatus",
                table: "tickets",
                newName: "checklist_status");

            migrationBuilder.RenameColumn(
                name: "ChecklistContent",
                table: "tickets",
                newName: "checklist_content");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_ProductionLineId",
                table: "tickets",
                newName: "ix_tickets_production_line_id");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_PlantId",
                table: "tickets",
                newName: "ix_tickets_plant_id");

            migrationBuilder.RenameIndex(
                name: "IX_Tickets_DepartmentId",
                table: "tickets",
                newName: "ix_tickets_department_id");

            migrationBuilder.RenameColumn(
                name: "Slug",
                table: "plants",
                newName: "slug");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "plants",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "plants",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "plants",
                newName: "is_active");

            migrationBuilder.RenameIndex(
                name: "IX_Plants_Slug",
                table: "plants",
                newName: "ix_plants_slug");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "departments",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "departments",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Badges",
                table: "departments",
                newName: "badges");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "departments",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "departments",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "departments",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "IconName",
                table: "departments",
                newName: "icon_name");

            migrationBuilder.RenameColumn(
                name: "FormSchema",
                table: "departments",
                newName: "form_schema");

            migrationBuilder.RenameColumn(
                name: "CardColorHex",
                table: "departments",
                newName: "card_color_hex");

            migrationBuilder.RenameColumn(
                name: "AllowedRoles",
                table: "departments",
                newName: "allowed_roles");

            migrationBuilder.RenameIndex(
                name: "IX_Departments_PlantId",
                table: "departments",
                newName: "ix_departments_plant_id");

            migrationBuilder.RenameColumn(
                name: "Prefix",
                table: "production_lines",
                newName: "prefix");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "production_lines",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "production_lines",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedByUserId",
                table: "production_lines",
                newName: "updated_by_user_id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "production_lines",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "production_lines",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "LineName",
                table: "production_lines",
                newName: "line_name");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "production_lines",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "production_lines",
                newName: "created_by_user_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "production_lines",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_ProductionLines_Prefix",
                table: "production_lines",
                newName: "ix_production_lines_prefix");

            migrationBuilder.RenameIndex(
                name: "IX_ProductionLines_PlantId",
                table: "production_lines",
                newName: "ix_production_lines_plant_id");

            migrationBuilder.RenameIndex(
                name: "IX_ProductionLines_LineName",
                table: "production_lines",
                newName: "ix_production_lines_line_name");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "line_prefixes",
                newName: "value");

            migrationBuilder.RenameColumn(
                name: "Label",
                table: "line_prefixes",
                newName: "label");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "line_prefixes",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "line_prefixes",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "line_prefixes",
                newName: "is_active");

            migrationBuilder.RenameIndex(
                name: "IX_LinePrefixes_PlantId",
                table: "line_prefixes",
                newName: "ix_line_prefixes_plant_id");

            migrationBuilder.RenameColumn(
                name: "Schema",
                table: "field_templates",
                newName: "schema");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "field_templates",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "field_templates",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "field_templates",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "field_templates",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "field_templates",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_FieldTemplates_PlantId_Name",
                table: "field_templates",
                newName: "ix_field_templates_plant_id_name");

            migrationBuilder.RenameColumn(
                name: "Schema",
                table: "checklist_templates",
                newName: "schema");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "checklist_templates",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "checklist_templates",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "checklist_templates",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "checklist_templates",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "TriggerFieldValue",
                table: "checklist_templates",
                newName: "trigger_field_value");

            migrationBuilder.RenameColumn(
                name: "TriggerFieldId",
                table: "checklist_templates",
                newName: "trigger_field_id");

            migrationBuilder.RenameColumn(
                name: "PlantId",
                table: "checklist_templates",
                newName: "plant_id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "checklist_templates",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "IconName",
                table: "checklist_templates",
                newName: "icon_name");

            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "checklist_templates",
                newName: "department_id");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "checklist_templates",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "CardColorHex",
                table: "checklist_templates",
                newName: "card_color_hex");

            migrationBuilder.RenameColumn(
                name: "AllowedRoles",
                table: "checklist_templates",
                newName: "allowed_roles");

            migrationBuilder.RenameIndex(
                name: "IX_ChecklistTemplates_PlantId",
                table: "checklist_templates",
                newName: "ix_checklist_templates_plant_id");

            migrationBuilder.RenameIndex(
                name: "IX_ChecklistTemplates_DepartmentId_IsActive",
                table: "checklist_templates",
                newName: "ix_checklist_templates_department_id_is_active");

            migrationBuilder.AddPrimaryKey(
                name: "pk_tickets",
                table: "tickets",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_plants",
                table: "plants",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_departments",
                table: "departments",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_production_lines",
                table: "production_lines",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_line_prefixes",
                table: "line_prefixes",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_field_templates",
                table: "field_templates",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_checklist_templates",
                table: "checklist_templates",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_checklist_templates_plants_plant_id",
                table: "checklist_templates",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_departments_plants_plant_id",
                table: "departments",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_field_templates_plants_plant_id",
                table: "field_templates",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_line_prefixes_plants_plant_id",
                table: "line_prefixes",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_production_lines_plants_plant_id",
                table: "production_lines",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_tickets_departments_department_id",
                table: "tickets",
                column: "department_id",
                principalTable: "departments",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_tickets_plants_plant_id",
                table: "tickets",
                column: "plant_id",
                principalTable: "plants",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_tickets_production_lines_production_line_id",
                table: "tickets",
                column: "production_line_id",
                principalTable: "production_lines",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_checklist_templates_plants_plant_id",
                table: "checklist_templates");

            migrationBuilder.DropForeignKey(
                name: "fk_departments_plants_plant_id",
                table: "departments");

            migrationBuilder.DropForeignKey(
                name: "fk_field_templates_plants_plant_id",
                table: "field_templates");

            migrationBuilder.DropForeignKey(
                name: "fk_line_prefixes_plants_plant_id",
                table: "line_prefixes");

            migrationBuilder.DropForeignKey(
                name: "fk_production_lines_plants_plant_id",
                table: "production_lines");

            migrationBuilder.DropForeignKey(
                name: "fk_tickets_departments_department_id",
                table: "tickets");

            migrationBuilder.DropForeignKey(
                name: "fk_tickets_plants_plant_id",
                table: "tickets");

            migrationBuilder.DropForeignKey(
                name: "fk_tickets_production_lines_production_line_id",
                table: "tickets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_tickets",
                table: "tickets");

            migrationBuilder.DropPrimaryKey(
                name: "pk_plants",
                table: "plants");

            migrationBuilder.DropPrimaryKey(
                name: "pk_departments",
                table: "departments");

            migrationBuilder.DropPrimaryKey(
                name: "pk_production_lines",
                table: "production_lines");

            migrationBuilder.DropPrimaryKey(
                name: "pk_line_prefixes",
                table: "line_prefixes");

            migrationBuilder.DropPrimaryKey(
                name: "pk_field_templates",
                table: "field_templates");

            migrationBuilder.DropPrimaryKey(
                name: "pk_checklist_templates",
                table: "checklist_templates");

            migrationBuilder.RenameTable(
                name: "tickets",
                newName: "Tickets");

            migrationBuilder.RenameTable(
                name: "plants",
                newName: "Plants");

            migrationBuilder.RenameTable(
                name: "departments",
                newName: "Departments");

            migrationBuilder.RenameTable(
                name: "production_lines",
                newName: "ProductionLines");

            migrationBuilder.RenameTable(
                name: "line_prefixes",
                newName: "LinePrefixes");

            migrationBuilder.RenameTable(
                name: "field_templates",
                newName: "FieldTemplates");

            migrationBuilder.RenameTable(
                name: "checklist_templates",
                newName: "ChecklistTemplates");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "Tickets",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Tickets",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "technician_name",
                table: "Tickets",
                newName: "TechnicianName");

            migrationBuilder.RenameColumn(
                name: "technician_id",
                table: "Tickets",
                newName: "TechnicianId");

            migrationBuilder.RenameColumn(
                name: "started_at",
                table: "Tickets",
                newName: "StartedAt");

            migrationBuilder.RenameColumn(
                name: "resolution_feedback",
                table: "Tickets",
                newName: "ResolutionFeedback");

            migrationBuilder.RenameColumn(
                name: "production_line_id",
                table: "Tickets",
                newName: "ProductionLineId");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "Tickets",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "monitor_name",
                table: "Tickets",
                newName: "MonitorName");

            migrationBuilder.RenameColumn(
                name: "monitor_id",
                table: "Tickets",
                newName: "MonitorId");

            migrationBuilder.RenameColumn(
                name: "line_stopped_time",
                table: "Tickets",
                newName: "LineStoppedTime");

            migrationBuilder.RenameColumn(
                name: "is_line_stopped",
                table: "Tickets",
                newName: "IsLineStopped");

            migrationBuilder.RenameColumn(
                name: "finished_at",
                table: "Tickets",
                newName: "FinishedAt");

            migrationBuilder.RenameColumn(
                name: "dynamic_answers",
                table: "Tickets",
                newName: "DynamicAnswers");

            migrationBuilder.RenameColumn(
                name: "department_id",
                table: "Tickets",
                newName: "DepartmentId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Tickets",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "checklist_template_id",
                table: "Tickets",
                newName: "ChecklistTemplateId");

            migrationBuilder.RenameColumn(
                name: "checklist_status",
                table: "Tickets",
                newName: "ChecklistStatus");

            migrationBuilder.RenameColumn(
                name: "checklist_content",
                table: "Tickets",
                newName: "ChecklistContent");

            migrationBuilder.RenameIndex(
                name: "ix_tickets_production_line_id",
                table: "Tickets",
                newName: "IX_Tickets_ProductionLineId");

            migrationBuilder.RenameIndex(
                name: "ix_tickets_plant_id",
                table: "Tickets",
                newName: "IX_Tickets_PlantId");

            migrationBuilder.RenameIndex(
                name: "ix_tickets_department_id",
                table: "Tickets",
                newName: "IX_Tickets_DepartmentId");

            migrationBuilder.RenameColumn(
                name: "slug",
                table: "Plants",
                newName: "Slug");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Plants",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Plants",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Plants",
                newName: "IsActive");

            migrationBuilder.RenameIndex(
                name: "ix_plants_slug",
                table: "Plants",
                newName: "IX_Plants_Slug");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Departments",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Departments",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "badges",
                table: "Departments",
                newName: "Badges");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Departments",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "Departments",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Departments",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "icon_name",
                table: "Departments",
                newName: "IconName");

            migrationBuilder.RenameColumn(
                name: "form_schema",
                table: "Departments",
                newName: "FormSchema");

            migrationBuilder.RenameColumn(
                name: "card_color_hex",
                table: "Departments",
                newName: "CardColorHex");

            migrationBuilder.RenameColumn(
                name: "allowed_roles",
                table: "Departments",
                newName: "AllowedRoles");

            migrationBuilder.RenameIndex(
                name: "ix_departments_plant_id",
                table: "Departments",
                newName: "IX_Departments_PlantId");

            migrationBuilder.RenameColumn(
                name: "prefix",
                table: "ProductionLines",
                newName: "Prefix");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "ProductionLines",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "ProductionLines",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_by_user_id",
                table: "ProductionLines",
                newName: "UpdatedByUserId");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "ProductionLines",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "ProductionLines",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "line_name",
                table: "ProductionLines",
                newName: "LineName");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "ProductionLines",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "created_by_user_id",
                table: "ProductionLines",
                newName: "CreatedByUserId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "ProductionLines",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_production_lines_prefix",
                table: "ProductionLines",
                newName: "IX_ProductionLines_Prefix");

            migrationBuilder.RenameIndex(
                name: "ix_production_lines_plant_id",
                table: "ProductionLines",
                newName: "IX_ProductionLines_PlantId");

            migrationBuilder.RenameIndex(
                name: "ix_production_lines_line_name",
                table: "ProductionLines",
                newName: "IX_ProductionLines_LineName");

            migrationBuilder.RenameColumn(
                name: "value",
                table: "LinePrefixes",
                newName: "Value");

            migrationBuilder.RenameColumn(
                name: "label",
                table: "LinePrefixes",
                newName: "Label");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "LinePrefixes",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "LinePrefixes",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "LinePrefixes",
                newName: "IsActive");

            migrationBuilder.RenameIndex(
                name: "ix_line_prefixes_plant_id",
                table: "LinePrefixes",
                newName: "IX_LinePrefixes_PlantId");

            migrationBuilder.RenameColumn(
                name: "schema",
                table: "FieldTemplates",
                newName: "Schema");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "FieldTemplates",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "FieldTemplates",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "FieldTemplates",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "FieldTemplates",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "FieldTemplates",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_field_templates_plant_id_name",
                table: "FieldTemplates",
                newName: "IX_FieldTemplates_PlantId_Name");

            migrationBuilder.RenameColumn(
                name: "schema",
                table: "ChecklistTemplates",
                newName: "Schema");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "ChecklistTemplates",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "ChecklistTemplates",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "ChecklistTemplates",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "ChecklistTemplates",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "trigger_field_value",
                table: "ChecklistTemplates",
                newName: "TriggerFieldValue");

            migrationBuilder.RenameColumn(
                name: "trigger_field_id",
                table: "ChecklistTemplates",
                newName: "TriggerFieldId");

            migrationBuilder.RenameColumn(
                name: "plant_id",
                table: "ChecklistTemplates",
                newName: "PlantId");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "ChecklistTemplates",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "icon_name",
                table: "ChecklistTemplates",
                newName: "IconName");

            migrationBuilder.RenameColumn(
                name: "department_id",
                table: "ChecklistTemplates",
                newName: "DepartmentId");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "ChecklistTemplates",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "card_color_hex",
                table: "ChecklistTemplates",
                newName: "CardColorHex");

            migrationBuilder.RenameColumn(
                name: "allowed_roles",
                table: "ChecklistTemplates",
                newName: "AllowedRoles");

            migrationBuilder.RenameIndex(
                name: "ix_checklist_templates_plant_id",
                table: "ChecklistTemplates",
                newName: "IX_ChecklistTemplates_PlantId");

            migrationBuilder.RenameIndex(
                name: "ix_checklist_templates_department_id_is_active",
                table: "ChecklistTemplates",
                newName: "IX_ChecklistTemplates_DepartmentId_IsActive");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Plants",
                table: "Plants",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Departments",
                table: "Departments",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductionLines",
                table: "ProductionLines",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LinePrefixes",
                table: "LinePrefixes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FieldTemplates",
                table: "FieldTemplates",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChecklistTemplates",
                table: "ChecklistTemplates",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChecklistTemplates_Plants_PlantId",
                table: "ChecklistTemplates",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Plants_PlantId",
                table: "Departments",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FieldTemplates_Plants_PlantId",
                table: "FieldTemplates",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LinePrefixes_Plants_PlantId",
                table: "LinePrefixes",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductionLines_Plants_PlantId",
                table: "ProductionLines",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Plants_PlantId",
                table: "Tickets",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets",
                column: "ProductionLineId",
                principalTable: "ProductionLines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
