using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HackathonProject.Migrations
{
    [DbContext(typeof(Data.ApplicationDbContext))]
    [Migration("20260913090000_AddEstimatedFareDistanceNote")]
    /// <inheritdoc />
    public partial class AddEstimatedFareDistanceNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedFare",
                table: "TransportBookings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DistanceNote",
                table: "TransportBookings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedFare",
                table: "TransportBookings");

            migrationBuilder.DropColumn(
                name: "DistanceNote",
                table: "TransportBookings");
        }
    }
}