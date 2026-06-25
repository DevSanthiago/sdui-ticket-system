using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNeomCardProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CardColorHex",
                table: "Departments",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Departments",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardColorHex",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Departments");
        }
    }
}
