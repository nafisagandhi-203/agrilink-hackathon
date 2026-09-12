using System;
using System.Collections.Generic;

namespace Models;

public class Farmer
{
    public int FarmerId { get; set; }
    public int UserId { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string FarmLocation { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public decimal FarmSize { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;

    public ICollection<CropListing> CropListings { get; set; } = new List<CropListing>();
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
