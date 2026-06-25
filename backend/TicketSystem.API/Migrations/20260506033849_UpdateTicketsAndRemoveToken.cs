using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketsAndRemoveToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ConfirmationToken",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "ProductionLineId1",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ProductionLineId1",
                table: "Tickets",
                column: "ProductionLineId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets",
                column: "ProductionLineId",
                principalTable: "ProductionLines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId1",
                table: "Tickets",
                column: "ProductionLineId1",
                principalTable: "ProductionLines",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId1",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_ProductionLineId1",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ProductionLineId1",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "ConfirmationToken",
                table: "Tickets",
                type: "varchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Departments_DepartmentId",
                table: "Tickets",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_ProductionLines_ProductionLineId",
                table: "Tickets",
                column: "ProductionLineId",
                principalTable: "ProductionLines",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
