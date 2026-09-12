using System;
using Models.Enums;

namespace Models;

public class UserVerification
{
    public int UserVerificationId { get; set; }
    public int UserId { get; set; }
    public VerificationStatus VerificationStatus { get; set; }
    public int? VerifiedByUserId { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string Remarks { get; set; } = string.Empty;

    public User User { get; set; } = null!;
    public User? VerifiedByUser { get; set; }
}
