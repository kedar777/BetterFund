using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Document
{
    public int DocumentId { get; set; }

    public int? CampaignId { get; set; }

    public byte[]? Documents { get; set; }

    public virtual Campaign? Campaign { get; set; }

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
}
