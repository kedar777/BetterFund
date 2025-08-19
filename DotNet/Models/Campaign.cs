using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Campaign
{
    public int CampaignId { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public int CategoryId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public float TargetAmt { get; set; }

    public string? Status { get; set; }

    public int? WalletId { get; set; }

    public byte[]? Documents { get; set; }

    public int? DocumentId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual Document? Document { get; set; }

    public virtual ICollection<Document> DocumentsNavigation { get; set; } = new List<Document>();

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public virtual User User { get; set; } = null!;

    public virtual Wallet? Wallet { get; set; }
}
