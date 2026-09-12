using System;
using Models.Enums;

namespace DTOs;

public class BuyerDto
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
}

public class CreateBuyerDto
{
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
}

public class UpdateBuyerDto
{
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
}
