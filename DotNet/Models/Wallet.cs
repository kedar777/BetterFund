using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Wallet
{
    public int WalletId { get; set; }

    public int UserId { get; set; }

    public float Amount { get; set; }

    public float CurBalance { get; set; }

    public DateOnly CreationDate { get; set; }

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public virtual User User { get; set; } = null!;
}
