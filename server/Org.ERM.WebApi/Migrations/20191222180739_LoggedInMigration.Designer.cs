﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Org.ERM.WebApi;

namespace Org.ERM.Server.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20191222180739_LoggedInMigration")]
    partial class LoggedInMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .HasColumnType("varchar(255) CHARACTER SET utf8mb4");

                    b.Property<DateTime>("LastLoggedIn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("OrganizationId");

                    b.ToTable("Employee");
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Organization");
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReview", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("EmployeeId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId");

                    b.ToTable("PerformanceReview");
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReviewACL", b =>
                {
                    b.Property<int>("PerformanceReviewId")
                        .HasColumnType("int");

                    b.Property<int>("EmployeeId")
                        .HasColumnType("int");

                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.HasKey("PerformanceReviewId", "EmployeeId");

                    b.HasIndex("EmployeeId");

                    b.ToTable("PerformanceReviewACL");
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReviewFeedback", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("PerformanceReviewId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("PerformanceReviewId");

                    b.ToTable("PerformanceReviewFeedback");
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.Employee", b =>
                {
                    b.HasOne("Org.ERM.WebApi.Models.Domain.Organization", "Organization")
                        .WithMany("Employees")
                        .HasForeignKey("OrganizationId")
                        .HasConstraintName("ForeignKey_Employee_Organization")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReview", b =>
                {
                    b.HasOne("Org.ERM.WebApi.Models.Domain.Employee", "Employee")
                        .WithMany("PerformanceReviews")
                        .HasForeignKey("EmployeeId")
                        .HasConstraintName("ForeignKey_PerformanceReview_Employee")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReviewACL", b =>
                {
                    b.HasOne("Org.ERM.WebApi.Models.Domain.Employee", "Employee")
                        .WithMany("PermittedPerformanceReviews")
                        .HasForeignKey("EmployeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Org.ERM.WebApi.Models.Domain.PerformanceReview", "PerformanceReview")
                        .WithMany("PermittedEmployees")
                        .HasForeignKey("PerformanceReviewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Org.ERM.WebApi.Models.Domain.PerformanceReviewFeedback", b =>
                {
                    b.HasOne("Org.ERM.WebApi.Models.Domain.PerformanceReview", "PerformanceReview")
                        .WithMany("PerformanceReviewFeedbacks")
                        .HasForeignKey("PerformanceReviewId")
                        .HasConstraintName("ForeignKey_PerformanceReviewFeedback_PerformanceReview")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}