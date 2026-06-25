using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductionLineToPlantZone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "production_line_id",
                table: "plant_zones",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_plant_zones_production_line_id",
                table: "plant_zones",
                column: "production_line_id");

            migrationBuilder.AddForeignKey(
                name: "fk_plant_zones_production_lines_production_line_id",
                table: "plant_zones",
                column: "production_line_id",
                principalTable: "production_lines",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_plant_zones_production_lines_production_line_id",
                table: "plant_zones");

            migrationBuilder.DropIndex(
                name: "ix_plant_zones_production_line_id",
                table: "plant_zones");

            migrationBuilder.DropColumn(
                name: "production_line_id",
                table: "plant_zones");
        }
    }
}
