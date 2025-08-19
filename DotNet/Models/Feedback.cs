using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int UserId { get; set; }

    public string Message { get; set; } = null!;

    public int? Rating { get; set; }

    public virtual User? User { get; set; }  // ✅ FIX: Must be nullable, no = null!
}
