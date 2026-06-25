using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBadgesToDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Departments");

            migrationBuilder.AddColumn<string>(
                name: "Badges",
                table: "Departments",
                type: "json",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Badges",
                table: "Departments");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Departments",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
