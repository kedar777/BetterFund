using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int CampaignId { get; set; }

    public int UserId { get; set; }

    public string Text { get; set; } = null!;

    public virtual Campaign Campaign { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
