using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string Rname { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
