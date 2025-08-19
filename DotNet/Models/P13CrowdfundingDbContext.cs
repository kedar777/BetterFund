using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace WebApplication1.Models;

public partial class P13CrowdfundingDbContext : DbContext
{
    public P13CrowdfundingDbContext()
    {
    }

    public P13CrowdfundingDbContext(DbContextOptions<P13CrowdfundingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Campaign> Campaigns { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<Donation> Donations { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SuccessStory> SuccessStories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Wallet> Wallets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=Kedar@121;database=p13_crowdfunding_db", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(e => e.CampaignId).HasName("PRIMARY");

            entity.ToTable("campaign");

            entity.HasIndex(e => e.CategoryId, "category_id");

            entity.HasIndex(e => e.DocumentId, "fk_campaign_document");

            entity.HasIndex(e => e.WalletId, "fk_campaign_wallet");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.DocumentId).HasColumnName("document_id");
            entity.Property(e => e.Documents)
                .HasColumnType("mediumblob")
                .HasColumnName("documents");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(15)
                .HasDefaultValueSql("'active'")
                .HasColumnName("status");
            entity.Property(e => e.TargetAmt).HasColumnName("target_amt");
            entity.Property(e => e.Title)
                .HasMaxLength(80)
                .HasColumnName("title");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.WalletId).HasColumnName("wallet_id");

            entity.HasOne(d => d.Category).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("campaign_ibfk_2");

            entity.HasOne(d => d.Document).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.DocumentId)
                .HasConstraintName("fk_campaign_document");

            entity.HasOne(d => d.User).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("campaign_ibfk_1");

            entity.HasOne(d => d.Wallet).WithMany(p => p.Campaigns)
                .HasForeignKey(d => d.WalletId)
                .HasConstraintName("fk_campaign_wallet");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity.ToTable("category");

            entity.HasIndex(e => e.Cname, "cname").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Cname)
                .HasMaxLength(50)
                .HasColumnName("cname");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PRIMARY");

            entity.ToTable("comment");

            entity.HasIndex(e => e.CampaignId, "campaign_id");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.CommentId).HasColumnName("comment_id");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.Text)
                .HasMaxLength(200)
                .HasColumnName("text");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Campaign).WithMany(p => p.Comments)
                .HasForeignKey(d => d.CampaignId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("comment_ibfk_1");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("comment_ibfk_2");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.DocumentId).HasName("PRIMARY");

            entity.ToTable("documents");

            entity.HasIndex(e => e.CampaignId, "fk_documents_campaign");

            entity.Property(e => e.DocumentId).HasColumnName("document_id");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id");
            entity.Property(e => e.Documents)
                .HasColumnType("mediumblob")
                .HasColumnName("documents");

            entity.HasOne(d => d.Campaign).WithMany(p => p.DocumentsNavigation)
                .HasForeignKey(d => d.CampaignId)
                .HasConstraintName("fk_documents_campaign");
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.DonationId).HasName("PRIMARY");

            entity.ToTable("donation");

            entity.HasIndex(e => e.Campaignid, "campaignid");

            entity.HasIndex(e => e.WalletId, "wallet_id");

            entity.Property(e => e.DonationId).HasColumnName("donation_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.Campaignid).HasColumnName("campaignid");
            entity.Property(e => e.DonationTime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime")
                .HasColumnName("donation_time");
            entity.Property(e => e.WalletId).HasColumnName("wallet_id");

            entity.HasOne(d => d.Campaign).WithMany(p => p.Donations)
                .HasForeignKey(d => d.Campaignid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("donation_ibfk_1");

            entity.HasOne(d => d.Wallet).WithMany(p => p.Donations)
                .HasForeignKey(d => d.WalletId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("donation_ibfk_2");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PRIMARY");

            entity.ToTable("feedback");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");
            entity.Property(e => e.Message)
                .HasMaxLength(200)
                .HasColumnName("message");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("feedback_ibfk_1");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PRIMARY");

            entity.ToTable("role");

            entity.HasIndex(e => e.Rname, "rname").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Rname)
                .HasMaxLength(30)
                .HasColumnName("rname");
        });

        modelBuilder.Entity<SuccessStory>(entity =>
        {
            entity.HasKey(e => e.SuccessId).HasName("PRIMARY");

            entity.ToTable("success_stories");

            entity.Property(e => e.SuccessId).HasColumnName("success_id");
            entity.Property(e => e.FundRaised).HasColumnName("fund_raised");
            entity.Property(e => e.Images)
                .HasColumnType("mediumblob")
                .HasColumnName("images");
            entity.Property(e => e.Updates)
                .HasMaxLength(200)
                .HasColumnName("updates");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.AdharNo, "adhar_no").IsUnique();

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.PhoneNo, "phone_no").IsUnique();

            entity.HasIndex(e => e.RoleId, "role_id");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.AdharNo)
                .HasMaxLength(12)
                .HasColumnName("adhar_no");
            entity.Property(e => e.Email)
                .HasMaxLength(80)
                .HasColumnName("email");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(10)
                .HasColumnName("phone_no");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Uname)
                .HasMaxLength(50)
                .HasColumnName("uname");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_ibfk_1");
        });

        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.HasKey(e => e.WalletId).HasName("PRIMARY");

            entity.ToTable("wallet");

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.WalletId).HasColumnName("wallet_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.CreationDate).HasColumnName("creation_date");
            entity.Property(e => e.CurBalance).HasColumnName("cur_balance");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Wallets)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("wallet_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
