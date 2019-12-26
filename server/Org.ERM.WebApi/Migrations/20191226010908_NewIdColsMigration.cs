using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Org.ERM.Server.Migrations
{
    public partial class NewIdColsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "PerformanceReviewFeedback",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ForEmployeeId",
                table: "PerformanceReviewFeedback",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FromEmployeeId",
                table: "PerformanceReviewFeedback",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "PerformanceReviewFeedback",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte>(
                name: "Rating",
                table: "PerformanceReviewFeedback",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedOn",
                table: "PerformanceReview",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "PerformanceReview",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviewFeedback_ForEmployeeId",
                table: "PerformanceReviewFeedback",
                column: "ForEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviewFeedback_FromEmployeeId",
                table: "PerformanceReviewFeedback",
                column: "FromEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReviewFeedback_OrganizationId",
                table: "PerformanceReviewFeedback",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceReview_OrganizationId",
                table: "PerformanceReview",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceReview_Organization_OrganizationId",
                table: "PerformanceReview",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceReviewFeedback_Employee_ForEmployeeId",
                table: "PerformanceReviewFeedback",
                column: "ForEmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceReviewFeedback_Employee_FromEmployeeId",
                table: "PerformanceReviewFeedback",
                column: "FromEmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PerformanceReviewFeedback_Organization_OrganizationId",
                table: "PerformanceReviewFeedback",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceReview_Organization_OrganizationId",
                table: "PerformanceReview");

            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceReviewFeedback_Employee_ForEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceReviewFeedback_Employee_FromEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropForeignKey(
                name: "FK_PerformanceReviewFeedback_Organization_OrganizationId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceReviewFeedback_ForEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceReviewFeedback_FromEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceReviewFeedback_OrganizationId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropIndex(
                name: "IX_PerformanceReview_OrganizationId",
                table: "PerformanceReview");

            migrationBuilder.DropColumn(
                name: "Comment",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropColumn(
                name: "ForEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropColumn(
                name: "FromEmployeeId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "PerformanceReviewFeedback");

            migrationBuilder.DropColumn(
                name: "CompletedOn",
                table: "PerformanceReview");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "PerformanceReview");
        }
    }
}
