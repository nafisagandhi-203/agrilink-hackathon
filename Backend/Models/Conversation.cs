using System;
using System.Collections.Generic;

namespace Models;

public class Conversation
{
    public int ConversationId { get; set; }
    public int FarmerId { get; set; }
    public int BuyerId { get; set; }
    public int CropListingId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Farmer Farmer { get; set; } = null!;
    public Buyer Buyer { get; set; } = null!;
    public CropListing CropListing { get; set; } = null!;

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
