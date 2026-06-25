using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class MultiPlantArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Slug = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plants", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql("INSERT INTO Plants (Name, Slug, IsActive) VALUES ('Matriz', 'matriz', 1);");

            migrationBuilder.AddColumn<int>(
                name: "PlantId",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "PlantId",
                table: "ProductionLines",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "PlantId",
                table: "LinePrefixes",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "PlantId",
                table: "Departments",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_PlantId",
                table: "Tickets",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionLines_PlantId",
                table: "ProductionLines",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_LinePrefixes_PlantId",
                table: "LinePrefixes",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_PlantId",
                table: "Departments",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_Slug",
                table: "Plants",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Plants_PlantId",
                table: "Departments",
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
                name: "FK_Tickets_Plants_PlantId",
                table: "Tickets",
                column: "PlantId",
                principalTable: "Plants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Plants_PlantId",
                table: "Departments");

            migrationBuilder.DropForeignKey(
                name: "FK_LinePrefixes_Plants_PlantId",
                table: "LinePrefixes");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductionLines_Plants_PlantId",
                table: "ProductionLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Plants_PlantId",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "Plants");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_PlantId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_ProductionLines_PlantId",
                table: "ProductionLines");

            migrationBuilder.DropIndex(
                name: "IX_LinePrefixes_PlantId",
                table: "LinePrefixes");

            migrationBuilder.DropIndex(
                name: "IX_Departments_PlantId",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "ProductionLines");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "LinePrefixes");

            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "Departments");
        }
    }
}
