using System;
using Models.Enums;

namespace DTOs;

public class UserVerificationDto
{
    public int UserVerificationId { get; set; }
    public int UserId { get; set; }
    public VerificationStatus VerificationStatus { get; set; }
    public int? VerifiedByUserId { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class CreateUserVerificationDto
{
    public int UserId { get; set; }
    public VerificationStatus VerificationStatus { get; set; }
    public int? VerifiedByUserId { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class UpdateUserVerificationDto
{
    public VerificationStatus VerificationStatus { get; set; }
    public int? VerifiedByUserId { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string Remarks { get; set; } = string.Empty;
}
