using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string Cname { get; set; } = null!;

    public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
}
