using System;
using System.Collections.Generic;

namespace Models;

public class Buyer
{
    public int BuyerId { get; set; }
    public int UserId { get; set; }
    public string BuyerType { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PreferredCommodity { get; set; } = string.Empty;
    public string CommodityGroup { get; set; } = string.Empty;
    public decimal MinQuantity { get; set; }
    public decimal MaxQuantity { get; set; }
    public string AcceptedGrades { get; set; } = string.Empty;
    public decimal MaxSourcingDistance { get; set; }
    public decimal Rating { get; set; }
    public int TotalTransactions { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;

    public ICollection<BuyerRequirement> BuyerRequirements { get; set; } = new List<BuyerRequirement>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<BuyerRecommendation> BuyerRecommendations { get; set; } = new List<BuyerRecommendation>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<AbnormalPriceAlert> AbnormalPriceAlerts { get; set; } = new List<AbnormalPriceAlert>();
}
