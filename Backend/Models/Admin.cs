using System;

namespace Models;

public class Admin
{
    public int AdminId { get; set; }
    public int UserId { get; set; }
    public string Department { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
