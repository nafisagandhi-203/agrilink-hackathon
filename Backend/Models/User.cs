using System;
using System.Collections.Generic;

namespace Models;

public class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Role Role { get; set; } = null!;
    public Farmer? Farmer { get; set; }
    public Buyer? Buyer { get; set; }
    public Admin? Admin { get; set; }
    public UserVerification? UserVerification { get; set; }

    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<VoiceInteraction> VoiceInteractions { get; set; } = new List<VoiceInteraction>();
    public ICollection<UserVerification> VerificationsPerformed { get; set; } = new List<UserVerification>();
    public ICollection<Offer> OffersMade { get; set; } = new List<Offer>();
}
