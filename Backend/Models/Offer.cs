using System;
using System.Collections.Generic;
using Models.Enums;

namespace Models;

public class Offer
{
    public int OfferId { get; set; }
    public int CropListingId { get; set; }
    public int BuyerId { get; set; }
    public int OfferedByUserId { get; set; }
    public decimal Quantity { get; set; }
    public decimal OfferedPrice { get; set; }
    public DateTime DeliveryDate { get; set; }
    public string DeliveryConditions { get; set; } = string.Empty;
    public int? ParentOfferId { get; set; }
    public OfferStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public CropListing CropListing { get; set; } = null!;
    public Buyer Buyer { get; set; } = null!;
    public User OfferedByUser { get; set; } = null!;
    public Offer? ParentOffer { get; set; }
    public ICollection<Offer> CounterOffers { get; set; } = new List<Offer>();

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<AbnormalPriceAlert> AbnormalPriceAlerts { get; set; } = new List<AbnormalPriceAlert>();
}
