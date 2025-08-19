using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Donation
{
    public int DonationId { get; set; }

    public float Amount { get; set; }

    public int Campaignid { get; set; }

    public int WalletId { get; set; }

    public DateTime? DonationTime { get; set; }

    public virtual Campaign Campaign { get; set; } = null!;

    public virtual Wallet Wallet { get; set; } = null!;
}
